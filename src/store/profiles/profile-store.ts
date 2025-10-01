// src/store/profile/profile-store.ts
import { create } from "zustand";
import { ProfileType, UpdateProfilePayloadType } from "@/types/profiles";
import { getMyProfile, patchMyProfile } from "@/services/profiles/api";

type State = {
    profile?: ProfileType;
    isLoading: boolean;
    error?: string;
};

type Actions = {
    setProfile: (p?: ProfileType) => void;
    refetchMyProfile: () => Promise<void>;
    updateProfileOptimistic: (payload: UpdateProfilePayloadType) => Promise<void>;
};

export const useProfileStore = create<State & Actions>((set, get) => ({
    profile: undefined,
    isLoading: false,
    error: undefined,

    setProfile: (p) => set({ profile: p }),

    refetchMyProfile: async () => {
        if (get().isLoading) return;
        set({ isLoading: true, error: undefined });
        try {
            const me = await getMyProfile();
            set({ profile: me, isLoading: false });
        } catch (e: any) {
            const message =
                e?.message || e?.response?.data?.message || "Failed to fetch profile";
            set({ error: message, isLoading: false });
        }
    },

    // ✅ 낙관적 업데이트
    updateProfileOptimistic: async (payload) => {
        const prev = get().profile;
        // 1) 즉시 UI에 반영
        set({ profile: { ...(prev ?? {}), ...payload } as ProfileType });

        try {
            // 2) 서버 요청 (429 등 실패해도 UI는 유지)
            const updated = await patchMyProfile(payload, prev);
            // 3) 서버 응답 오면 다시 덮어쓰기
            set({
                profile: { ...(get().profile ?? {}), ...(updated ?? {}) } as ProfileType,
            });
        } catch (e) {
            console.warn("서버 동기화 실패:", e);
            // 👉 정책 선택: 실패 시 롤백할지 유지할지
            // 지금은 UX 우선 → 그대로 유지
        }
    },
}));
