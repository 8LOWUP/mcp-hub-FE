"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "@/components/ui/modal/BaseModal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useLLMs, useLLMTokens, useSetLLMToken, useUpdateLLMToken } from "@/hooks/chat/useLLM";

interface LLMSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLLMId?: string;
}

const LLMSettingsModal: React.FC<LLMSettingsModalProps> = ({
  isOpen,
  onClose,
  selectedLLMId,
}) => {
  const [token, setToken] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 현재 선택된 LLM ID는 상위에서 명시적으로 전달받은 값만 사용
  const currentLLMId = selectedLLMId || null;
  
  // LLM 목록 조회 (fallback 용도)
  const { data: llmList, isLoading: llmListLoading } = useLLMs();

  // 현재 LLM의 토큰 정보 조회
  const { 
    data: currentTokens, 
    isLoading: tokensLoading, 
    error: tokensError 
  } = useLLMTokens(currentLLMId || null);
  
  // 토큰 설정/수정 뮤테이션
  const setTokenMutation = useSetLLMToken();
  const updateTokenMutation = useUpdateLLMToken();

  // 현재 선택된 모델 정보 (llmList에서 직접 조회)
  const currentModel = Array.isArray(llmList)
    ? (llmList as any[]).find((llm) => llm?.llmId === currentLLMId)
    : undefined;
  const currentModelName = currentModel?.modelName;
  const currentModelProvider = currentModel?.llmProvider;
  
  // 현재 토큰이 있는지 확인
  const hasExistingToken = Array.isArray(currentTokens) && currentTokens.length > 0;
  const existingToken = hasExistingToken ? currentTokens[0]?.token : null;

  useEffect(() => {
    if (hasExistingToken && existingToken) {
      setToken(existingToken);
    } else {
      setToken("");
    }
  }, [hasExistingToken, existingToken]);


  const handleSaveToken = async () => {
    if (!currentLLMId || !token.trim()) {
      alert("토큰을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      if (hasExistingToken) {
        // 기존 토큰 수정
        await updateTokenMutation.mutateAsync({
          llmId: currentLLMId,
          llmToken: token.trim()
        });
      } else {
        // 새 토큰 설정
        await setTokenMutation.mutateAsync({
          llmId: currentLLMId,
          llmToken: token.trim()
        });
      }
      
      setIsEditing(false);
      toast.success("토큰이 성공적으로 저장되었습니다.");
    } catch {
      toast.error("토큰 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (hasExistingToken && existingToken) {
      setToken(existingToken);
    } else {
      setToken("");
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="LLM 토큰 설정"
      size="lg"
      footer={
        <div className="flex gap-3">
          <PrimaryButton 
            onClick={handleClose}
            additionalClassName="bg-secondary text-black hover:bg-secondary-hover"
          >
            닫기
          </PrimaryButton>
          {isEditing ? (
            <>
              <PrimaryButton 
                onClick={handleCancel}
                additionalClassName="bg-secondary text-black hover:bg-secondary-hover"
              >
                취소
              </PrimaryButton>
              <PrimaryButton 
                onClick={handleSaveToken}
                disabled={isLoading || !token.trim()}
                additionalClassName="bg-accent text-black hover:bg-accent-hover disabled:opacity-50"
              >
                {isLoading ? "저장 중..." : "저장"}
              </PrimaryButton>
            </>
          ) : (
            <PrimaryButton 
              onClick={handleEdit}
              additionalClassName="bg-primary text-black hover:bg-primary-hover"
            >
              {hasExistingToken ? "토큰 수정" : "토큰 설정"}
            </PrimaryButton>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* 현재 선택된 LLM 정보 */}
        <div className="bg-surface-2 rounded-lg p-4">
          <h3 className="text-body1 font-medium text-primary mb-2">
            현재 선택된 LLM
          </h3>
          {currentModelName ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-body2 text-secondary">모델명:</span>
                <span className="text-body2 text-primary font-medium">{currentModelName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-body2 text-secondary">제공업체:</span>
                <span className="text-body2 text-primary">{currentModelProvider || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-body2 text-secondary">LLM ID:</span>
                <span className="text-body2 text-primary">{currentLLMId || "-"}</span>
              </div>
            </div>
          ) : (
            <p className="text-body2 text-secondary">
              {llmListLoading ? "LLM 목록을 불러오는 중..." : "선택된 LLM이 없습니다."}
            </p>
          )}
        </div>

        {/* 토큰 상태 */}
        <div className="bg-surface-2 rounded-lg p-4">
          <h3 className="text-body1 font-medium text-primary mb-2">
            {"토큰 상태"}
          </h3>
          {tokensLoading ? (
            <p className="text-body2 text-secondary">토큰 정보를 확인하는 중...</p>
          ) : tokensError ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-body2 text-warning">토큰 확인 실패</span>
            </div>
          ) : hasExistingToken ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-body2 text-success">토큰이 설정되어 있습니다</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-body2 text-warning">토큰이 설정되지 않았습니다</span>
            </div>
          )}
        </div>

        {/* 토큰 입력 */}
        {isEditing && (
          <div className="space-y-3">
            <label className="block">
              <span className="text-body2 font-medium text-primary mb-2 block">
                {hasExistingToken ? "토큰 수정" : "토큰 입력"}
              </span>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="LLM API 토큰을 입력하세요..."
                className="w-full h-24 px-3 py-2 border border-muted rounded-lg bg-surface-1 text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                disabled={isLoading}
              />
            </label>
            <p className="text-caption text-secondary">
              • 토큰은 안전하게 저장되며 암호화됩니다<br/>
              • 토큰이 만료되면 새로 발급받아 설정해주세요
            </p>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default LLMSettingsModal;
