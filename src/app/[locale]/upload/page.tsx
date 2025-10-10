"use client";

import React from "react";
import { useSearchParams, usePathname } from "next/navigation";

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

import { useUploadForm } from "@/features/upload/hooks/uploadForm";

export default function MCPUploadPage() {
    // URL에서 현재 모드 텍스트만 머리표시용으로 사용 (로직은 훅에서 처리)
    const params = useSearchParams();
    const pathname = usePathname();
    const mode = (params.get("mode") ?? "") as "edit" | "";
    const locale = pathname.split("/")[1] || "en"; // 필요시 쓰세요(지금은 표기만)

    // 훅: 현재 프로젝트 구현에 맞춰 인자 없이 사용
    const {
        refs,
        error,
        message,
        handleDeploy,
        handleSave,
        onFileSelect, // ← 아이콘 파일 전달 콜백 (hooks/uploadForm.ts에서 제공)
    } = useUploadForm();

    return (
        <div className="flex pt-20 justify-center items-center min-h-screen bg-surface-1 px-4">
            <div className="w-full max-w-3xl p-6 bg-surface-1 text-white rounded shadow-lg">
                <h1 className="text-2xl font-bold mb-2">
                    {mode === "edit" ? "Edit MCP (Draft)" : "Upload MCP"}
                </h1>
                <p className="pb-10 text-muted">
                    Provide the necessary information to share your MCP with the community.
                </p>

                {/* 제출은 JS로 처리 */}
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <MCPNameInput ref={refs.mcpNameRef} onEnter={() => refs.descriptionRef.current?.focus()} />
                    <DescriptionInput ref={refs.descriptionRef} onEnter={() => refs.serverURLRef.current?.focus()} />
                    <TagsInput />
                    <ServerURLInput ref={refs.serverURLRef} onEnter={() => refs.connectionPlatformRef.current?.focus()} />
                    <ToolsDescriptionInput />
                    <ConnectionPlatformInput ref={refs.connectionPlatformRef} onEnter={() => refs.developerNameRef.current?.focus()} />
                    <DeveloperNameInput ref={refs.developerNameRef} onEnter={() => refs.sourceCodeURLRef.current?.focus()} />
                    <SourceCodeURLInput ref={refs.sourceCodeURLRef} onEnter={() => refs.licenseRef.current?.focus()} />
                    <LicenseInput ref={refs.licenseRef} onEnter={() => {}} />

                    {/* 아이콘 업로드 - 파일을 훅으로 전달 */}
                    <UploadIcon onFileSelect={onFileSelect} />

                    {/* 메시지 */}
                    <div className="flex justify-end mb-2">
                        {error && <p className="text-red-500 font-semibold text-right">{error}</p>}
                        {message && <p className="text-green-500 font-semibold text-right">{message}</p>}
                    </div>

                    {/* 버튼 */}
                    <div className="flex justify-end gap-2 mb-2">
                        <button
                            type="button"
                            onClick={handleSave} // 인자 없이 호출
                            className="px-4 py-2 rounded text-white w-full decoration-yellow-200 hover:decoration-accent hover:underline underline-offset-10 sm:w-auto"
                        >
                            Storage
                        </button>
                        <button
                            type="button"
                            onClick={handleDeploy}
                            className="px-4 py-2 bg-accent rounded text-black hover:bg-accent-hover w-full sm:w-auto"
                        >
                            Deploy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
