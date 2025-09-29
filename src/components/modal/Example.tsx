"use client";

import React from "react";
import BaseModal from "@/components/ui/modal/BaseModal";
import PrimaryButton from "@/components/ui/PrimaryButton";


const Example: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleDelete = () => alert("삭제");
    const handleSave = () => alert("수정");

    return (
        <div className="p-6">
            <PrimaryButton onClick={handleOpen}>
                Open modal
            </PrimaryButton>

            <BaseModal
                isOpen={isOpen}
                onClose={handleClose}
                title="API Key Management"
                size="lg"
                footer={
                    <>
                        {/* 텍스트 버튼 느낌: 보조 톤 */}
                        <PrimaryButton onClick={handleDelete}>
                            삭제
                        </PrimaryButton>

                        {/* 강조 버튼: 포인트 색상 */}
                        <PrimaryButton onClick={handleSave} className="bg-accent text-black hover:bg-accent-hover">
                            수정
                        </PrimaryButton>
                    </>
                }
            >
                {/* 본문은 샘플: 공용 톤 적용 */}
                <div className="text-secondary">
                    이 영역에 내용을 넣으세요. (공용 스타일 적용 상태 확인용)
                </div>
            </BaseModal>
        </div>
    );
};

export default Example;
