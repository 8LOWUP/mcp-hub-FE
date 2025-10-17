//src/app/[locale]/detail/page.tsx
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { CATEGORY_MAP, LICENSE_MAP } from "@/constants/upload/constants";
import MCPNameInput from "@/features/upload/components/McpNameInput";
import DescriptionInput from "@/features/upload/components/DescriptionInput";
import TagsInput from "@/features/upload/components/TagsInput";
import ServerURLInput from "@/features/upload/components/ServerURLInput";
import ConnectionPlatformInput from "@/features/upload/components/ConnectionPlatformInput";
import ToolsDescriptionInput from "@/features/upload/components/ToolsDescriptionInput";
import DeveloperNameInput from "@/features/upload/components/DeveloperName.Input";
import SourceCodeURLInput from "@/features/upload/components/SourceCodeURLInput";
import LicenseInput from "@/features/upload/components/LicenseInput";
import UploadIcon from "@/features/upload/components/UploadIcon";

import { useSaveMcpMeta, usePublishMcp } from "@/hooks/upload/useMcpUpload";
import { axiosInstance } from "@/services/AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";

/* ----------------------------- 타입 ----------------------------- */
interface McpTool {
    name: string;
    content: string;
}

type MyMcpDetail = {
    id: number;
    name: string;
    version?: string;
    description?: string;
    imageUrl?: string | null;
    requestUrl?: string | null;
    sourceUrl?: string | null;
    developerName?: string | null;
    isKeyRequired: boolean;
    categoryId: number;
    categoryName?: string;
    platformId?: number;
    platformName?: string;
    licenseId: number;
    licenseName?: string;
    published?: boolean;
    tools?: { id?: number; name: string; content: string }[];
};

type MyMcpDetailResponse = {
    timestamp: string;
    code: string;
    message: string;
    result: MyMcpDetail;
};

const isOk = (c?: string) => c === "SUCCESS" || c === "COMMON200" || c === "200";

/* ----------------------------- 상세 조회 ----------------------------- */
const fetchMyUploadDetail = async (mcpId: number) => {
    const url = API_ENDPOINTS.MCP.DASHBOARD_DETAIL.replace("{mcpId}", String(mcpId));
    const { data } = await axiosInstance.get<MyMcpDetailResponse>(url);
    if (!isOk(data.code)) throw new Error(data.message || "상세 조회 실패");
    return data.result;
};

/* ----------------------------- 배포 전 필수값 검증 ----------------------------- */
const validateBeforePublish = (meta: any) => {
    const errors: string[] = [];
    if (!meta.name?.trim()) errors.push("이름(name)은 필수입니다.");
    if (!meta.categoryId) errors.push("카테고리(categoryId)를 선택해주세요.");
    if (!meta.licenseId) errors.push("라이선스(licenseId)를 선택해주세요.");
    if (!meta.requestUrl?.trim()) errors.push("서버 URL(requestUrl)은 필수입니다.");
    return errors;
};

export default function MCPUploadPage() {
    // Locale translations
    const t = useTranslations('UploadPage');
    
    /* ----------------------------- Refs ----------------------------- */
    const refs = {
        mcpNameRef: useRef<HTMLInputElement>(null),
        descriptionRef: useRef<HTMLTextAreaElement>(null),
        categoryRef: useRef<HTMLInputElement>(null),
        serverURLRef: useRef<HTMLInputElement>(null),
        connectionPlatformRef: useRef<HTMLInputElement>(null),
        developerNameRef: useRef<HTMLInputElement>(null),
        sourceCodeURLRef: useRef<HTMLInputElement>(null),
        licenseRef: useRef<HTMLInputElement>(null),
    };

    /* ----------------------------- 상태 ----------------------------- */
    const [tools, setTools] = useState<McpTool[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [localMcpId, setLocalMcpId] = useState<number | null>(null);

    /* ----------------------------- 모드 ----------------------------- */
    const searchParams = useSearchParams();
    const mcpIdParam = searchParams.get("mcpId");
    const isEditMode = Boolean(mcpIdParam);
    const mcpId = useMemo(() => Number(mcpIdParam), [mcpIdParam]);

    /* ----------------------------- 편집 상세 ----------------------------- */
    const {
        data: detail,
        isLoading: isDetailLoading,
        error: detailError,
    } = useQuery({
        enabled: isEditMode && Number.isFinite(mcpId) && mcpId > 0,
        queryKey: ["myUploadDetail", mcpId],
        queryFn: () => fetchMyUploadDetail(mcpId),
    });

    // 상세 로드 후 로컬 mcpId 동기화
    useEffect(() => {
        if (isEditMode) {
            if (detail?.id && Number.isFinite(detail.id)) {
                setLocalMcpId(detail.id);
            } else if (Number.isFinite(mcpId) && mcpId > 0) {
                setLocalMcpId(mcpId);
            }
        }
    }, [isEditMode, detail?.id, mcpId]);

    /* ----------------------------- Tools 초기값 ----------------------------- */
    const memoInitialTools = useMemo(
        () =>
            (detail?.tools ?? []).map((t) => ({
                name: t?.name ?? "",
                content: t?.content ?? "",
            })),
        [detail?.id]
    );

    /* ----------------------------- API 훅 ----------------------------- */
    const saveMcpMetaMutation = useSaveMcpMeta();
    const publishMcpMutation = usePublishMcp();

    /* ----------------------------- 파일 선택 ----------------------------- */
    const handleFileSelect = (selectedFile: File | null) => {
        if (!selectedFile) return;
        setFile(selectedFile);
    };

    /* ----------------------------- 메타데이터 생성 ----------------------------- */
    const buildMetaData = () => {
        const categoryText = refs.categoryRef.current?.value?.trim().toLowerCase() || "";
        const licenseText = refs.licenseRef.current?.value?.trim() || "";

        const categoryId = CATEGORY_MAP[categoryText] ?? 0;
        const licenseId = LICENSE_MAP[licenseText] ?? 0;

        return {
            ...(localMcpId ? { mcpId: localMcpId } : {}),
            name: refs.mcpNameRef.current?.value || "",
            description: refs.descriptionRef.current?.value || "",
            categoryId,
            licenseId,
            sourceUrl: refs.sourceCodeURLRef.current?.value || "",
            imageUrl: "",
            platformName: refs.connectionPlatformRef.current?.value || "",
            requestUrl: refs.serverURLRef.current?.value || "",
            developerName: refs.developerNameRef.current?.value || "",
            isKeyRequired: false,
            tools,
        };
    };

    /* ----------------------------- 저장 ----------------------------- */
    const handleSave = async () => {
        try {
            setError(null);
            setMessage(isEditMode ? t('updatingMetadata') : t('savingMetadata'));

            const meta = buildMetaData();
            const fileToSend = file || new File([], "empty.txt");

            const res = await saveMcpMetaMutation.mutateAsync({ file: fileToSend, meta });
            if (!isOk(res.code)) throw new Error(res.message || t('metadataSaveFailed'));

            if (res.result && !localMcpId) {
                setLocalMcpId(Number(res.result));
            }

            setMessage(isEditMode ? t('metadataUpdatedSuccess') : t('metadataSavedSuccess'));
        } catch (err: any) {
            setError(`${t('metadataSaveError')} ${err?.message ?? ""}`);
            setMessage(null);
        }
    };

    /* ----------------------------- 배포 ----------------------------- */
    const handleDeploy = async () => {
        try {
            setError(null);
            setMessage(isEditMode ? t('updatingAndDeploying') : t('deploying'));

            // 필수값 검증
            const meta = buildMetaData();
            const errors = validateBeforePublish(meta);
            if (errors.length) {
                setError(`${t('deployValidationError')} ${errors.join(" / ")}`);
                setMessage(null);
                return;
            }

            // id 확보(신규면 저장 → result id)
            let id: number | null = localMcpId;
            if (id == null || Number.isNaN(Number(id))) {
                const fileToSend = file || new File([], "empty.txt");
                const saved = await saveMcpMetaMutation.mutateAsync({ file: fileToSend, meta });
                if (!isOk(saved?.code) || !saved?.result) {
                    throw new Error(saved?.message || t('tempSaveFailed'));
                }
                id = Number(saved.result);
                setLocalMcpId(id);
                meta.mcpId = id; // 배포 meta에 id 주입
            }

            // 배포: PATCH /mcps/dashboard/publish (multipart)
            const fileToSend = file || new File([], "empty.txt");
            const res = await publishMcpMutation.mutateAsync({ file: fileToSend, meta });
            if (!isOk(res?.code)) throw new Error(res?.message || t('deployFailed'));

            setMessage(isEditMode ? t('mcpUpdatedAndDeployed') : t('mcpDeployedSuccess'));
        } catch (err: any) {
            setError(`${t('deployError')} ${err?.message ?? ""}`);
            setMessage(null);
        }
    };

    /* ----------------------------- 로딩/에러 (편집) ----------------------------- */
    if (isEditMode && isDetailLoading) {
        return (
            <div className="flex pt-20 justify-center items-center min-h-screen bg-surface-1 px-4">
                <div className="w-full max-w-3xl p-6 bg-surface-1 text-white rounded shadow-lg">
                    <p className="text-sm opacity-70">{t('loadingExistingContent')}</p>
                </div>
            </div>
        );
    }
    if (isEditMode && detailError) {
        return (
            <div className="flex pt-20 justify-center items-center min-h-screen bg-surface-1 px-4">
                <div className="w-full max-w-3xl p-6 bg-surface-1 text-white rounded shadow-lg">
                    <p className="text-sm text-red-500">{t('contentFetchFailed')}</p>
                </div>
            </div>
        );
    }

    /* ----------------------------- UI ----------------------------- */
    const isLoading = saveMcpMetaMutation.isPending || publishMcpMutation.isPending;

    return (
        <div className="flex pt-20 justify-center items-center min-h-screen bg-surface-1 px-4">
            <div className="w-full max-w-3xl p-6 bg-surface-1 text-white rounded shadow-lg">
                <h1 className="text-2xl font-bold mb-2">
                    {isEditMode ? t('editMCP') : t('uploadMCP')}
                </h1>
                <p className="pb-10 text-muted">
                    {isEditMode
                        ? t('editMCPDescription')
                        : t('uploadMCPDescription')}
                </p>

                <form key={detail?.id ?? "new"} className="space-y-4">
                    <MCPNameInput
                        ref={refs.mcpNameRef}
                        defaultValue={detail?.name ?? ""}
                        onEnter={() => refs.descriptionRef.current?.focus()}
                    />

                    <DescriptionInput
                        ref={refs.descriptionRef}
                        defaultValue={detail?.description ?? ""}
                        onEnter={() => refs.serverURLRef.current?.focus()}
                    />

                    <TagsInput
                        ref={refs.categoryRef}
                        defaultValue={(detail?.categoryName ?? "").toLowerCase()}
                    />

                    <ServerURLInput
                        ref={refs.serverURLRef}
                        defaultValue={detail?.requestUrl ?? ""}
                        onEnter={() => refs.connectionPlatformRef.current?.focus()}
                    />

                    <ToolsDescriptionInput initialTools={memoInitialTools} onChange={setTools} />

                    <ConnectionPlatformInput
                        ref={refs.connectionPlatformRef}
                        defaultValue={detail?.platformName ?? ""}
                        onEnter={() => refs.developerNameRef.current?.focus()}
                    />

                    <DeveloperNameInput
                        ref={refs.developerNameRef}
                        defaultValue={detail?.developerName ?? ""}
                        onEnter={() => refs.sourceCodeURLRef.current?.focus()}
                    />

                    <SourceCodeURLInput
                        ref={refs.sourceCodeURLRef}
                        defaultValue={detail?.sourceUrl ?? ""}
                        onEnter={() => refs.licenseRef.current?.focus()}
                    />

                    <LicenseInput ref={refs.licenseRef} defaultValue={detail?.licenseName ?? ""} />

                    <UploadIcon onFileSelect={handleFileSelect} />
                    {file && (
                        <p className="text-sm text-green-400 mt-1">
                            ✅ {t('selectedFile')}: {file.name} ({Math.round(file.size / 1024)} KB)
                        </p>
                    )}

                    <div className="flex justify-end mb-2">
                        {error && <p className="text-red-500 font-semibold text-right">{error}</p>}
                        {message && <p className="text-green-500 font-semibold text-right">{message}</p>}
                    </div>

                    <div className="flex justify-end gap-2 mb-2">
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={handleSave}
                            className={`px-4 py-2 rounded text-white w-full sm:w-auto ${
                                isLoading ? "opacity-50 cursor-not-allowed" : "hover:underline hover:decoration-accent underline-offset-8"
                            }`}
                        >
                            {isEditMode ? t('update') : t('storage')}
                        </button>
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={handleDeploy}
                            className={`px-4 py-2 bg-accent rounded text-black w-full sm:w-auto ${
                                isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-accent-hover"
                            }`}
                        >
                            {isEditMode ? t('updateAndDeploy') : t('deploy')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
