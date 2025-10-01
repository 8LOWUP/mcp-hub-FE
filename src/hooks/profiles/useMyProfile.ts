// src/hooks/profiles/useMyProfile.ts
"use client";

import { useEffect, useRef } from "react";
import { useProfileStore } from "@/store/profiles/profile-store";
import { UpdateProfilePayloadType } from "@/types/profiles";

export const useMyProfile = () => {
    const { profile, isLoading, error, refetchMyProfile, updateProfileOptimistic } =
        useProfileStore();
    const didInitRef = useRef(false);

    useEffect(() => {
        if (didInitRef.current) return;
        didInitRef.current = true;
        void refetchMyProfile();
    }, [refetchMyProfile]);

    const updateProfile = async (payload: UpdateProfilePayloadType) => {
        await updateProfileOptimistic(payload);
    };

    return { profile, isLoading, error, refetch: refetchMyProfile, updateProfile };
};
