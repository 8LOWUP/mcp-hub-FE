// src/hooks/profiles/useMyProfile.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMyProfile, patchMyProfile } from "@/services/profiles/api";
import { ProfileType, UpdateProfilePayloadType } from "@/types/profiles"; // ⬅ 타입만 따로 가져옴

type StateType = {
    profile?: ProfileType;
    isLoading: boolean;
    error?: string;
};

type UpdateResultType = { ok: true } | { ok: false; message: string };

/* ================================
 * 훅
 * ================================ */
export const useMyProfile = () => {
    const [state, setState] = useState<StateType>({ isLoading: true });
    const didInitRef = useRef(false); // StrictMode 2회 방지
    const isUpdatingRef = useRef(false); // PATCH 중복 제출 방지
    const refetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const refetch = useCallback(async () => {
        try {
            const profile = await getMyProfile();
            setState({ profile, isLoading: false });
        } catch (err: unknown) {
            const status =
                typeof err === "object" && err && "response" in err
                    ? (err as { response?: { status?: number } }).response?.status
                    : undefined;

            if (status === 429 || status === 503 || status === 504) {
                // 조용히 재시도(타이머 누적 방지)
                if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
                refetchTimerRef.current = setTimeout(() => { void refetch(); }, 3000);
                return;
            }

            const message =
                err instanceof Error
                    ? err.message
                    : typeof err === "object" && err !== null && "message" in err
                        ? String((err as { message?: unknown }).message ?? "Failed to fetch profile")
                        : "Failed to fetch profile";

            setState({ profile: undefined, isLoading: false, error: message });
        }
    }, []);

    useEffect(() => {
        if (didInitRef.current) return;
        didInitRef.current = true;
        refetch();
        return () => {
            if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
        };
    }, [refetch]);

    const updateProfile = useCallback(
        async (payload: UpdateProfilePayloadType): Promise<UpdateResultType> => {
            // 중복 제출 가드
            if (isUpdatingRef.current) {
                return { ok: false, message: "이미 저장 중입니다. 잠시만 기다려주세요." };
            }
            isUpdatingRef.current = true;

            // 대기중 refetch 제거
            if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);

            try {
                // 1) PATCH (현재 프로필 전달하여 id 재활용; /me 추가 호출 방지)
                const updated = await patchMyProfile(payload, state.profile);

                // 2) 낙관적 갱신
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    profile: {
                        ...(prev.profile ?? {}),
                        ...(updated ?? {}),
                    },
                }));

                // 3) 서버 소스 동기화 (쓰기→읽기 쿨다운과 맞춰 1.8s 후 단일 refetch)
                refetchTimerRef.current = setTimeout(() => {
                    refetch();
                }, 1800);

                return { ok: true };
            } catch (err: unknown) {
                const message =
                    err instanceof Error
                        ? err.message
                        : typeof err === "object" && err !== null && "message" in err
                            ? String((err as { message?: unknown }).message ?? "프로필 수정 중 오류")
                            : "프로필 수정 중 오류";
                return { ok: false, message };
            } finally {
                isUpdatingRef.current = false;
            }
        },
        [refetch, state.profile]
    );

    return { ...state, refetch, updateProfile };
};
