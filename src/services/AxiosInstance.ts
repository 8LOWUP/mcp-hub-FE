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

// ✅ SSR-safe localStorage 유틸 (외부에서도 쓸 수 있게 export)
export const getLocalStorageItem = (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error("localStorage 접근 오류:", error);
        return null;
    }
};

export const removeLocalStorageItem = (key: string): void => {
    if (typeof window === "undefined") return;
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("localStorage 삭제 오류:", error);
    }
};

// ✅ (중요) 토큰/유저 getter를 export해서 다른 모듈에서 재사용
export const getAccessToken = (): string | null => {
    const { accessToken } = useLoginStore.getState();
    if (accessToken) return accessToken;

    const rawAccessToken = getLocalStorageItem(LOCAL_STORAGE_KEY.accessToken);
    return rawAccessToken?.replace(/^"(.*)"$/, "$1") || null;
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

// 요청 인터셉터: 매 요청마다 실시간으로 토큰을 확인하고 추가
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const url = config.url || "";
        const isPublicPath = PUBLIC_PATHS.some((path) => url.startsWith(path));

        if (!isPublicPath) {
            const accessToken = getAccessToken();
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
                console.log("✅ Authorization 헤더 추가됨:", config.headers.Authorization);
            } else {
                console.warn("⚠️ accessToken 없음, Authorization 헤더 미포함");
            }
        } else {
            console.log("✅ 공개 API, Authorization 헤더 제외:", config.url);
        }

        return config;
    },
    (error) => {
        console.error("❌ 요청 인터셉터 오류:", error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 401 등 에러 처리
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        console.error("❌ API 응답 오류:", error);

        if (error.response?.status === 401) {
            console.warn("🔒 인증 토큰이 만료되었습니다. 로그인이 필요합니다.");

            const { logout } = useLoginStore.getState();
            logout();

            removeLocalStorageItem(LOCAL_STORAGE_KEY.accessToken);
            removeLocalStorageItem(LOCAL_STORAGE_KEY.refreshToken);
            removeLocalStorageItem(LOCAL_STORAGE_KEY.user);

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

// API 응답 타입 정의
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// HTTP 메서드별 래퍼 함수들
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
