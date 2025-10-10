// src/store/login/login-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LOCAL_STORAGE_KEY } from "@/constants/apis/key";

export interface User {
    id: string; email: string; nickname: string;
    profileImage?: string; provider?: "google" | "kakao" | "github";
    createdAt?: string; updatedAt?: string;
}

export interface LoginState {
    isLoggedIn: boolean;
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;

    hasJustDeleted?: boolean; // 세션 가드(퍼시스트 X)

    setTokens: (accessToken: string, refreshToken: string) => void;
    setUser: (user: User) => void;
    login: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    hardLogout: () => void; // ✅

    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useLoginStore = create<LoginState>()(
    persist(
        (set, get) => ({
            isLoggedIn: false,
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,
            hasJustDeleted: false,

            setTokens: (accessToken, refreshToken) =>
                set({ accessToken, refreshToken, isLoggedIn: true }),

            setUser: (user) => set({ user }),

            login: (user, accessToken, refreshToken) =>
                set({ user, accessToken, refreshToken, isLoggedIn: true, error: null }),

            logout: () =>
                set({ isLoggedIn: false, accessToken: null, refreshToken: null, user: null }),

            // ✅ 하드 로그아웃: 메모리 + 퍼시스트 + 로컬키 + 1회 가드
            hardLogout: () => {
                set({ hasJustDeleted: true });
                set({ isLoggedIn: false, accessToken: null, refreshToken: null, user: null });

                try { (useLoginStore as any)?.persist?.clearStorage?.(); } catch {}

                if (typeof window !== "undefined") {
                    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                    localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                    localStorage.removeItem(LOCAL_STORAGE_KEY.user);

                    localStorage.removeItem("login-storage"); // ✅ 추가: persist 저장키 직접 삭제

                    sessionStorage.setItem("BLOCK_AUTH_ONCE", "1"); // 1회 차단 플래그
                }
            },

            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),
        }),
        {
            name: "login-storage",
            partialize: (s) => ({
                isLoggedIn: s.isLoggedIn,
                user: s.user,
                accessToken: s.accessToken,
                refreshToken: s.refreshToken,
            }),
        }
    )
);
