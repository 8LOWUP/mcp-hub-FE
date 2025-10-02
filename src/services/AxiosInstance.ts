// src/services/AxiosInstance.ts
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY, PUBLIC_PATHS, API_BASE_URL } from "@/constants/apis/key";
import { useLoginStore } from "@/store/login/login-store";

// Next.js 환경변수 사용 (환경변수가 있으면 우선 사용, 없으면 constants의 기본값 사용)
// 뒤 슬래시 제거해서 //members 같은 이슈 예방
const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE_URL;
const BASE_URL =
    process.env.NODE_ENV !== "production"
        ? "/__api" // ⬅️ dev에서는 동일출처 프록시 경유
        : (RAW_BASE_URL || "").replace(/\/+$/, "");

if (process.env.NODE_ENV !== "production") {
    // dev에서만
    // eslint-disable-next-line no-console
    console.log("[Axios] BASE_URL:", BASE_URL);
}

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        // "Content-Type": "application/json", // plain object면 axios가 자동 설정
        Accept: "application/json",
    },
});

/* ================================
 * SSR-safe localStorage 유틸
 * ================================ */
export const getLocalStorageItem = (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error("localStorage 접근 오류:", error);
        return null;
    }
};

// 단일 키 or 전체 정리(매개변수 없으면 전체)
export const removeLocalStorageItem = (key?: string): void => {
    if (typeof window === "undefined") return;
    try {
        if (key) {
            localStorage.removeItem(key);
        } else {
            localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
            localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
            localStorage.removeItem(LOCAL_STORAGE_KEY.user);
            // ✅ zustand persist 저장 키도 제거(중요)
            localStorage.removeItem("login-storage");
        }
    } catch (error) {
        console.error("localStorage 삭제 오류:", error);
    }
};

/* ================================
 * (중요) 토큰/유저 getter
 * ================================ */
export const getAccessToken = (): string | null => {
    const state = useLoginStore.getState();

    const rawAccessToken = getLocalStorageItem(LOCAL_STORAGE_KEY.accessToken);
    const tokenFromLS = rawAccessToken?.replace(/^"(.*)"$/, "$1") || null;
    const tokenFromStore = state.accessToken;
    const token = tokenFromStore || tokenFromLS;

    console.log(
        "[AUTH DEBUG]",
        "hasJustDeleted=",
        state.hasJustDeleted,
        "store=",
        !!tokenFromStore,
        "ls=",
        !!tokenFromLS,
        "final=",
        !!token
    );

    return token;
};

export const getStoredUser = (): any | null => {
    // Zustand 우선
    const { user } = useLoginStore.getState();
    if (user) return user;

    // localStorage fallback
    const raw = getLocalStorageItem(LOCAL_STORAGE_KEY.user);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

// ✅ 추가: refreshToken getter (named export)
export const getRefreshToken = (): string | null => {
    // store에 refreshToken이 있다면 우선 사용 (없어도 안전)
    const state = useLoginStore.getState() as any;
    const fromStore: string | null = state?.refreshToken ?? null;

    const raw = getLocalStorageItem(LOCAL_STORAGE_KEY.refreshToken);
    const fromLS = raw?.replace(/^"(.*)"$/, "$1") || null;

    return fromStore || fromLS;
};

// ✅ 추가: 인증 상태 정리 (named export)
export const clearAuth = (): void => {
    // zustand 스토어에 하드 로그아웃 액션이 있으면 사용
    const { hardLogout } = useLoginStore.getState() as any;
    if (typeof hardLogout === "function") {
        try {
            hardLogout();
        } catch (e) {
            console.warn("[clearAuth] hardLogout 실행 중 오류:", e);
        }
    } else {
        // fallback: 최소한 로컬스토리지/퍼시스트 키는 비운다
        removeLocalStorageItem();
    }

    // 다음 요청 1회 Authorization 주입 방지 플래그
    if (typeof window !== "undefined") {
        sessionStorage.setItem("BLOCK_AUTH_ONCE", "1");
    }
};

/* ================================
 * 요청 인터셉터
 * ================================ */
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // ✅ 탈퇴/강제 로그아웃 직후 첫 요청은 Authorization 강제 차단
        if (typeof window !== "undefined" && sessionStorage.getItem("BLOCK_AUTH_ONCE") === "1") {
            delete (config.headers as any).Authorization;
            sessionStorage.removeItem("BLOCK_AUTH_ONCE");
            return config;
        }

        const url = config.url || "";
        const isPublicPath = PUBLIC_PATHS.some((path) => url.startsWith(path));

        if (!isPublicPath) {
            const accessToken = getAccessToken();
            if (accessToken) {
                (config.headers as any).Authorization = `Bearer ${accessToken}`;
                console.log("✅ Authorization 헤더 추가됨:", (config.headers as any).Authorization);
            } else {
                console.warn("⚠️ accessToken 없음, Authorization 헤더 미포함");
            }
        } else {
            console.log("✅ 공개 API, Authorization 헤더 제외:", config.url);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* ================================
 * 응답 인터셉터
 * ================================ */
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        console.error("❌ API 응답 오류:", error);

        if (error.response?.status === 401) {
            console.warn("🔒 인증 토큰이 만료되었습니다. 로그인이 필요합니다.");

            // ✅ 하드 로그아웃: 메모리 + persist + 로컬키 + 1회 차단 플래그
            const { hardLogout } = useLoginStore.getState() as any;
            if (typeof hardLogout === "function") {
                hardLogout();
            } else {
                removeLocalStorageItem();
                if (typeof window !== "undefined") {
                    sessionStorage.setItem("BLOCK_AUTH_ONCE", "1");
                }
            }

            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }

        if (error.response?.status === 403) console.warn("🚫 접근 권한이 없습니다.");
        if (error.response?.status === 404) console.warn("🔍 요청한 리소스를 찾을 수 없습니다.");
        if (error.response?.status >= 500) console.error("🔥 서버 내부 오류가 발생했습니다.");

        return Promise.reject(error);
    }
);

/* ================================
 * API 응답 타입 & 래퍼
 * ================================ */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export const api = {
    get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
        axiosInstance.get(url, config),

    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
        axiosInstance.post(url, data, config),

    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
        axiosInstance.put(url, data, config),

    patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
        axiosInstance.patch(url, data, config),

    delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
        axiosInstance.delete(url, config),
};

export default axiosInstance;