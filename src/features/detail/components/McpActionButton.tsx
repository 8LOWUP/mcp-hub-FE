"use client";

import React from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Loader2 } from "lucide-react";

interface McpActionButtonProps {
    isLoggedIn: boolean;
    isSaved: boolean;
    isSaving: boolean;
    handleSave: () => Promise<void>;
    handleGoToChat: () => Promise<void>;
}

export default function McpActionButton({
                                            isLoggedIn,
                                            isSaved,
                                            isSaving,
                                            handleSave,
                                            handleGoToChat,
                                        }: McpActionButtonProps)
{
    if (!isLoggedIn) {
        return (
            <PrimaryButton
                disabled
                additionalClassName="
          w-full py-3 mb-5 text-base rounded-full
          bg-gray-100/40 text-gray-400 font-medium
          border border-gray-300/30
          backdrop-blur-sm
          cursor-not-allowed
          shadow-sm
          hover:scale-100 hover:shadow-none hover:brightness-100
          transition-all duration-200"
            >
                로그인 후 이용할 수 있습니다
            </PrimaryButton>
        );
    }

    if (!isSaved) {
        return (
            <PrimaryButton
                additionalClassName="w-full py-3 mb-5 text-base transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-full bg-amber-400 text-black hover:bg-amber-300"
                onClick={handleSave}
                disabled={isSaving}
            >
                {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            저장 중...
          </span>
                ) : (
                    "💾 MCP 저장하기"
                )}
            </PrimaryButton>
        );
    }

    return (
        <PrimaryButton
            additionalClassName="w-full py-3 mb-5 text-base transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-full"
            onClick={handleGoToChat}
        >
            Go to Chat
        </PrimaryButton>
    );
}
