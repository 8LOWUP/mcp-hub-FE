// src/hooks/upload/useUploadForm.ts
"use client";

import { useRef, useState } from "react";
import { McpMetaPayload } from "@/types/upload/upload-types";
import {
    createMcpDraft,
    uploadFile,
    saveMcpMeta,
    publishMcp,
} from "@/services/upload/api";
import {
    ERROR_MESSAGES,
    CATEGORY_MAP,
    LICENSE_MAP,
} from "@/constants/upload/constants";

export function useUploadForm() {
    // refs (입력값 수집)
    const mcpNameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const serverURLRef = useRef<HTMLInputElement>(null);
    const connectionPlatformRef = useRef<HTMLInputElement>(null);
    const developerNameRef = useRef<HTMLInputElement>(null);
    const sourceCodeURLRef = useRef<HTMLInputElement>(null);
    const licenseRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLInputElement>(null); // ✅ TagsInput의 hidden input

    // 파일 상태
    const [file, setFile] = useState<File | null>(null);

    // MCP ID (draft 생성 후 반환값 보관)
    const [mcpId, setMcpId] = useState<number | null>(null);

    // 에러/메시지 상태
    const [error, setError] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    // 에러 헬퍼
    const setErr = (msg: string): false => {
        console.warn("❌ Validation Error:", msg);
        setError(msg);
        return false;
    };

    // 유효성 검사
    const validate = (): boolean => {
        console.log("✅ Validation 시작");

        if (!mcpNameRef.current?.value.trim()) return setErr(ERROR_MESSAGES.MCP_NAME);
        if (!descriptionRef.current?.value.trim())
            return setErr(ERROR_MESSAGES.DESCRIPTION);
        if (!serverURLRef.current?.value.trim())
            return setErr(ERROR_MESSAGES.SERVER_URL);
        if (!connectionPlatformRef.current?.value.trim())
            return setErr(ERROR_MESSAGES.CONNECTION_PLATFORM);
        if (!developerNameRef.current?.value.trim())
            return setErr(ERROR_MESSAGES.DEVELOPER_NAME);
        if (!sourceCodeURLRef.current?.value.trim())
            return setErr(ERROR_MESSAGES.SOURCE_CODE_URL);
        if (!licenseRef.current?.value.trim()) return setErr(ERROR_MESSAGES.LICENSE);

        // ✅ category 값 확인 (타입 세이프)
        const categoryVal = categoryRef.current?.value;
        console.log("📌 categoryRef.current:", categoryRef.current);
        console.log("📌 categoryRef.value:", categoryVal);

        if (!categoryVal) return setErr("카테고리를 선택해주세요.");

        console.log("✅ Validation 통과");
        setError("");
        return true;
    };

    // draft 없으면 생성해서 mcpId 보장
    const ensureDraft = async (): Promise<number> => {
        if (mcpId) {
            console.log("📌 기존 Draft ID 사용:", mcpId);
            return mcpId;
        }
        const id = await createMcpDraft();
        console.log("🆕 Draft 생성 완료. MCP ID:", id);
        setMcpId(id);
        return id;
    };

    // meta payload 생성 (파일 업로드 포함)
    const buildMetaPayload = async (): Promise<McpMetaPayload> => {
        console.log("📦 Meta payload 생성 시작");

        // 카테고리/라이선스 문자열 → 숫자 매핑
        const categoryName = (categoryRef.current?.value || "etc").trim();
        const licenseName = (licenseRef.current?.value || "MIT License").trim();

        const categoryId = CATEGORY_MAP[categoryName] ?? CATEGORY_MAP["etc"];
        const licenseId = LICENSE_MAP[licenseName] ?? LICENSE_MAP["MIT License"];

        console.log("📌 Category:", categoryName, "➡", categoryId);
        console.log("📌 License:", licenseName, "➡", licenseId);

        // 파일 업로드
        let imageUrl = "";
        if (file) {
            console.log("📤 파일 업로드 시작:", file.name, file.size, "bytes");
            imageUrl = await uploadFile("image", file);
            console.log("✅ 파일 업로드 성공. URL:", imageUrl);
        } else {
            console.log("⚠️ 업로드된 파일 없음 → imageUrl은 빈 값");
        }

        const payload: McpMetaPayload = {
            name: mcpNameRef.current?.value ?? "",
            description: descriptionRef.current?.value ?? "",
            sourceUrl: sourceCodeURLRef.current?.value ?? "",
            imageUrl,
            requestUrl: serverURLRef.current?.value ?? "",
            developerName: developerNameRef.current?.value ?? "",
            isKeyRequired: true,
            categoryId,
            platformName: connectionPlatformRef.current?.value ?? "",
            licenseId,
            tools: [],
        };

        console.log("📦 최종 Meta Payload:", payload);
        return payload;
    };

    // 임시 저장
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            console.log("💾 [임시저장] 시작");
            const id = await ensureDraft();
            const payload = await buildMetaPayload();
            await saveMcpMeta(id, payload);
            console.log("✅ [임시저장] 완료");
            setMessage("임시 저장되었습니다.");
            clearMessageLater();
        } catch (err) {
            setError("임시 저장 실패. 콘솔을 확인하세요.");
            console.error("❌ [임시저장] 에러:", err);
        }
    };

    // 배포
    const handleDeploy = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            console.log("🚀 [배포] 시작");
            const id = await ensureDraft();
            const payload = await buildMetaPayload();
            await saveMcpMeta(id, payload);
            console.log("✅ Meta 저장 완료, 배포 요청 시작");
            await publishMcp(id);
            console.log("🎉 [배포] 완료!");
            setMessage("배포 성공!");
            clearMessageLater();
        } catch (err) {
            setError("배포 실패. 콘솔을 확인하세요.");
            console.error("❌ [배포] 에러:", err);
        }
    };

    // 파일 선택 핸들러
    const handleFileSelect = (selectedFile: File | null) => {
        setFile(selectedFile);
        console.log("📂 선택된 파일:", selectedFile ? selectedFile.name : "없음");
    };

    // 메시지 자동 제거
    const clearMessageLater = () => setTimeout(() => setMessage(""), 3000);

    return {
        refs: {
            mcpNameRef,
            descriptionRef,
            serverURLRef,
            connectionPlatformRef,
            developerNameRef,
            sourceCodeURLRef,
            licenseRef,
            categoryRef,
        },
        error,
        message,
        handleSave,
        handleDeploy,
        handleFileSelect,
    };
}
