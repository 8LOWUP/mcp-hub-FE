"use client";

import React from "react";
import BaseModal from "@/components/ui/modal/BaseModal";
import PrimaryButton from "@/components/ui/PrimaryButton";

type DeleteMcpModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const DeleteMcpModal: React.FC<DeleteMcpModalProps> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="flex flex-col gap-6">
                {/* Title */}
                <h2 className="text-title1 font-bold">Delete MCP</h2>

                {/* Question box */}
                <div className="rounded-[20px] bg-surface-2 px-6 py-4 text-center">
                    <p className="text-title2 font-semibold ">
                        MCP를 삭제하시겠습니까?
                    </p>
                </div>

                {/* Sub text */}
                <p className="text-body3 text-secondary text-center ">
                    해당 API KEY 값과 관련 정보 모두 삭제됩니다.
                </p>

                {/* Footer buttons */}
                <div className="flex justify-end gap-3">
                    <PrimaryButton onClick={onClose}>
                        Cancel
                    </PrimaryButton>
                    <PrimaryButton onClick={onConfirm}>
                        Confirm
                    </PrimaryButton>
                </div>
            </div>
        </BaseModal>
    );
};

export default DeleteMcpModal;
