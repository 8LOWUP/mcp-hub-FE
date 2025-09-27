"use client";

import { useRef, useState } from "react";
import { ERROR_MESSAGES } from "./constants";
import { MCPFormData } from "./types";

export function useUploadForm() {
    const mcpNameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const serverURLRef = useRef<HTMLInputElement>(null);
    const connectionPlatformRef = useRef<HTMLInputElement>(null);
    const developerNameRef = useRef<HTMLInputElement>(null);
    const sourceCodeURLRef = useRef<HTMLInputElement>(null);
    const licenseRef = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string>("");
    const [message, setMessage] = useState<string>(""); // 임시 저장 메시지

    const validate = (): boolean => {
        if (!mcpNameRef.current?.value.trim()) {
            setError(ERROR_MESSAGES.MCP_NAME);
            mcpNameRef.current?.focus();
            return false;
        }
        if (!descriptionRef.current?.value.trim()) {
            setError(ERROR_MESSAGES.DESCRIPTION);
            descriptionRef.current?.focus();
            return false;
        }
        if (!serverURLRef.current?.value.trim()) {
            setError(ERROR_MESSAGES.SERVER_URL);
            serverURLRef.current?.focus();
            return false;
        }
        if (!connectionPlatformRef.current?.value.trim()) {
            setError(ERROR_MESSAGES.CONNECTION_PLATFORM);
            connectionPlatformRef.current?.focus();
            return false;
        }
        if (!developerNameRef.current?.value.trim()) {
            setError(ERROR_MESSAGES.DEVELOPER_NAME);
            developerNameRef.current?.focus();
            return false;
        }
        if (!sourceCodeURLRef.current?.value.trim()) {
            setError(ERROR_MESSAGES.SOURCE_CODE_URL);
            sourceCodeURLRef.current?.focus();
            return false;
        }
        if (!licenseRef.current?.value.trim()) {
            setError(ERROR_MESSAGES.LICENSE);
            licenseRef.current?.focus();
            return false;
        }

        setError("");
        return true;
    };

    const getFormData = (): MCPFormData => ({
        mcpName: mcpNameRef.current?.value ?? "",
        description: descriptionRef.current?.value ?? "",
        serverURL: serverURLRef.current?.value ?? "",
        connectionPlatform: connectionPlatformRef.current?.value ?? "",
        developerName: developerNameRef.current?.value ?? "",
        sourceCodeURL: sourceCodeURLRef.current?.value ?? "",
        license: licenseRef.current?.value ?? "",
    });

    const handleDeploy = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const formData = getFormData();
        console.log("Deploy 제출 성공!", formData);
        // 나중에 API 호출 or 페이지 이동 추가 가능
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = getFormData();
        console.log("임시 저장 성공!", formData);
        setMessage("임시 저장되었습니다."); // 메시지 설정
        setTimeout(() => setMessage(""), 3000); // 3초 후 메시지 제거
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
        error,
        message,
        handleDeploy,
        handleSave,
    };
}
