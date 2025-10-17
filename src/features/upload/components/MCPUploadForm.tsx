"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname.split("/")[1] || "ko";

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
    const [draft, setDraft] = useState<any>(null); // ✅ 복원용 상태

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

    const STORAGE_KEY = `mcp_upload_draft_${locale}`;

    const buildMetaData = (): McpMeta => {
        const normalize = (v?: string) => (v || "").replace(/\s+/g, "").toLowerCase();

        const categoryText = normalize(refs.category.current?.value);
        const licenseText = refs.license.current?.value?.trim() || "MIT License";

        const categoryId = CATEGORY_MAP[categoryText] ?? detail?.categoryId ?? 0;
        const licenseId = LICENSE_MAP[licenseText] ?? detail?.licenseId ?? 1;

        return {
            ...(localMcpId ? { mcpId: localMcpId } : {}),
            name: refs.name.current?.value || detail?.name || "",
            description: refs.description.current?.value || detail?.description || "",
            categoryId,
            licenseId,
            sourceUrl: refs.sourceCode.current?.value || detail?.sourceUrl || "",
            imageUrl: detail?.imageUrl || "",
            platformName: refs.platform.current?.value || detail?.platformName || "",
            requestUrl: refs.serverURL.current?.value || detail?.requestUrl || "",
            developerName: refs.developer.current?.value || detail?.developerName || "",
            isKeyRequired: false,
            tools,
        };
    };

    // 새 업로드 시작 시 draft 초기화 (Upload 페이지 진입 시 깨끗하게 시작)
    useEffect(() => {
        if (!isEditMode) {
            // 저장 완료 후 다시 돌아왔을 때만 초기화
            const fromDeployed = sessionStorage.getItem("fromDeployed");
            if (fromDeployed === "true") {
                localStorage.removeItem(STORAGE_KEY);
                sessionStorage.removeItem("fromDeployed");
            }
        }
    }, [isEditMode, locale]);

    // Draft 복원
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setDraft(parsed);
                if (parsed) {
                    if (refs.name.current) refs.name.current.value = parsed.name || "";
                    if (refs.description.current)
                        refs.description.current.value = parsed.description || "";
                    if (refs.category.current)
                        refs.category.current.value = parsed.categoryName || "";
                    if (refs.serverURL.current)
                        refs.serverURL.current.value = parsed.requestUrl || "";
                    if (refs.platform.current)
                        refs.platform.current.value = parsed.platformName || "";
                    if (refs.developer.current)
                        refs.developer.current.value = parsed.developerName || "";
                    if (refs.sourceCode.current)
                        refs.sourceCode.current.value = parsed.sourceUrl || "";
                    if (refs.license.current)
                        refs.license.current.value = parsed.licenseName || "MIT License";
                    setTools(parsed.tools || []);
                    console.log("✅ Draft 복원됨", parsed);
                }
            } catch (err) {
                console.error("🚨 Draft 복원 실패:", err);
            }
        }
    }, [locale]);

    // 자동 저장 (입력 중 2초마다 저장)
    useEffect(() => {
        const autoSave = () => {
            const meta = buildMetaData();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
        };
        const interval = setInterval(autoSave, 2000);
        return () => clearInterval(interval);
    }, [tools]);

    const handleAction = async (mode: "save" | "deploy") => {
        try {
            setError(null);
            setMessage(mode === "save" ? "Saving..." : "Deploying...");

            const meta = buildMetaData();

            if (mode === "save" && !meta.name?.trim()) {
                setError("❌ MCP 이름을 입력해주세요.");
                setMessage(null);
                return;
            }

            if (mode === "deploy") {
                const errors = validateBeforePublish(meta);
                if (errors.length) {
                    setError(errors.join(" / "));
                    setMessage(null);
                    return;
                }
                if (!file && !detail?.imageUrl) {
                    setError("❌ 파일을 업로드해주세요.");
                    setMessage(null);
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
            await targetMutation.mutateAsync({
                file: fileToSend,
                meta: { ...meta, mcpId: currentId ?? meta.mcpId },
            } as McpMetaRequestFormData);

            const successMessage =
                mode === "deploy"
                    ? "MCP deployed successfully."
                    : "MCP saved successfully.";

            setMessage(successMessage);

            // ✅ 저장/배포 성공 시 draft 제거 + 이후 페이지 진입 시 초기화 플래그 저장
            localStorage.removeItem(STORAGE_KEY);
            sessionStorage.setItem("fromDeployed", "true");

            window.alert(`${successMessage}\n\n마이페이지로 이동합니다.`);
            router.push(`/${locale}/profiles/deployed`);
        } catch (err: any) {
            setError(err.message || "오류 발생");
            setMessage(null);
        }
    };

    const isLoading = saveMeta.isPending || publishMeta.isPending;

    const isDeployDisabled = (() => {
        const meta = buildMetaData();
        const missing = validateBeforePublish(meta);
        const hasExistingImage = !!(detail?.imageUrl && detail.imageUrl.trim() !== "");
        const isFileMissing = !file && !hasExistingImage;
        return missing.length > 0 || isFileMissing || isLoading;
    })();

    return (
        <div className="flex pt-20 justify-center items-center min-h-screen bg-surface-1 px-4">
            <div className="w-full max-w-3xl p-6 bg-surface-1 --text-color-1 rounded shadow-lg">
                <h1 className="text-2xl font-bold mb-2">
                    {isEditMode ? "Edit MCP" : "Upload MCP"}
                </h1>
                <p className="pb-10 text-muted">
                    {isEditMode
                        ? "Update your existing MCP information."
                        : "Provide the necessary information to share your MCP."}
                </p>

                <form className="space-y-4">
                    <MCPNameInput ref={refs.name} defaultValue={draft?.name ?? detail?.name ?? ""} />
                    <DescriptionInput ref={refs.description} defaultValue={draft?.description ?? detail?.description ?? ""} />
                    <TagsInput ref={refs.category} defaultValue={(draft?.categoryName ?? detail?.categoryName ?? "").toLowerCase()} />
                    <ServerURLInput ref={refs.serverURL} defaultValue={draft?.requestUrl ?? detail?.requestUrl ?? ""} />
                    <ToolsDescriptionInput initialTools={memoInitialTools} onChange={setTools} />
                    <ConnectionPlatformInput ref={refs.platform} defaultValue={draft?.platformName ?? detail?.platformName ?? ""} />
                    <DeveloperNameInput ref={refs.developer} defaultValue={draft?.developerName ?? detail?.developerName ?? ""} />
                    <SourceCodeURLInput ref={refs.sourceCode} defaultValue={draft?.sourceUrl ?? detail?.sourceUrl ?? ""} />
                    <LicenseInput ref={refs.license} defaultValue={draft?.licenseName ?? detail?.licenseName ?? "MIT License"} />
                    <UploadIcon onFileSelect={setFile} defaultImageUrl={detail?.imageUrl} />

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
                            disabled={isDeployDisabled}
                            onClick={() => handleAction("deploy")}
                            className={`px-4 py-2 rounded bg-accent text-black hover:bg-accent-hover ${
                                isDeployDisabled ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {isEditMode ? "Update & Deploy" : "Deploy"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
