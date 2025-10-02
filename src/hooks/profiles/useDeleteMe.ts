"use client";

import { useCallback, useState } from "react";
import { deleteMe } from "@/services/profiles/api";
import { useLoginStore } from "@/store/login/login-store";

export const useDeleteMe = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setErr] = useState<string>();
    const [message, setMsg] = useState<string>();

    const mutate = useCallback(async () => {
        setLoading(true);
        setErr(undefined);
        try {
            const { refreshToken, hardLogout } = useLoginStore.getState();
            if (!refreshToken) throw new Error("refreshToken is missing.");

            // 1) 서버 탈퇴
            const res = await deleteMe(refreshToken);
            setMsg(typeof res === "string" ? res : res?.message ?? "탈퇴가 완료되었습니다.");

            // 2) 프론트 상태 완전 초기화
            hardLogout?.();

            // 3) 이동 + 완전 리로드(메모리 초기화)
            if (typeof window !== "undefined") {
                window.location.replace("/login");
                window.location.reload();
            }
        } catch (e) {
            setErr(e instanceof Error ? e.message : "탈퇴에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }, []);

    return { mutate, isLoading, error, message };
};
