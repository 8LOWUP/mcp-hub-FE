// src/components/ui/modal/primary/PrimaryModal.tsx
"use client";

import React from "react";
import BaseModal from "../../modal/BaseModal";
import { PRIMARY_VARIANTS, type PrimaryVariantKey } from "./registry";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    variant: PrimaryVariantKey;                 // 어떤 화면을 띄울지
    initialVariant?: PrimaryVariantKey;         // (선택) 내부 전환 시작점 별도 지정
};

const PrimaryModal: React.FC<Props> = ({ isOpen, onClose, variant, initialVariant }) => {
    // 외부 variant가 바뀌면 동기화, 내부 전환(go)도 허용
    const [current, setCurrent] = React.useState<PrimaryVariantKey>(initialVariant ?? variant);
    React.useEffect(() => setCurrent(variant), [variant]);

    const Current = PRIMARY_VARIANTS[current];

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={() => { setCurrent(initialVariant ?? variant); onClose(); }} // 닫을 때 초기화
            className="w-[696px] h-[336px] bg-surface-1 text-white px-10 py-8 flex flex-col justify-between"
        >
            <Current onClose={onClose} go={setCurrent} />
        </BaseModal>
    );
};

export default PrimaryModal;
