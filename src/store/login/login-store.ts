import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 사용자 정보 타입
export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  provider?: 'google' | 'kakao' | 'github';
  createdAt?: string;
  updatedAt?: string;
}

// 로그인 상태 타입
export interface LoginState {
  // 상태
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  // 액션
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useLoginStore = create<LoginState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      isLoggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      // 토큰 설정
      setTokens: (accessToken: string, refreshToken: string) => {
        set({
          accessToken,
          refreshToken,
          isLoggedIn: true,
        });
      },

      // 사용자 정보 설정
      setUser: (user: User) => {
        set({ user });
      },

      // 로그인 (토큰 + 사용자 정보)
      login: (user: User, accessToken: string, refreshToken: string) => {
        set({
          user,
          accessToken,
          refreshToken,
          isLoggedIn: true,
          error: null,
        });
      },

      // 로그아웃
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoggedIn: false,
          error: null,
        });
      },

      // 로딩 상태 설정
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // 에러 설정
      setError: (error: string | null) => {
        set({ error });
      },

      // 에러 클리어
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'login-storage', // localStorage 키
      partialize: (state) => ({
        // localStorage에 저장할 필드들만 선택
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
