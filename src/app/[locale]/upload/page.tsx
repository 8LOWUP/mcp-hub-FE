"use client";

import { useRef, useState } from "react";
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

export default function MCPUploadPage() {
    const mcpNameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const serverURLRef = useRef<HTMLInputElement>(null);
    const connectionPlatformRef = useRef<HTMLInputElement>(null);
    const developerNameRef = useRef<HTMLInputElement>(null);
    const sourceCodeURLRef = useRef<HTMLInputElement>(null);
    const licenseRef = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 모든 필드 체크
        if (!mcpNameRef.current?.value.trim()) {
            setError("MCP 이름을 입력해주세요.");
            mcpNameRef.current?.focus();
            return;
        }
        if (!descriptionRef.current?.value.trim()) {
            setError("설명을 입력해주세요.");
            descriptionRef.current?.focus();
            return;
        }
        if (!serverURLRef.current?.value.trim()) {
            setError("서버 URL을 입력해주세요.");
            serverURLRef.current?.focus();
            return;
        }
        if (!connectionPlatformRef.current?.value.trim()) {
            setError("연결 플랫폼을 입력해주세요.");
            connectionPlatformRef.current?.focus();
            return;
        }
        if (!developerNameRef.current?.value.trim()) {
            setError("개발자 이름을 입력해주세요.");
            developerNameRef.current?.focus();
            return;
        }
        if (!sourceCodeURLRef.current?.value.trim()) {
            setError("소스 코드 URL을 입력해주세요.");
            sourceCodeURLRef.current?.focus();
            return;
        }
        if (!licenseRef.current?.value.trim()) {
            setError("라이센스를 입력해주세요.");
            licenseRef.current?.focus();
            return;
        }

        // 모든 입력이 정상일 경우
        setError("");
        console.log("폼 제출 성공!");
        // 실제 제출 로직 실행
    };

    return (
        <div className="flex pt-20 justify-center items-center min-h-screen bg-surface-1 px-4">
            <div className="w-full max-w-3xl p-6 bg-surface-1 text-white rounded shadow-lg">
                <h1 className="text-2xl font-bold mb-2">Upload MCP</h1>
                <p className="pb-10 text-muted">
                    Provide the necessary information to share your MCP with the community.
                </p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <MCPNameInput ref={mcpNameRef} onEnter={() => descriptionRef.current?.focus()} />
                    <DescriptionInput ref={descriptionRef} onEnter={() => serverURLRef.current?.focus()} />
                    <TagsInput />
                    <ServerURLInput ref={serverURLRef} onEnter={() => connectionPlatformRef.current?.focus()} />
                    <ConnectionPlatformInput ref={connectionPlatformRef} onEnter={() => developerNameRef.current?.focus()} />
                    <DeveloperNameInput ref={developerNameRef} onEnter={() => sourceCodeURLRef.current?.focus()} />
                    <SourceCodeURLInput ref={sourceCodeURLRef} onEnter={() => licenseRef.current?.focus()} />
                    <LicenseInput ref={licenseRef} onEnter={() => {}} />
                    <ToolsDescriptionInput />
                    <UploadIcon />

                    {/* Deploy 버튼 바로 위 경고 메시지 (오른쪽 정렬) */}
                    <div className="flex justify-end mb-2">
                        {error && (
                            <p className="text-red-500 font-semibold text-right">
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mb-2">
                        <button
                            type="submit"
                            className="px-4 py-2 rounded text-white w-full decoration-yellow-200 hover:decoration-accent hover:underline underline-offset-10 sm:w-auto"
                        >
                            Storage
                        </button>
                        <button
                            type="submit"
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
