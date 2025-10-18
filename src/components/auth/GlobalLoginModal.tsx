"use client";

import { useLoginModalStore } from "@/store/login/login-modal-store";
import LoginModal from "@/features/auth/components/LoginModal";

/**
 * 전역적으로 LoginModal을 렌더링하는 컴포넌트
 * Zustand store의 상태를 구독하여 모달 표시/숨김 처리
 */
export default function GlobalLoginModal() {
    const isOpen = useLoginModalStore((state) => state.isOpen);
    const close = useLoginModalStore((state) => state.close);

    return <LoginModal isOpen={isOpen} onClose={close} />;
}
