// src/features/upload/components/MCPUploadForm.tsx 수정
"use client";

import { useRef, useState, useMemo } from "react";
import { CATEGORY_MAP, LICENSE_MAP } from "@/constants/upload/constants";
import { useSaveMcpMeta, usePublishMcp } from "@/hooks/upload/useMcpUpload";
import {
    McpMeta,
    McpMetaRequestFormData,
    McpTool,
} from "@/types/upload/upload-types";

import MCPNameInput from "./McpNameInput";
import DescriptionInput from "./DescriptionInput";
import TagsInput from "./TagsInput";
import ServerURLInput from "./ServerURLInput";
import ConnectionPlatformInput from "./ConnectionPlatformInput";
import ToolsDescriptionInput from "./ToolsDescriptionInput";
import DeveloperNameInput from "./DeveloperName.Input";
import SourceCodeURLInput from "./SourceCodeURLInput";
import LicenseInput from "./LicenseInput";
import UploadIcon from "./UploadIcon";

interface MCPUploadFormProps {
    detail?: any;
    isEditMode: boolean;
    localMcpId: number | null;
    setLocalMcpId: (id: number) => void;
}

const validateBeforePublish = (meta: McpMeta) => {
    const errors: string[] = [];
    if (!meta.name?.trim()) errors.push("이름(name)은 필수입니다.");
    if (!meta.categoryId) errors.push("카테고리를 선택해주세요.");
    if (!meta.licenseId) errors.push("라이선스를 선택해주세요.");
    if (!meta.requestUrl?.trim()) errors.push("서버 URL은 필수입니다.");
    return errors;
};

export default function MCPUploadForm({
                                          detail,
                                          isEditMode,
                                          localMcpId,
                                          setLocalMcpId,
                                      }: MCPUploadFormProps) {
    const refs = {
        name: useRef<HTMLInputElement>(null),
        description: useRef<HTMLTextAreaElement>(null),
        category: useRef<HTMLInputElement>(null),
        serverURL: useRef<HTMLInputElement>(null),
        platform: useRef<HTMLInputElement>(null),
        developer: useRef<HTMLInputElement>(null),
        sourceCode: useRef<HTMLInputElement>(null),
        license: useRef<HTMLInputElement>(null),
    };

    const [tools, setTools] = useState<McpTool[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const saveMeta = useSaveMcpMeta();
    const publishMeta = usePublishMcp();

    const memoInitialTools = useMemo(
        () =>
            (detail?.tools ?? []).map((t: any) => ({
                name: t?.name ?? "",
                content: t?.content ?? "",
            })),
        [detail?.id]
    );

    const buildMetaData = (): McpMeta => {
        const categoryText = refs.category.current?.value?.trim().toLowerCase() || "";
        const licenseText = refs.license.current?.value?.trim() || "";

        const categoryId = CATEGORY_MAP[categoryText] ?? 0;
        const licenseId = LICENSE_MAP[licenseText] ?? 0;

        return {
            ...(localMcpId ? { mcpId: localMcpId } : {}),
            name: refs.name.current?.value || "",
            description: refs.description.current?.value || "",
            categoryId,
            licenseId,
            sourceUrl: refs.sourceCode.current?.value || "",
            imageUrl: "",
            platformName: refs.platform.current?.value || "",
            requestUrl: refs.serverURL.current?.value || "",
            developerName: refs.developer.current?.value || "",
            isKeyRequired: false,
            tools,
        };
    };

    const handleAction = async (mode: "save" | "deploy") => {
        try {
            setError(null);
            setMessage(mode === "save" ? "Saving..." : "Deploying...");

            const meta = buildMetaData();

            if (mode === "deploy") {
                const errors = validateBeforePublish(meta);
                if (errors.length) {
                    setError(errors.join(" / "));
                    return;
                }
            }

            let currentId = localMcpId;
            const fileToSend = file || new File([], "empty.txt");

            if (!currentId) {
                const saved = await saveMeta.mutateAsync({ file: fileToSend, meta });
                if (saved.result) {
                    currentId = Number(saved.result);
                    setLocalMcpId(currentId);
                }
            }

            const targetMutation = mode === "deploy" ? publishMeta : saveMeta;
            const res = await targetMutation.mutateAsync({
                file: fileToSend,
                meta: { ...meta, mcpId: currentId ?? meta.mcpId },
            } as McpMetaRequestFormData);

            setMessage(
                mode === "deploy"
                    ? "🚀 MCP deployed successfully."
                    : "✅ MCP saved successfully."
            );
        } catch (err: any) {
            setError(err.message || "오류 발생");
        }
    };

    const isLoading = saveMeta.isPending || publishMeta.isPending;

    return (
        <div className="flex pt-20 justify-center items-center min-h-screen bg-surface-1 px-4">
            <div className="w-full max-w-3xl p-6 bg-surface-1 text-white rounded shadow-lg">
                <h1 className="text-2xl font-bold mb-2">
                    {isEditMode ? "Edit MCP" : "Upload MCP"}
                </h1>
                <p className="pb-10 text-muted">
                    {isEditMode
                        ? "Update your existing MCP information."
                        : "Provide the necessary information to share your MCP."}
                </p>

                <form className="space-y-4">
                    <MCPNameInput ref={refs.name} defaultValue={detail?.name ?? ""} />
                    <DescriptionInput ref={refs.description} defaultValue={detail?.description ?? ""} />
                    <TagsInput ref={refs.category} defaultValue={(detail?.categoryName ?? "").toLowerCase()} />
                    <ServerURLInput ref={refs.serverURL} defaultValue={detail?.requestUrl ?? ""} />
                    <ToolsDescriptionInput initialTools={memoInitialTools} onChange={setTools} />
                    <ConnectionPlatformInput ref={refs.platform} defaultValue={detail?.platformName ?? ""} />
                    <DeveloperNameInput ref={refs.developer} defaultValue={detail?.developerName ?? ""} />
                    <SourceCodeURLInput ref={refs.sourceCode} defaultValue={detail?.sourceUrl ?? ""} />
                    <LicenseInput ref={refs.license} defaultValue={detail?.licenseName ?? ""} />
                    <UploadIcon onFileSelect={setFile} />

                    {file && (
                        <p className="text-sm text-green-400 mt-1">
                            ✅ 선택된 파일: {file.name} ({Math.round(file.size / 1024)} KB)
                        </p>
                    )}

                    {error && <p className="text-red-500 font-semibold">{error}</p>}
                    {message && <p className="text-green-500 font-semibold">{message}</p>}

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleAction("save")}
                            className="px-4 py-2 rounded text-white bg-gray-600 hover:bg-gray-700"
                        >
                            {isEditMode ? "Update" : "Save"}
                        </button>

                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleAction("deploy")}
                            className="px-4 py-2 rounded bg-accent text-black hover:bg-accent-hover"
                        >
                            {isEditMode ? "Update & Deploy" : "Deploy"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
