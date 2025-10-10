import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY, PUBLIC_PATHS, API_BASE_URL } from "../constants/apis/key";
import { useLoginStore } from "../store/login/login-store";
import { apiService } from "./api";

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
    const { accessToken, isLoggedIn } = useLoginStore.getState();
    console.log('🔐 토큰 확인:', { 
        hasZustandToken: !!accessToken, 
        isLoggedIn, 
        zustandToken: accessToken ? `${accessToken.substring(0, 20)}...` : null 
    });
    
    if (accessToken) {
        return accessToken;
    }
    
    // localStorage에서 토큰 가져오기 (fallback) - Zustand persist 방식
    const loginStorage = getLocalStorageItem('login-storage');
    let fallbackToken = null;
    
    if (loginStorage) {
        try {
            const parsed = JSON.parse(loginStorage);
            fallbackToken = parsed?.state?.accessToken || null;
        } catch (error) {
            console.error('localStorage 파싱 오류:', error);
        }
    }
    
    console.log('🔐 localStorage 토큰 확인:', { 
        hasLoginStorage: !!loginStorage,
        hasFallbackToken: !!fallbackToken,
        fallbackToken: fallbackToken ? `${fallbackToken.substring(0, 20)}...` : null
    });
    
    return fallbackToken;
};

// JWT 토큰 만료 시간 확인 함수
const isTokenExpired = (token: string): boolean => {
    try {
        // JWT 토큰 디코딩 (payload 부분)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp < currentTime;
        
        console.log('⏰ 토큰 만료 확인:', {
            exp: payload.exp,
            currentTime,
            isExpired,
            expiresIn: new Date(payload.exp * 1000).toLocaleString()
        });
        
        return isExpired;
    } catch (error) {
        console.error('토큰 디코딩 오류:', error);
        return true; // 디코딩 실패 시 만료된 것으로 간주
    }
};

// 요청 인터셉터: 매 요청마다 실시간으로 토큰을 확인하고 추가
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 인증이 필요하지 않은 API 경로들 (더 정확한 매칭)
        const isPublicPath = PUBLIC_PATHS.some(path => {
            // 정확한 경로 매칭을 위해 더 구체적으로 체크
            if (config.url?.includes('/mcps/') && config.method !== 'get') {
                // MCP 수정/삭제 등은 인증 필요
                return false;
            }
            if (config.url?.includes('/workspaces/') && config.method !== 'get') {
                // 워크스페이스 수정/삭제 등은 인증 필요
                return false;
            }
            return config.url?.includes(path);
        });
        
        console.log('🔍 API 경로 체크:', {
            url: config.url,
            method: config.method?.toUpperCase(),
            isPublicPath,
            matchedPublicPath: PUBLIC_PATHS.find(path => config.url?.includes(path))
        });
        
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
        
        // MCP 관련 요청인 경우 상세 로깅
        if (config.url?.includes('/mcps')) {
            console.log('🔧 MCP 요청 상세 정보:');
            console.log('  - URL:', config.url);
            console.log('  - Method:', config.method?.toUpperCase());
            console.log('  - Headers:', config.headers);
            console.log('  - Data:', config.data);
            console.log('  - Params:', config.params);
        }
        
        return config;
    },
    (error) => {
        console.error("❌ 요청 인터셉터 오류:", error);
        return Promise.reject(error);
    }
);

// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
}> = [];

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    
    failedQueue = [];
};

// 응답 인터셉터: 401, 400 에러 처리 등
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error) => {
        console.error("❌ API 응답 오류:", error);
        
        const originalRequest = error.config;
        
        // 401 Unauthorized 에러 처리
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.warn("🔒 인증 토큰이 만료되었습니다. 토큰 갱신을 시도합니다.");
            
            // MCP 관련 요청인 경우 자동 리다이렉트 방지
            const isMcpRequest = error.config?.url?.includes('/mcps');
            if (isMcpRequest) {
                console.warn("🔄 MCP 요청 401 에러 - 자동 리다이렉트 방지");
                return Promise.reject(error);
            }
            
            // 이미 토큰 갱신 중인 경우
            if (isRefreshing) {
                console.log("🔄 토큰 갱신 중... 요청을 대기열에 추가합니다.");
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }
            
            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
                // 리프레시 토큰으로 새 액세스 토큰 요청
                const { refreshToken, setTokens } = useLoginStore.getState();

                console.warn("🔄 리프레시 토큰으로 새 액세스 토큰을 요청한 결과:", refreshToken);
                
                if (!refreshToken) {
                    throw new Error('리프레시 토큰이 없습니다.');
                }
                
                console.log("🔄 리프레시 토큰으로 새 액세스 토큰을 요청합니다...");
                
                // 인터셉터 비적용 axios로 재발급 요청 (순환 방지)
                const response = await apiService.auth.reissueToken(refreshToken);

                if (response.code === 'COMMON200' && response.result?.accessToken) {
                    const newAccessToken = response.result.accessToken;
                    
                    // 새 토큰 저장
                    setTokens(newAccessToken, refreshToken);
                    
                    console.log("✅ 토큰 갱신 성공! 대기 중인 요청들을 재시도합니다.");
                    
                    // 대기 중인 요청들 처리
                    processQueue(null, newAccessToken);
                    
                    // 원래 요청 재시도
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                } else {
                    throw new Error('토큰 갱신 응답이 올바르지 않습니다.');
                }
            } catch (refreshError) {
                console.error("❌ 토큰 갱신 실패:", refreshError);
                
                // 대기 중인 요청들 실패 처리
                processQueue(refreshError, null);
                
                // 리프레시 요청의 응답 상태에 따라 처리 분기
                const status = (refreshError as any)?.response?.status;
                if (status === 401 || status === 403) {
                    
                    // 리프레시 토큰도 유효하지 않음 → 확정 로그아웃 및 스토리지 정리
                    const { logout } = useLoginStore.getState();
                    logout();
                    // Zustand persist가 자동으로 localStorage 정리하므로 수동 삭제 불필요
                } else {
                    // 일시적 오류(400, 404, 5xx, 네트워크 등) → 스토리지 보존
                    console.warn("⚠️ 재발급 실패이지만 토큰은 보존합니다. status:", status);
                }
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        // 403 Forbidden 에러 처리
        if (error.response?.status === 403) {
            console.warn("403 에러가 발생했습니다");
        }
        
        // 404 Not Found 에러 처리
        if (error.response?.status === 404) {
            console.warn("404 에러가 발생했습니다.");
        }
        
        // 500 Internal Server Error 처리
        if (error.response?.status >= 500) {
            console.error("500번 이상 오류가 발생했습니다. 서버 내부 오류가 발생했습니다.");
        }
        
        return Promise.reject(error);
    }
);

// API 응답 타입 정의
export interface ApiResponse<T = any> {
    result?: T;
    message: string;
    code: string;
    timestamp: string;
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