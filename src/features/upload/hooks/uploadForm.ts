"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ERROR_MESSAGES } from "./constants";
import { MCPFormData } from "./types";
import { axiosInstance } from "@/services/AxiosInstance";
import { getMcpMetaById, getPlatforms } from "@/services/mcps/api";

// 선택: 프로젝트 전역 McpMetaType 이 있다면 import 해서 쓰세요.
// 이 훅 내부에선 서버로 보낼 meta shape만 맞춰주면 됩니다.
type MetaPayload = {
    mcpId: number;
    name: string;
    description: string;
    categoryId: number;
    requestUrl: string;
    platformName?: string;
    developerName?: string;
    sourceUrl?: string;
    licenseId: number;
    // tools?: { name: string; content: string }[];
};

export function useUploadForm() {
    // 폼 refs
    const mcpNameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const serverURLRef = useRef<HTMLInputElement>(null);
    const connectionPlatformRef = useRef<HTMLInputElement>(null);
    const developerNameRef = useRef<HTMLInputElement>(null);
    const sourceCodeURLRef = useRef<HTMLInputElement>(null);
    const licenseRef = useRef<HTMLInputElement>(null);

    // 상태
    const [error, setError] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    // 아이콘 파일
    const [iconFile, setIconFile] = useState<File | null>(null);
    const onFileSelect = (file: File | null) => setIconFile(file ?? null);

    // /upload?mcpId=123
    const searchParams = useSearchParams();
    const rawMcpId = searchParams.get("mcpId");
    const mcpId = rawMcpId && /^\d+$/.test(rawMcpId) ? Number(rawMcpId) : 0;

    // 상세에서 받은 "유효한" ID 값들 및 platform candidates
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [licenseId, setLicenseId] = useState<number | null>(null);
    const [platformList, setPlatformList] = useState<string[]>([]);

    /** 상세 선로딩 + 플랫폼 목록 */
    useEffect(() => {
        (async () => {
            if (mcpId > 0) {
                try {
                    const detail = await getMcpMetaById(mcpId);
                    // 상세의 ID 값 저장 (이게 있어야 404 방지)
                    if (typeof detail.categoryId === "number") setCategoryId(detail.categoryId);
                    if (typeof detail.licenseId === "number") setLicenseId(detail.licenseId);

                    // 폼 프리필
                    if (detail.name && mcpNameRef.current) mcpNameRef.current.value = detail.name;
                    if (detail.description && descriptionRef.current) descriptionRef.current.value = detail.description;
                    if (detail.requestUrl && serverURLRef.current) serverURLRef.current.value = detail.requestUrl;
                    if (detail.platformName && connectionPlatformRef.current) connectionPlatformRef.current.value = detail.platformName;
                    if (detail.developerName && developerNameRef.current) developerNameRef.current.value = detail.developerName;
                    if (detail.sourceUrl && sourceCodeURLRef.current) sourceCodeURLRef.current.value = detail.sourceUrl;
                    if (detail.licenseId && licenseRef.current) licenseRef.current.value = String(detail.licenseId);
                } catch (e) {
                    console.warn("[GET /mcps/dashboard/{mcpId}] 상세 로드 실패:", e);
                }
            }

            try {
                const list = await getPlatforms();
                setPlatformList(list);
            } catch (e) {
                console.warn("[PATCH /mcps/dashboard/platform] 목록 로드 실패:", e);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mcpId]);

    /** 필수값 검증 */
    const validate = (): boolean => {
        if (!mcpNameRef.current?.value.trim()) {
            setError(ERROR_MESSAGES.MCP_NAME); mcpNameRef.current?.focus(); return false;
        }
        if (!descriptionRef.current?.value.trim()) {
            setError(ERROR_MESSAGES.DESCRIPTION); descriptionRef.current?.focus(); return false;
        }
        if (!serverURLRef.current?.value.trim()) {
            setError(ERROR_MESSAGES.SERVER_URL); serverURLRef.current?.focus(); return false;
        }
        if (!connectionPlatformRef.current?.value.trim()) {
            setError(ERROR_MESSAGES.CONNECTION_PLATFORM); connectionPlatformRef.current?.focus(); return false;
        }
        if (!developerNameRef.current?.value.trim()) {
            setError(ERROR_MESSAGES.DEVELOPER_NAME); developerNameRef.current?.focus(); return false;
        }
        if (!sourceCodeURLRef.current?.value.trim()) {
            setError(ERROR_MESSAGES.SOURCE_CODE_URL); sourceCodeURLRef.current?.focus(); return false;
        }
        if (!licenseRef.current?.value.trim()) {
            setError(ERROR_MESSAGES.LICENSE); licenseRef.current?.focus(); return false;
        }
        setError("");
        return true;
    };

    /** 현재 폼 값 수집 */
    const getFormData = (): MCPFormData => ({
        mcpName: mcpNameRef.current?.value ?? "",
        description: descriptionRef.current?.value ?? "",
        serverURL: serverURLRef.current?.value ?? "",
        connectionPlatform: connectionPlatformRef.current?.value ?? "",
        developerName: developerNameRef.current?.value ?? "",
        sourceCodeURL: sourceCodeURLRef.current?.value ?? "",
        license: licenseRef.current?.value ?? "",
    });

    /** 배포 (TODO: 실제 API 연동) */
    const handleDeploy = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const formData = getFormData();
        console.log("Deploy 제출 성공!", formData);
    };

    /** 임시저장 (multipart/form-data) */
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // mcpId는 편집 플로우에서 필수
        if (mcpId <= 0) {
            setError("유효한 MCP ID가 없습니다. 마이페이지 임시저장 목록에서 'Edit'로 진입했는지 확인하세요.");
            setTimeout(() => setError(""), 3000);
            return;
        }

        const form = getFormData();

        // licenseId: 입력 숫자 > 상세값
        const inputLic = Number(form.license);
        const effectiveLicenseId = Number.isFinite(inputLic) && inputLic > 0
            ? inputLic
            : (licenseId ?? 0);

        // categoryId/licenseId는 실제 존재하는 값이어야 404를 피함
        if (!categoryId || categoryId <= 0) {
            setError("카테고리 ID를 확인할 수 없습니다. 상세 조회를 통해 값을 받아오지 못했습니다.");
            setTimeout(() => setError(""), 3500);
            return;
        }
        if (!effectiveLicenseId || effectiveLicenseId <= 0) {
            setError("라이선스 ID가 유효하지 않습니다. 숫자로 입력하거나 상세 조회 값을 사용하세요.");
            setTimeout(() => setError(""), 3500);
            return;
        }

        // 플랫폼 검증(선택): 서버가 목록 내 값만 허용한다면 방어
        const platformName = form.connectionPlatform?.trim();
        if (platformList.length && platformName && !platformList.includes(platformName)) {
            setError(`플랫폼명이 유효하지 않습니다. 지원 목록: ${platformList.join(", ")}`);
            setTimeout(() => setError(""), 4000);
            return;
        }

        const meta: MetaPayload = {
            mcpId,
            name: form.mcpName,
            description: form.description,
            categoryId,                 // 상세에서 받은 유효한 ID
            requestUrl: form.serverURL,
            platformName,
            developerName: form.developerName,
            sourceUrl: form.sourceCodeURL,
            licenseId: effectiveLicenseId, // 입력 or 상세
        };

        try {
            const fd = new FormData();
            if (iconFile instanceof File) fd.append("file", iconFile);
            fd.append("meta", new Blob([JSON.stringify(meta)], { type: "application/json" }));

            if (process.env.NODE_ENV !== "production") {
                console.log("[SAVE DEBUG] meta =", meta);
                console.log("[SAVE DEBUG] baseURL =", (axiosInstance.defaults as any).baseURL);
            }

            const { data } = await axiosInstance.patch("/mcps/dashboard/meta", fd);
            console.log("[PATCH /mcps/dashboard/meta] ✓", data);
            setMessage(data?.message ?? "임시 저장되었습니다.");
            setTimeout(() => setMessage(""), 3000);
        } catch (err: any) {
            console.error("[PATCH /mcps/dashboard/meta] ✗", err?.response || err);
            setError(err?.response?.data?.message || "임시 저장 중 오류가 발생했습니다.");
            setTimeout(() => setError(""), 4000);
        }
    };

    return {
        refs: {
            mcpNameRef,
            descriptionRef,
            serverURLRef,
            connectionPlatformRef,
            developerNameRef,
            sourceCodeURLRef,
            licenseRef,
        },
        onFileSelect, // <UploadIcon onFileSelect={onFileSelect} />
        error,
        message,
        handleDeploy,
        handleSave,
        // 필요하면 플랫폼 자동완성에 사용
        platformList,
    };
}
