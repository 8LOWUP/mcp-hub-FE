"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import { useProfileStore } from "@/store/profiles/profile-store";
import { useLoginStore } from "@/store/login/login-store";
import { UpdateProfilePayloadType } from "@/types/profiles";

export const useMyProfile = () => {
    const { profile, isLoading, error, refetchMyProfile, updateProfileOptimistic } = useProfileStore();
    const { user: loginUser } = useLoginStore();
    const didInitRef = useRef(false);

    useEffect(() => {
        if (didInitRef.current) return;
        didInitRef.current = true;
        void refetchMyProfile();
    }, [refetchMyProfile]);

    const updateProfile = useCallback(
        async (payload: UpdateProfilePayloadType) => {
            await updateProfileOptimistic(payload);
            // 서버가 avatarUrl을 내려주지 않아도 아래 normalized가 계속 폴백 유지
        },
        [updateProfileOptimistic]
    );

    // ✅ 서버가 avatarUrl/picture를 안 내려줘도 로그인 스토어의 avatarUrl로 보정
    const normalized = useMemo(() => {
        if (!profile && loginUser) {
            return {
                id: loginUser.id,
                email: loginUser.email,
                nickname: loginUser.nickname,
                avatarUrl: loginUser.avatarUrl,
            };
        }
        if (!profile) return profile;

        const avatarUrl =
            (profile as any).avatarUrl ??
            (profile as any).picture ??
            loginUser?.avatarUrl ??
            undefined;

        return { ...profile, avatarUrl };
    }, [profile, loginUser]);

    return { profile: normalized, isLoading, error, refetch: refetchMyProfile, updateProfile };
};
