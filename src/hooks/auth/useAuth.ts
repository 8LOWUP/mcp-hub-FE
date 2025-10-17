"use client";

/* FE 스토어/세션을 추상화하여 isLoggedIn을 일관되게 제공 */
import { useMemo } from "react";
import { useLoginStore } from "@/store/login/login-store";

export type AuthStateType = {
    isLoggedIn: boolean;
    accessToken?: string | null;
};

export const useAuth = (): AuthStateType => {
    const accessToken = useLoginStore((s) => s.accessToken);
    const isLoggedIn = useMemo(() => !!accessToken, [accessToken]);
    return { isLoggedIn, accessToken };
};
