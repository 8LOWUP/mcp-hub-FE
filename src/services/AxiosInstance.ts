//AxiosInstance.ts
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY, PUBLIC_PATHS, API_BASE_URL } from "@/constants/apis/key";
import { useLoginStore } from "@/store/login/login-store";

/* ================================
 * BASE_URL (dev 프록시 + prod 실제 주소)
 * ================================ */
const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE_URL;
const BASE_URL =
    process.env.NODE_ENV !== "production"
        ? "/__api" // dev는 동일출처 프록시 경유(CORS 회피)
        : (RAW_BASE_URL || "").replace(/\/+$/, "");

if (process.env.NODE_ENV !== "production") {
    console.log("[Axios] BASE_URL:", BASE_URL);
}

/* ================================
 * axios 인스턴스
 * ================================ */
export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // ✅ 세션 쿠키 인증 대응 (JWT도 무해)
    headers: {
        Accept: "application/json",
    },
    timeout: 180000, // 180초
});

/* ================================
 * localStorage 유틸
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

export const removeLocalStorageItem = (key?: string): void => {
    if (typeof window === "undefined") return;
    try {
        if (key) {
            localStorage.removeItem(key);
        } else {
            localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
            localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
            localStorage.removeItem(LOCAL_STORAGE_KEY.user);
            localStorage.removeItem("login-storage"); // Zustand persist 키
        }
    } catch (error) {
        console.error("localStorage 삭제 오류:", error);
    }
};

/* ================================
 * 토큰 / 유저 Getter
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
    const { user } = useLoginStore.getState();
    if (user) return user;

    const raw = getLocalStorageItem(LOCAL_STORAGE_KEY.user);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export const getRefreshToken = (): string | null => {
    const state = useLoginStore.getState() as any;
    const fromStore: string | null = state?.refreshToken ?? null;
    const raw = getLocalStorageItem(LOCAL_STORAGE_KEY.refreshToken);
    const fromLS = raw?.replace(/^"(.*)"$/, "$1") || null;
    return fromStore || fromLS;
};

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
        sessionStorage.setItem("BLOCK_AUTH_ONCE", "1");
    }
};

/* ================================
 * JWT 만료 체크 (디버깅용)
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
        return true;
    }
};

/* ================================
 * 요청 인터셉터
 * ================================ */
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // ✅ PUBLIC_PATHS와 정확히 일치하는 경우만 공개 API로 간주
        let isPublicPath = PUBLIC_PATHS.some(path => config.url === path);

        // ✅ 194 기능 통합: 부분 일치 + GET 메서드면 공개 GET API로 처리
        const isGetRequest = config.method?.toUpperCase() === "GET";
        const includesPublic = PUBLIC_PATHS.some(path => config.url?.includes(path));
        if (!isPublicPath && includesPublic && isGetRequest) {
            isPublicPath = true;
            if (process.env.NODE_ENV !== "production") {
                console.log("🌍 공개 GET API로 인식:", config.url);
            }
        }

        // ✅ [추가] 토큰 엔드포인트는 무조건 Private로 강제 (GET/POST 모두)
        if (config.url?.includes("/workspaces/mcps/token")) {
            isPublicPath = false;
            if (process.env.NODE_ENV !== "production") {
                console.log("🛡️ 토큰 엔드포인트는 항상 Private 처리:", config.url);
            }
        }

        // ✅ /mcps/dashboard/meta는 강제로 인증 필요하도록 예외 처리
        if (config.url?.includes("/mcps/dashboard/meta")) {
            isPublicPath = false;
        }

        // ✅ 요청 본문이 FormData인 경우 Content-Type 자동 변경
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
            // 👉 axios가 boundary 포함된 multipart 헤더를 자동으로 세팅하게 둡니다.
            console.log("📎 FormData 감지됨 → multipart/form-data로 전송");
        }

        // ✅ 토큰 확인
        const accessToken = getAccessToken();

        // ✅ 공개 GET API (로그인 상태면 Authorization 추가)
        if (isPublicPath && isGetRequest) {
            if (accessToken) {
                (config.headers as any).Authorization = `Bearer ${accessToken}`;
                if (process.env.NODE_ENV !== "production") {
                    console.log("🔑 로그인 상태 공개 GET API 요청, Authorization 추가:", config.url);
                }
            } else if (process.env.NODE_ENV !== "production") {
                console.log("🌍 비로그인 상태 공개 GET API 요청:", config.url);
            }
        }
        // ✅ Private API (항상 Authorization 필요)
        else {
            if (accessToken) {
                (config.headers as any).Authorization = `Bearer ${accessToken}`;
                if (process.env.NODE_ENV !== "production") {
                    console.log("🔒 Private API 요청, Authorization 추가:", config.url);
                }
            } else {
                console.warn("⚠️ Private API 요청인데 accessToken 없음:", config.url);
            }
        }

        return config;
    },
    (error) => {
        console.error("❌ 요청 인터셉터 오류:", error);
        return Promise.reject(error);
    }
);

/* ================================
 * 토큰 재발급 큐 (기존 180 그대로 유지)
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

            // MCP 요청은 자동 재시도 제외 (직접 다시 호출)
            const isMcpRequest = originalRequest.url?.includes("/mcps");
            if (isMcpRequest) {
                console.warn("🔄 MCP 401 - 자동 재시도 생략");
                return Promise.reject(error);
            }

            if (isRefreshing) {
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

                setTokens(newAccessToken, refreshToken);
                processQueue(null, newAccessToken);

                (originalRequest.headers as any).Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError: any) {
                console.error("❌ 토큰 갱신 실패:", refreshError);
                processQueue(refreshError, null);

                const status = refreshError?.response?.status;
                if (status === 401 || status === 403) {
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

        if (error.response?.status === 400) {
            console.warn("⚠️ 400: 잘못된 요청 - LLM 토큰 오류 가능성");
            // 400 에러는 특별한 처리가 필요할 수 있으므로 그대로 전달
        }
        if (error.response?.status === 403) console.warn("🚫 접근 권한이 없습니다.");
        if (error.response?.status === 404) console.warn("🔍 요청한 리소스가 없습니다.");
        if (error.response?.status >= 500) console.error("🔥 서버 내부 오류(5xx)");

        return Promise.reject(error);
    }
);

/* ================================
 * API Wrapper
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
