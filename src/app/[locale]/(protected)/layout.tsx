"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLoginStore } from "@/store/login/login-store";
import { useLoginModalStore } from "@/store/login/login-modal-store";

export default function ProtectedGroupLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const accessToken = useLoginStore((s) => s.accessToken);
    const isLoggedIn = !!accessToken;

    useEffect(() => {
        if (isLoggedIn) return;

        const parts = (pathname || "/").split("/").filter(Boolean);
        const locale = ["ko", "en"].includes(parts[0]) ? parts[0] : "ko";
        toast.warning("로그인이 필요한 기능입니다.");

        const open = useLoginModalStore.getState().open;
        if (open) {
            open();
            return;
        }

        const search = typeof window !== "undefined" ? window.location.search : "";
        router.replace(`/${locale}/login?next=${encodeURIComponent((pathname || "/") + search)}&authRequired=1`);
    }, [isLoggedIn, pathname, router]);

    if (!isLoggedIn) return null;
    return <>{children}</>;
}
