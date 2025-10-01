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
            const { refreshToken, logout } = useLoginStore.getState();
            if (!refreshToken) throw new Error("refreshToken is missing.");
            const res = await deleteMe(refreshToken);
            setMsg(typeof res === "string" ? res : res?.message ?? "탈퇴가 완료되었습니다.");
            logout?.();
            if (typeof window !== "undefined") window.location.href = "/login";
        } catch (e) {
            setErr(e instanceof Error ? e.message : "탈퇴에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }, []);

    return { mutate, isLoading, error, message };
};
