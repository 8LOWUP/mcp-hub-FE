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

import { useUploadForm } from "@/features/upload/hooks/uploadForm";

export default function MCPUploadPage() {
    const { refs, error, message, handleDeploy, handleSave } = useUploadForm();

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
                    <TagsInput />
                    <ServerURLInput ref={refs.serverURLRef} onEnter={() => refs.connectionPlatformRef.current?.focus()} />
                    <ToolsDescriptionInput />
                    <ConnectionPlatformInput ref={refs.connectionPlatformRef} onEnter={() => refs.developerNameRef.current?.focus()} />
                    <DeveloperNameInput ref={refs.developerNameRef} onEnter={() => refs.sourceCodeURLRef.current?.focus()} />
                    <SourceCodeURLInput ref={refs.sourceCodeURLRef} onEnter={() => refs.licenseRef.current?.focus()} />
                    <LicenseInput ref={refs.licenseRef} onEnter={() => {}} />
                    <UploadIcon />

                    <div className="flex justify-end mb-2">
                        {error && (
                            <p className="text-red-500 font-semibold text-right">{error}</p>
                        )}
                        {message && (
                            <p className="text-green-500 font-semibold text-right">{message}</p>
                        )}
                    </div>

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
