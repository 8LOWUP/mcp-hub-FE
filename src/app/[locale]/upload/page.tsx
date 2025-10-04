"use client";

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

import { useRef, useState } from "react";
import { useUploadFile, useSaveMcpMeta, usePublishMcp } from "@/hooks/upload/useMcpUpload";

export default function MCPUploadPage() {
    // ✅ 각 컴포넌트에 맞는 ref 타입 지정
    const refs = {
        mcpNameRef: useRef<HTMLInputElement>(null),
        // ✅ DescriptionInput이 textarea 기반이라서 HTMLTextAreaElement
        descriptionRef: useRef<HTMLTextAreaElement>(null),
        categoryRef: useRef<HTMLInputElement>(null),
        serverURLRef: useRef<HTMLInputElement>(null),
        connectionPlatformRef: useRef<HTMLInputElement>(null),
        developerNameRef: useRef<HTMLInputElement>(null),
        sourceCodeURLRef: useRef<HTMLInputElement>(null),
        licenseRef: useRef<HTMLInputElement>(null),
    };

    // ✅ 상태
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // ✅ API 훅
    const uploadFileMutation = useUploadFile();
    const saveMcpMetaMutation = useSaveMcpMeta();
    const publishMcpMutation = usePublishMcp();

    // ✅ 파일 선택
    const handleFileSelect = (selectedFile: File | null) => {
        if (!selectedFile) return; // null일 때는 무시
        console.log("선택된 파일:", selectedFile);
        // 이후 파일 업로드 로직 수행
    };

    // ✅ 임시 저장
    const handleSave = async () => {
        try {
            setError(null);
            setMessage("Saving MCP metadata...");

            // 1️⃣ 파일 업로드
            let imageUrl = "";
            if (file) {
                const uploadRes = await uploadFileMutation.mutateAsync({
                    category: "mcp",
                    file,
                });
                imageUrl = uploadRes.result.url;
            }

            // 2️⃣ MCP 임시 저장
            await saveMcpMetaMutation.mutateAsync({
                file: "",
                meta: {
                    mcpId: 0,
                    name: refs.mcpNameRef.current?.value || "",
                    description: refs.descriptionRef.current?.value || "",
                    categoryId: 0,
                    licenseId: 0,
                    sourceUrl: refs.sourceCodeURLRef.current?.value || "",
                    imageUrl,
                    platformName: refs.connectionPlatformRef.current?.value || "",
                    requestUrl: refs.serverURLRef.current?.value || "",
                    developerName: refs.developerNameRef.current?.value || "",
                    isKeyRequired: false,
                    tools: [],
                },
            });

            setMessage("MCP metadata saved successfully.");
        } catch (err) {
            console.error(err);
            setError("Failed to save MCP metadata.");
            setMessage(null);
        }
    };

    // ✅ 배포
    const handleDeploy = async () => {
        try {
            setError(null);
            setMessage("Deploying MCP...");

            // 1️⃣ 파일 업로드
            let imageUrl = "";
            if (file) {
                const uploadRes = await uploadFileMutation.mutateAsync({
                    category: "mcp",
                    file,
                });
                imageUrl = uploadRes.result.url;
            }

            // 2️⃣ MCP 배포
            await publishMcpMutation.mutateAsync({
                file: "",
                meta: {
                    mcpId: 0,
                    name: refs.mcpNameRef.current?.value || "",
                    description: refs.descriptionRef.current?.value || "",
                    categoryId: 0,
                    licenseId: 0,
                    sourceUrl: refs.sourceCodeURLRef.current?.value || "",
                    imageUrl,
                    platformName: refs.connectionPlatformRef.current?.value || "",
                    requestUrl: refs.serverURLRef.current?.value || "",
                    developerName: refs.developerNameRef.current?.value || "",
                    isKeyRequired: false,
                    tools: [],
                },
            });

            setMessage("MCP deployed successfully.");
        } catch (err) {
            console.error(err);
            setError("Failed to deploy MCP.");
            setMessage(null);
        }
    };

    return (
        <div className="flex pt-20 justify-center items-center min-h-screen bg-surface-1 px-4">
            <div className="w-full max-w-3xl p-6 bg-surface-1 text-white rounded shadow-lg">
                <h1 className="text-2xl font-bold mb-2">Upload MCP</h1>
                <p className="pb-10 text-muted">
                    Provide the necessary information to share your MCP with the community.
                </p>
                <form className="space-y-4">
                    <MCPNameInput ref={refs.mcpNameRef} onEnter={() => refs.descriptionRef.current?.focus()} />
                    <DescriptionInput ref={refs.descriptionRef} onEnter={() => refs.serverURLRef.current?.focus()} />
                    <TagsInput ref={refs.categoryRef} />
                    <ServerURLInput ref={refs.serverURLRef} onEnter={() => refs.connectionPlatformRef.current?.focus()} />
                    <ToolsDescriptionInput />
                    <ConnectionPlatformInput ref={refs.connectionPlatformRef} onEnter={() => refs.developerNameRef.current?.focus()} />
                    <DeveloperNameInput ref={refs.developerNameRef} onEnter={() => refs.sourceCodeURLRef.current?.focus()} />
                    <SourceCodeURLInput ref={refs.sourceCodeURLRef} onEnter={() => refs.licenseRef.current?.focus()} />
                    <LicenseInput ref={refs.licenseRef} onEnter={() => {}} />

                    {/* ✅ 파일 업로드 */}
                    <UploadIcon onFileSelect={handleFileSelect} />

                    {/* ✅ 상태 메시지 */}
                    <div className="flex justify-end mb-2">
                        {error && <p className="text-red-500 font-semibold text-right">{error}</p>}
                        {message && <p className="text-green-500 font-semibold text-right">{message}</p>}
                    </div>

                    {/* ✅ 버튼 */}
                    <div className="flex justify-end gap-2 mb-2">
                        <button
                            type="button"
                            onClick={handleSave}
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
