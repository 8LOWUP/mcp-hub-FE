//AxiosInstance.ts
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY, PUBLIC_PATHS, API_BASE_URL } from "../constants/apis/key";
import { useLoginStore } from "../store/login/login-store";

// Next.js 환경변수 사용 (환경변수가 있으면 우선 사용, 없으면 constants의 기본값 사용)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE_URL;

console.log('BASE_URL', BASE_URL);

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Next.js에서 localStorage 사용을 위한 유틸리티 함수
const getLocalStorageItem = (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error('localStorage 접근 오류:', error);
        return null;
    }
};

const removeLocalStorageItem = (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('localStorage 삭제 오류:', error);
    }
};

// 토큰 가져오기 함수 (Zustand 스토어에서 우선, 없으면 localStorage에서)
const getAccessToken = (): string | null => {
    // Zustand 스토어에서 토큰 가져오기
    const { accessToken } = useLoginStore.getState();
    if (accessToken) {
        return accessToken;
    }
    
    // localStorage에서 토큰 가져오기 (fallback)
    const rawAccessToken = getLocalStorageItem(LOCAL_STORAGE_KEY.accessToken);
    return rawAccessToken?.replace(/^"(.*)"$/, '$1') || null;
};

// 요청 인터셉터: 매 요청마다 실시간으로 토큰을 확인하고 추가
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 인증이 필요하지 않은 API 경로들
        const isPublicPath = PUBLIC_PATHS.some(path => config.url?.includes(path));

        // 공개 API가 아닌 경우에만 Authorization 헤더 추가
        if (!isPublicPath) {
            // 토큰 가져오기 (Zustand 스토어 우선, localStorage fallback)
            const accessToken = getAccessToken();
            
            // 토큰이 존재할 때만 Authorization 헤더 추가
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

// 응답 인터셉터: 401, 400 에러 처리 등
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
        console.error("❌ API 응답 오류:", error);
        
        // // 401 Unauthorized 에러 처리 ->잠깐 비활성화
        // if (error.response?.status === 401) {
        //     console.warn("🔒 인증 토큰이 만료되었습니다. 로그인이 필요합니다.");
        //
        //     // Zustand 스토어에서 로그아웃 처리
        //     const { logout } = useLoginStore.getState();
        //     logout();
        //
        //     // localStorage에서도 토큰 제거 (fallback)
        //     removeLocalStorageItem(LOCAL_STORAGE_KEY.accessToken);
        //     removeLocalStorageItem(LOCAL_STORAGE_KEY.refreshToken);
        //     removeLocalStorageItem(LOCAL_STORAGE_KEY.user);
        //
        //     // 로그인 페이지로 리다이렉트 (Next.js router 사용)
        //     if (typeof window !== 'undefined') {
        //         window.location.href = '/login';
        //     }
        // }
        console.error("❌ [401] Unauthorized - 디버깅 중 리다이렉트 비활성화됨");
        
        // 403 Forbidden 에러 처리
        if (error.response?.status === 403) {
            console.warn("🚫 접근 권한이 없습니다.");
        }
        
        // 404 Not Found 에러 처리
        if (error.response?.status === 404) {
            console.warn("🔍 요청한 리소스를 찾을 수 없습니다.");
        }
        
        // 500 Internal Server Error 처리
        if (error.response?.status >= 500) {
            console.error("🔥 서버 내부 오류가 발생했습니다.");
        }
        
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