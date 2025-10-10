import { create } from "zustand";
import type { McpMetaType } from "@/types/mcps";

type DraftState = Omit<McpMetaType, "file"> & {
    file?: File;
    isDirty: boolean;
};

type DraftActions = {
    setField: <K extends keyof DraftState>(k: K, v: DraftState[K]) => void;
    setFromServer: (meta: Partial<DraftState>) => void;
    markSaved: () => void;
    reset: () => void;
};

export const useMcpDraftStore = create<DraftState & DraftActions>((set) => ({
    mcpId: undefined as unknown as number,
    name: "",
    description: "",
    categoryId: undefined as unknown as number,
    sourceUrl: "",
    imageUrl: "",
    requestUrl: "",
    platformName: "",
    developerName: "",
    isKeyRequired: false,
    licenseId: undefined,
    tools: [],
    file: undefined,
    isDirty: false,

    setField: (k, v) => set((s) => ({ ...s, [k]: v, isDirty: true })),
    setFromServer: (meta) => set((s) => ({ ...s, ...meta, isDirty: false })),
    markSaved: () => set((s) => ({ ...s, isDirty: false })),
    reset: () =>
        set(() => ({
            mcpId: undefined as unknown as number,
            name: "",
            description: "",
            categoryId: undefined as unknown as number,
            sourceUrl: "",
            imageUrl: "",
            requestUrl: "",
            platformName: "",
            developerName: "",
            isKeyRequired: false,
            licenseId: undefined,
            tools: [],
            file: undefined,
            isDirty: false,
        })),
}));
