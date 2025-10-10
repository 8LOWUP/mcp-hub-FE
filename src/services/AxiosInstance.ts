// src/services/AxiosInstance.ts
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY, PUBLIC_PATHS, API_BASE_URL } from "@/constants/apis/key";
import { useLoginStore } from "@/store/login/login-store";

/* ================================
 * BASE_URL (dev 프록시 + prod 실제 주소)
 * ================================ */
const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE_URL;
const BASE_URL =
    process.env.NODE_ENV !== "production"
        ? "/__api" // dev는 동일출처 프록시 경유(CORS 이슈 회피)
        : (RAW_BASE_URL || "").replace(/\/+$/, "");

if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[Axios] BASE_URL:", BASE_URL);
}

/* ================================
 * axios 인스턴스
 * ================================ */
export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: "application/json",
        // "Content-Type": "application/json", // 객체면 axios가 자동 지정
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

    if (process.env.NODE_ENV !== "production") {
        console.log(
            "[AUTH DEBUG]",
            "hasJustDeleted=", state.hasJustDeleted,
            "store=", !!tokenFromStore,
            "ls=", !!tokenFromLS,
            "final=", !!token
        );
    }

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

// ✅ refreshToken getter
export const getRefreshToken = (): string | null => {
    const state = useLoginStore.getState() as any;
    const fromStore: string | null = state?.refreshToken ?? null;

    const raw = getLocalStorageItem(LOCAL_STORAGE_KEY.refreshToken);
    const fromLS = raw?.replace(/^"(.*)"$/, "$1") || null;

    return fromStore || fromLS;
};

// ✅ 인증 상태 완전 정리
export const clearAuth = (): void => {
    const { hardLogout } = useLoginStore.getState() as any;
    if (typeof hardLogout === "function") {
        try {
            hardLogout();
        } catch (e) {
            console.warn("[clearAuth] hardLogout 실행 중 오류:", e);
        }
    } else {
        removeLocalStorageItem();
    }
    if (typeof window !== "undefined") {
        // 다음 요청 1회 Authorization 주입 방지 플래그
        sessionStorage.setItem("BLOCK_AUTH_ONCE", "1");
    }
};

/* ================================
 * (옵션) JWT 만료 체크 - 디버깅용
 * ================================ */
const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        const expired = payload.exp < now;
        if (process.env.NODE_ENV !== "production") {
            console.log("⏰ 토큰 만료 확인:", {
                exp: payload.exp,
                currentTime: now,
                isExpired: expired,
                expiresAt: new Date(payload.exp * 1000).toLocaleString(),
            });
        }
        return expired;
    } catch (error) {
        console.error("토큰 디코딩 오류:", error);
        return true; // 디코딩 실패 시 만료로 간주
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
        const method = (config.method || "get").toLowerCase();

        // 공개 경로 판별(더 정교하게)
        const isPublicPath = PUBLIC_PATHS.some((path) => url.startsWith(path));
        // mcps/workspaces의 비-GET은 항상 인증 필요
        const needsAuthForDomain =
            (url.includes("/mcps/") || url.includes("/workspaces/")) && method !== "get";

        const requireAuth = !isPublicPath || needsAuthForDomain;

        if (process.env.NODE_ENV !== "production") {
            console.log("🔍 API 경로 체크:", {
                url,
                method: method.toUpperCase(),
                isPublicPath,
                needsAuthForDomain,
                matchedPublicPath: PUBLIC_PATHS.find((p) => url.startsWith(p)),
            });
        }

        if (requireAuth) {
            const accessToken = getAccessToken();
            if (accessToken) {
                (config.headers as any).Authorization = `Bearer ${accessToken}`;
                if (process.env.NODE_ENV !== "production") {
                    console.log("✅ Authorization 헤더 추가됨:", (config.headers as any).Authorization);
                }
                // 필요 시 만료 사전 체크 로그
                // isTokenExpired(accessToken) && console.warn("⚠️ 만료된 토큰처럼 보임(사전 체크). 서버에서 처리 예정.");
            } else {
                console.warn("⚠️ accessToken 없음, Authorization 헤더 미포함");
            }
        } else if (process.env.NODE_ENV !== "production") {
            console.log("✅ 공개 API, Authorization 헤더 제외:", url);
        }

        // MCP 요청 상세 로깅
        if (url.includes("/mcps") && process.env.NODE_ENV !== "production") {
            console.log("🔧 MCP 요청 상세:", {
                url,
                method: method.toUpperCase(),
                headers: config.headers,
                data: config.data,
                params: config.params,
            });
        }

        return config;
    },
    (error) => {
        console.error("❌ 요청 인터셉터 오류:", error);
        return Promise.reject(error);
    }
);

/* ================================
 * 토큰 재발급 큐
 * ================================ */
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v?: any) => void; reject: (e?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
    failedQueue = [];
};

/* ================================
 * 응답 인터셉터
 * ================================ */
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        console.error("❌ API 응답 오류:", error);

        const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

        // 401 처리 + 재발급
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            console.warn("🔒 401: 토큰 만료로 판단, 재발급 시도");

            // MCP 요청은 자동 재시도/리다이렉트 제외
            const isMcpRequest = originalRequest.url?.includes("/mcps");
            if (isMcpRequest) {
                console.warn("🔄 MCP 401 - 자동 재시도/리다이렉트 생략");
                return Promise.reject(error);
            }

            if (isRefreshing) {
                if (process.env.NODE_ENV !== "production") console.log("🔄 재발급 대기열 추가");
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (token) {
                            (originalRequest.headers as any).Authorization = `Bearer ${token}`;
                        }
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { refreshToken, setTokens } = useLoginStore.getState();
                if (!refreshToken) throw new Error("리프레시 토큰이 없습니다.");

                if (process.env.NODE_ENV !== "production") {
                    console.log("🔄 리프레시 토큰으로 재발급 요청...");
                }

                // ✅ axios 정석: 본문 없이, params로 전달
                const plain = axios.create({
                    baseURL: BASE_URL,
                    headers: { Accept: "application/json", "Content-Type": "application/json" },
                });
                const reissue = await plain.post(
                    "/members/auth/token/reissue",
                    null,
                    { params: { refreshToken } }
                );

                const newAccessToken = reissue?.data?.result?.accessToken;
                const ok = reissue?.data?.success && !!newAccessToken;
                if (!ok) throw new Error("토큰 갱신 응답이 올바르지 않습니다.");

                // 새 토큰 저장
                setTokens(newAccessToken, refreshToken);

                if (process.env.NODE_ENV !== "production") {
                    console.log("✅ 토큰 갱신 성공 → 대기열 재시도");
                }

                processQueue(null, newAccessToken);

                // 원요청 재시도
                (originalRequest.headers as any).Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError: any) {
                console.error("❌ 토큰 갱신 실패:", refreshError);
                processQueue(refreshError, null);

                const status = refreshError?.response?.status;
                if (status === 401 || status === 403) {
                    // 리프레시까지 만료 → 확정 로그아웃
                    const { logout } = useLoginStore.getState();
                    logout?.();
                    removeLocalStorageItem();
                    if (typeof window !== "undefined") {
                        sessionStorage.setItem("BLOCK_AUTH_ONCE", "1");
                        window.location.href = "/login";
                    }
                } else {
                    console.warn("⚠️ 재발급 실패(일시 오류 가능). 토큰은 보존합니다. status:", status);
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // 그 외 상태 처리
        if (error.response?.status === 403) console.warn("🚫 접근 권한이 없습니다.");
        if (error.response?.status === 404) console.warn("🔍 요청한 리소스가 없습니다.");
        if (error.response?.status >= 500) console.error("🔥 서버 내부 오류(5xx)");

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
    get:   <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
        axiosInstance.get(url, config),
    post:  <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
        axiosInstance.post(url, data, config),
    put:   <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
        axiosInstance.put(url, data, config),
    patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
        axiosInstance.patch(url, data, config),
    delete:<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
        axiosInstance.delete(url, config),
};

export default axiosInstance;
