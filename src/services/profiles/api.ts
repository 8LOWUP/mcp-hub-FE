// src/services/profiles/api.ts
import { axiosInstance, getAccessToken, getStoredUser } from "@/services/AxiosInstance";

/* ================================
 * 타입
 * ================================ */
import {
    ProfileType,
    UpdateProfilePayloadType,
    PatchMyProfileRequestType,
} from "@/types/profiles";

/* ================================
 * normalize
 * ================================ */
const normalize = <T>(raw: unknown): T => {
    if (raw == null) return raw as T;

    if (typeof raw === "object" && raw !== null) {
        const r = raw as Record<string, unknown>;
        return ("result" in r ? (r["result"] as T) : (raw as T));
    }

    if (typeof raw === "string") {
        try {
            const parsed = JSON.parse(raw) as Record<string, unknown>;
            return ("result" in parsed ? (parsed["result"] as T) : (parsed as T));
        } catch {
            return raw as T;
        }
    }

    return raw as T;
};

/* ================================
 * 공통: sleep, rand
 * ================================ */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

/* ================================
 * 전역 RateLimit 스토어 (HMR 방지)
 * ================================ */
type RateLimiterStore = {
    lastCallAtMap: Map<string, number>;
    lastGlobalCallAt: number;
    lastWriteAt: number;
};
const __rl__ = (globalThis as any).__PROFILE_RL__ as RateLimiterStore | undefined;
const RL: RateLimiterStore =
    __rl__ ?? { lastCallAtMap: new Map(), lastGlobalCallAt: 0, lastWriteAt: 0 };
(globalThis as any).__PROFILE_RL__ = RL;

/* ================================
 * 서버에 맞춘 최소간격 설정
 * (x-ratelimit-limit:1;window=PT10S → 10초에 1회)
 * ================================ */
const RL_WINDOW_MS = 10_500;
const MIN_GAP_MS_READ = RL_WINDOW_MS;
const MIN_GAP_MS_WRITE = RL_WINDOW_MS;
const GLOBAL_MIN_GAP_MS = 400;
const READ_AFTER_WRITE_GAP_MS = RL_WINDOW_MS;

/* ================================
 * Retry-After 파서
 * ================================ */
const parseRetryAfterMs = (err: any): number | null => {
    const h = err?.response?.headers;
    if (!h) return null;

    const ra = h["retry-after"] ?? h["Retry-After"];
    if (ra) {
        const n = Number(ra);
        if (Number.isFinite(n)) return n * 1000;
        const t = Date.parse(String(ra));
        if (Number.isFinite(t)) return Math.max(0, t - Date.now());
    }

    const rem = h["x-ratelimit-remaining"];
    const win = h["x-ratelimit-window"]; // e.g. PT10S
    if (String(rem ?? "") === "0" && typeof win === "string") {
        const m = win.match(/^PT(\d+)([SMH])$/i);
        if (m) {
            const v = Number(m[1]);
            const unit = m[2].toUpperCase();
            const ms =
                unit === "S" ? v * 1000 : unit === "M" ? v * 60_000 : v * 3_600_000;
            return ms;
        }
        return RL_WINDOW_MS;
    }

    return null;
};

/* ================================
 * Rate-limit wrapper
 * ================================ */
const withRateLimit = async <T>(
    key: string,
    kind: "read" | "write",
    fn: () => Promise<T>
): Promise<T> => {
    // 쓰기 직후 읽기 지연
    if (kind === "read") {
        const sinceWrite = Date.now() - RL.lastWriteAt;
        if (sinceWrite < READ_AFTER_WRITE_GAP_MS) {
            await sleep(READ_AFTER_WRITE_GAP_MS - sinceWrite);
        }
    }

    // 전역 최소 간격
    const sinceGlobal = Date.now() - RL.lastGlobalCallAt;
    if (sinceGlobal < GLOBAL_MIN_GAP_MS) {
        await sleep(GLOBAL_MIN_GAP_MS - sinceGlobal);
    }

    // 엔드포인트별 최소 간격
    const last = RL.lastCallAtMap.get(key) ?? 0;
    const sinceKey = Date.now() - last;
    const minGap = kind === "write" ? MIN_GAP_MS_WRITE : MIN_GAP_MS_READ;
    if (sinceKey < minGap) {
        await sleep(minGap - sinceKey);
    }

    let attempt = 0;
    const MAX_RETRY = 3;
    const BASE_MS = RL_WINDOW_MS;
    const JITTER_MS = 250;

    while (true) {
        try {
            const res = await fn();
            const ts = Date.now();
            RL.lastCallAtMap.set(key, ts);
            RL.lastGlobalCallAt = ts;
            if (kind === "write") RL.lastWriteAt = ts;
            return res;
        } catch (err: any) {
            const status = err?.response?.status;
            const retriable = status === 429 || status === 503 || status === 504;
            if (!retriable || attempt >= MAX_RETRY) throw err;

            attempt += 1;
            const retryAfter = parseRetryAfterMs(err);
            const backoff = (retryAfter ?? BASE_MS) + rand(0, JITTER_MS);
            console.warn(
                `[rate-limit] ${key} ${status} → retry #${attempt} after ${backoff}ms`
            );
            await sleep(backoff);
        }
    }
};

/* ================================
 * /members/me GET
 * ================================ */
let inFlightGetMe: Promise<ProfileType> | null = null;
export const getMyProfile = async (): Promise<ProfileType> => {
    const key = "GET:/members/me";
    if (!inFlightGetMe) {
        inFlightGetMe = withRateLimit(key, "read", async () => {
            const { data } = await axiosInstance.get("/members/me");
            return normalize<ProfileType>(data);
        }).finally(() => {
            inFlightGetMe = null;
        });
    }
    return inFlightGetMe;
};


/* ================================
 * id 유틸
 * ================================ */
const coerceId = (raw: any): number | string | null => {
    if (raw == null) return null;
    if (typeof raw === "number" && Number.isFinite(raw)) return raw;
    if (typeof raw === "string") {
        const s = raw.trim();
        if (!s) return null;
        if (/^\d+$/.test(s)) return Number(s);
        return s;
    }
    return null;
};
const getIdFromStoredUser = (): number | string | null => {
    const u = getStoredUser?.();
    if (!u) return null;
    return coerceId(u.memberId ?? u.id ?? u.userId);
};
const decodeJwtPayload = (token: string): any | null => {
    try {
        if (typeof window === "undefined") return null;
        const base64Url = token.split(".")[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const json = atob(base64);
        return JSON.parse(json);
    } catch {
        return null;
    }
};
const getIdFromToken = (): number | string | null => {
    const token = getAccessToken?.();
    if (!token) return null;
    const p = decodeJwtPayload(token);
    if (!p) return null;
    return coerceId(p.sub ?? p.userId ?? p.memberId ?? p.id);
};

/* ================================
 * PATCH /members/me
 * ================================ */
let patchLock = false;
export const patchMyProfile = async (
    payload: UpdateProfilePayloadType,
    currentProfile?: ProfileType
): Promise<ProfileType> => {
    while (patchLock) {
        await sleep(80);
    }
    patchLock = true;

    try {
        const fromCurrent = coerceId(currentProfile?.memberId ?? currentProfile?.id);
        const fromStored = getIdFromStoredUser();
        const fromToken = getIdFromToken();
        const myId = fromCurrent ?? fromStored ?? fromToken;
        if (myId == null) {
            throw new Error("로그인 정보에서 사용자 식별자를 가져올 수 없습니다.");
        }

        const body: { id: number | string; email?: string; nickname?: string } = { id: myId };
        if (payload?.email) body.email = String(payload.email).trim();
        if (payload?.nickname) body.nickname = String(payload.nickname).trim();

        const key = "PATCH:/members/me";
        const data = await withRateLimit(key, "write", async () => {
            const { data } = await axiosInstance.patch("/members/me", body);
            return data;
        });

        return normalize<ProfileType>(data);
    } finally {
        patchLock = false;
    }
};

/* ================================
 * DELETE /members/me
 * ================================ */
export const deleteMe = async (
    refreshToken: string
): Promise<string | { message?: string }> => {
    const key = "DELETE:/members/me";
    const data = await withRateLimit(key, "write", async () => {
        const { data } = await axiosInstance.delete("/members/me", {
            params: { refreshToken },
        });
        return data;
    });
    return normalize(data);
};
