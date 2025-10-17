"use client";

import React from "react";
import { useTranslations } from "next-intl";
import BaseModal from "@/components/ui/modal/BaseModal";
import PrimaryButton from "@/components/ui/PrimaryButton";

interface TokenErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  onGoToSettings?: () => void;
}

const TokenErrorModal: React.FC<TokenErrorModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  onGoToSettings,
}) => {
  // Locale translations
  const t = useTranslations('Common');
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('tokenError')}
      size="md"
      footer={
        <>
          <PrimaryButton 
            onClick={onClose}
            additionalClassName="bg-secondary text-black hover:bg-secondary-hover"
          >
            {t('close')}
          </PrimaryButton>
          {onRetry && (
            <PrimaryButton 
              onClick={onRetry}
              additionalClassName="bg-accent text-black hover:bg-accent-hover"
            >
              {t('retry')}
            </PrimaryButton>
          )}
          {onGoToSettings && (
            <PrimaryButton 
              onClick={onGoToSettings}
              additionalClassName="bg-primary text-black hover:bg-primary-hover"
            >
              {t('goToSettings')}
            </PrimaryButton>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-warning/20 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-warning" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h3 className="text-title3 text-primary mb-2">
            유효하지 않은 액세스 토큰
          </h3>
          <p className="text-secondary text-body2">
            LLM 서비스에 연결할 수 없습니다. <br />
            토큰이 만료되었거나 유효하지 않을 수 있습니다.
          </p>
        </div>
        
        <div className="bg-surface-2 rounded-lg p-4">
          <h4 className="text-body1 font-medium text-primary mb-2">
            해결 방법:
          </h4>
          <ul className="text-body2 text-secondary space-y-1">
            <li>• LLM 서비스 설정에서 토큰을 다시 확인해주세요</li>
            <li>• 토큰이 올바른지 확인하고 다시 입력해주세요</li>
            <li>• 토큰이 만료되었다면 새로 발급받아주세요</li>
          </ul>
        </div>
      </div>
    </BaseModal>
  );
};

export default TokenErrorModal;
