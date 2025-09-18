"use client";

import React from "react";
import BaseModal from "@/components/ui/modal/BaseModal";
import PrimaryButton from "@/components/ui/PrimaryButton";

type DeleteMcpSuccessModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const DeleteMcpSuccessModal: React.FC<DeleteMcpSuccessModalProps> = ({ isOpen, onClose }) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="flex flex-col gap-6 items-center text-center">
                <h2 className="text-title1 font-bold self-start">Delete MCP</h2>

                <div className="rounded-[20px] bg-surface-2 px-6 py-4 w-full">
                    <p className="text-title2 font-semibold">삭제 되었습니다</p>
                </div>

                <div className="flex justify-end w-full">
                    <PrimaryButton onClick={onClose}>Confirm</PrimaryButton>
                </div>
            </div>
        </BaseModal>
    );
};

export default DeleteMcpSuccessModal;
