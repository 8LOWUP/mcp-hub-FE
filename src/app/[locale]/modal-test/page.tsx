"use client";

import React from "react";
import BaseModal from "@/components/ui/modal/BaseModal";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function ModalTestPage() {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-title2">BaseModal 테스트</h1>

            <PrimaryButton onClick={() => setOpen(true)}>모달 열기</PrimaryButton>

            <BaseModal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="공통 BaseModal 헤더"
                // className로 크기/레이아웃 커스텀 가능
                className="w-[600px] max-w-[90%] rounded-[20px]"
            >
                <div className="space-y-3">
                    <p className="text-body3 text-secondary">
                        children으로 넘긴 본문이 이 영역에 렌더됩니다.
                    </p>

                    <div className="flex items-center gap-2">
                        <PrimaryButton variant="secondary" onClick={() => setOpen(false)}>
                            취소
                        </PrimaryButton>
                        <PrimaryButton onClick={() => alert('확인!')}>
                            확인
                        </PrimaryButton>
                    </div>
                </div>
            </BaseModal>
        </div>
    );
}
