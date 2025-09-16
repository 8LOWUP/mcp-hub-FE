// src/components/ui/modal/primary/registry.ts
import type { ComponentType } from "react";
import ApiKeyView from "./variants/ApiKeyView";
import ApiKeyConfirm from "./variants/ApiKeyConfirm";

// 추후 여기만 추가/수정하면 됨
export const PRIMARY_VARIANTS = {
    apiKeyView: ApiKeyView,
    apiKeyConfirm: ApiKeyConfirm,
} as const;

export type PrimaryVariantKey = keyof typeof PRIMARY_VARIANTS;

// 공통 props (호스트에서 내려주는 최소 인터페이스)
export type PrimaryVariantProps = {
    onClose: () => void;
    go: (to: PrimaryVariantKey) => void;
    // 필요시 데이터 추가: e.g. apiKey?: string;
};
export type VariantComponent = ComponentType<PrimaryVariantProps>;
