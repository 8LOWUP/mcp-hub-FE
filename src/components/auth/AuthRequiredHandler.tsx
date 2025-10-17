"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLoginModalStore } from "@/store/login/login-modal-store";

/**
 * URL 파라미터에서 authRequired=1을 확인하고 로그인 모달을 표시하는 컴포넌트
 */
export default function AuthRequiredHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const authRequired = searchParams.get("authRequired");
    const redirectTo = searchParams.get("redirectTo");

    useEffect(() => {
        console.log("🔍 AuthRequiredHandler - URL 파라미터 확인:", {
            authRequired,
            redirectTo,
            searchParams: searchParams.toString(),
            timestamp: new Date().toISOString()
        });

        if (authRequired === "1") {
            console.log("🔐 인증이 필요한 페이지 접근 시도:", {
                redirectTo,
                timestamp: new Date().toISOString()
            });

            // 토스트 알림 표시
            console.log("📢 토스트 알림 표시 시도");
            toast.warning("🔐 로그인이 필요합니다", {
                description: "로그인 후 이용해주세요.",
                // duration은 ToasterClient에서 전역 설정됨
                className: "custom-warning-toast",
            });

            // 로그인 모달 열기
            console.log("🔓 로그인 모달 열기 시도");
            const modalStore = useLoginModalStore.getState();
            console.log("🔍 모달 스토어 상태 (열기 전):", {
                isOpen: modalStore.isOpen,
                hasOpen: typeof modalStore.open === 'function'
            });
            modalStore.open();
            
            // 열기 후 상태 확인
            setTimeout(() => {
                const afterOpen = useLoginModalStore.getState();
                console.log("🔍 모달 스토어 상태 (열기 후):", {
                    isOpen: afterOpen.isOpen
                });
            }, 100);

            // URL에서 파라미터 제거 (깔끔한 URL 유지)
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("authRequired");
            newUrl.searchParams.delete("redirectTo");
            
            // redirectTo 정보를 sessionStorage에 저장 (로그인 성공 후 사용)
            if (redirectTo) {
                sessionStorage.setItem("redirectAfterLogin", redirectTo);
                console.log("💾 리다이렉트 정보 저장:", redirectTo);
            }

            // URL 업데이트 (히스토리 교체)
            window.history.replaceState({}, "", newUrl.toString());
            console.log("🔄 URL 정리 완료");
        }
    }, [authRequired, redirectTo, searchParams]);

    return null; // UI를 렌더링하지 않음
}
