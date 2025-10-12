// src/services/profiles/api.ts
import { axiosInstance, getAccessToken, getStoredUser } from "@/services/AxiosInstance";

/* ================================
 * 타입
 * ================================ */
import {
    ProfileType,
    UpdateProfilePayloadType,
    PatchMyProfileRequestType, // 서버 스펙에 따라 사용 가능
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
 * 공통: sleep, rand, safeJson
 * ================================ */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
const safeJson = (v: any) => {
    try {
        return JSON.stringify(v, null, 2);
    } catch {
        return String(v);
    }
};

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
 * 서버 최소간격 (예: 10초 1회)
 * ================================ */
const RL_WINDOW_MS = 10_500;
const MIN_GAP_MS_READ = RL_WINDOW_MS;
const MIN_GAP_MS_WRITE = RL_WINDOW_MS;
const GLOBAL_MIN_GAP_MS = 400;
const READ_AFTER_WRITE_GAP_MS = RL_WINDOW_MS;

/* ================================
 * Retry-After 파서 (헤더 → ms)
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
    if (kind === "read") {
        const sinceWrite = Date.now() - RL.lastWriteAt;
        if (sinceWrite < READ_AFTER_WRITE_GAP_MS) {
            await sleep(READ_AFTER_WRITE_GAP_MS - sinceWrite);
        }
    }

    const sinceGlobal = Date.now() - RL.lastGlobalCallAt;
    if (sinceGlobal < GLOBAL_MIN_GAP_MS) {
        await sleep(GLOBAL_MIN_GAP_MS - sinceGlobal);
    }

    const last = RL.lastCallAtMap.get(key) ?? 0;
    const sinceKey = Date.now() - last;
    const minGap = kind === "write" ? MIN_GAP_MS_WRITE : MIN_GAP_MS_READ;
    if (sinceKey < minGap) {
        await sleep(minGap - sinceKey);
    }

    let attempt = 0;
    const MAX_RETRY = 6; // 재시도 횟수 상향
    const BASE_MS = RL_WINDOW_MS;
    const JITTER_MS = 250;

    // 재시도 + 지터
    // eslint-disable-next-line no-constant-condition
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
            // 최소 윈도우(10.5s) 보장
            const backoffBase =
                retryAfter != null ? Math.max(retryAfter, BASE_MS) : BASE_MS;
            const backoff = backoffBase + rand(0, JITTER_MS);
            // eslint-disable-next-line no-console
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
// 문자열/숫자 id 정규화 (문자열 "undefined"/"null" 도 무효 처리)
const coerceId = (raw: any): number | string | null => {
    if (raw == null) return null;
    if (typeof raw === "number" && Number.isFinite(raw)) return raw;
    if (typeof raw === "string") {
        const s = raw.trim();
        if (!s || s.toLowerCase() === "undefined" || s.toLowerCase() === "null") return null;
        if (/^\d+$/.test(s)) return Number(s);
        return s;
    }
    return null;
};

const getIdFromStoredUser = (): number | string | null => {
    try {
        const u = getStoredUser?.();
        if (!u) return null;
        return coerceId(u.memberId ?? u.id ?? u.userId);
    } catch {
        return null;
    }
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
    try {
        const token = getAccessToken?.();
        if (!token) return null;
        const p = decodeJwtPayload(token);
        if (!p) return null;
        return coerceId(p.sub ?? p.userId ?? p.memberId ?? p.id);
    } catch {
        return null;
    }
};

// ✅ 최종 안전 id 확보: currentProfile → storedUser → token → (fallback) /members/me 호출
const ensureMyId = async (currentProfile?: ProfileType): Promise<number | string> => {
    const fromCurrent = coerceId(currentProfile?.memberId ?? currentProfile?.id);
    const fromStored  = getIdFromStoredUser();
    const fromToken   = getIdFromToken();

    const id = fromCurrent ?? fromStored ?? fromToken;
    if (id != null) return id;

    // 마지막 수단: 서버에서 me 조회 후 id 가져오기
    const me = await getMyProfile().catch(() => null);
    const fromMe = coerceId(me?.memberId ?? me?.id);
    if (fromMe == null) {
        throw new Error("사용자 id를 확인할 수 없습니다. 다시 로그인해 주세요.");
    }
    return fromMe;
};

/* ================================
 * PATCH 바디/쿼리 빌더 (스웨거 스펙 맞춤)
 * ================================ */
const buildPatchBody = (input: {
    id: number | string;
    email?: string;
    nickname?: string;
}) => {
    const body: Record<string, string | number> = { id: input.id };
    if (typeof input.email === "string") {
        const s = input.email.trim();
        if (s.length > 0) body.email = s;
    }
    if (typeof input.nickname === "string") {
        const s = input.nickname.trim();
        if (s.length > 0) body.nickname = s;
    }
    return body;
};

const buildPatchParams = (input: {
    id: number | string;
    email?: string;
    nickname?: string;
}) => {
    const params: Record<string, string | number> = { id: input.id };
    if (typeof input.email === "string") {
        const s = input.email.trim();
        if (s.length > 0) params.email = s;
    }
    if (typeof input.nickname === "string") {
        const s = input.nickname.trim();
        if (s.length > 0) params.nickname = s;
    }
    return params;
};

/* ================================
 * PATCH /members/me  (스웨거: query에 id 필수)
 * ================================ */
let patchLock = false;
export const patchMyProfile = async (
    payload: UpdateProfilePayloadType,
    currentProfile?: ProfileType
): Promise<ProfileType> => {
    while (patchLock) await sleep(80);
    patchLock = true;

    let reqBody: Record<string, any> = {};
    let reqParams: Record<string, any> = {};
    let lastStatus: number | undefined;
    let lastServerMsg: any;

    try {
        // 1) id 확보 (스웨거: query id 필수)
        const fromCurrent = coerceId(currentProfile?.memberId ?? currentProfile?.id);
        const fromStored = getIdFromStoredUser();
        const fromToken = getIdFromToken();
        const myId = fromCurrent ?? fromStored ?? fromToken;
        if (myId == null) {
            throw new Error("로그인 정보에서 사용자 식별자(id)를 가져올 수 없습니다.");
        }

        // 2) 스펙에 맞춘 body/params 구성
        reqBody = buildPatchBody({
            id: myId,
            email: payload?.email,
            nickname: payload?.nickname,
        });
        reqParams = buildPatchParams({
            id: myId,
            email: payload?.email,
            nickname: payload?.nickname,
        });

        // 3) 요청
        const key = "PATCH:/members/me";
        const data = await withRateLimit(key, "write", async () => {
            const res = await axiosInstance.patch("/members/me", reqBody, {
                params: reqParams, // ✅ 쿼리에 id 포함
                headers: { "Content-Type": "application/json" },
            });
            return res.data;
        });

        return normalize<ProfileType>(data);
    } catch (e: any) {
        lastStatus = e?.response?.status;
        lastServerMsg = e?.response?.data ?? e?.message;

        // eslint-disable-next-line no-console
        console.error(
            "[PATCH /members/me] failed",
            "\nstatus:", lastStatus,
            "\nparams:", safeJson(reqParams),
            "\nbody:", safeJson(reqBody),
            "\nserverMsg:", safeJson(lastServerMsg)
        );

        if (lastStatus === 400) {
            throw new Error(
                typeof lastServerMsg === "string"
                    ? lastServerMsg
                    : "프로필 수정 요청이 서버 검증에 실패했습니다. 입력 값을 확인해주세요."
            );
        }
        throw e;
    } finally {
        patchLock = false;
    }
};

/* ================================
 * DELETE /members/me
 * ================================ */

// 성공 신호를 2xx로 통일(+ 서버 메시지 보존)
type DeleteMeOk = {
    ok: true;
    message?: string;
    code?: string;
    timestamp?: string;
    raw?: unknown; // 서버 원본(디버깅용)
};

// 동시 중복 호출 합치기(in-flight coalescing)
let inFlightDeleteMe: Promise<DeleteMeOk> | null = null;

export const deleteMe = async (refreshToken: string): Promise<DeleteMeOk> => {
    const key = "DELETE:/members/me";

    if (inFlightDeleteMe) return inFlightDeleteMe;

    inFlightDeleteMe = withRateLimit<DeleteMeOk>(key, "write", async () => {
        const res = await axiosInstance.delete("/members/me", {
            params: { refreshToken },
        });

        const data = res?.data as any;

        const message =
            typeof data === "string"
                ? data
                : typeof data?.message === "string"
                    ? data.message
                    : undefined;

        const code =
            typeof data === "object" && data && typeof data.code === "string"
                ? data.code
                : undefined;

        const timestamp =
            typeof data === "object" && data && typeof data.timestamp === "string"
                ? data.timestamp
                : undefined;

        return {
            ok: true,
            message,
            code,
            timestamp,
            raw: data,
        };
    })
        .then((v) => v as DeleteMeOk)
        .finally(() => {
            inFlightDeleteMe = null;
        });

    return inFlightDeleteMe;
};
