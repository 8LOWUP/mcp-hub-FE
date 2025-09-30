"use client";
import React from "react";
import { usePathname } from "next/navigation";
import BaseModal from "@/components/ui/modal/BaseModal";
import SocialSignInButton from "./SocialSignInButton";
import { ProviderId } from "@/features/auth/constants";
import { socialLogin } from "@/services/auth/social-login";
import { useLoginStore } from "@/store/login/login-store";

type Props = { isOpen: boolean; onClose: () => void };

const LoginModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const locale = pathname.split("/")[1] || "en";
    const { isLoading, error } = useLoginStore();

    const handleSignIn = async (provider: ProviderId) => {
        (document.activeElement as HTMLElement | null)?.blur();
        
        // 우리가 만든 소셜 로그인 로직 사용
        switch (provider) {
            case 'google':
                socialLogin.google();
                break;
            case 'kakao':
                socialLogin.kakao();
                break;
            case 'github':
                socialLogin.github();
                break;
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center justify-between w-full">
                    <span>Sign In</span>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close login modal"
                        className="ml-2 hover:opacity-80 transition-opacity"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 block"
                        >
                            <path
                                d="M1 17L17 1M17 17L1 1"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>
            }
            size="md"
        >
            <div className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    로그인 오류
                                </h3>
                                <div className="mt-1 text-sm text-red-700">
                                    {error}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <SocialSignInButton 
                    provider="google" 
                    onClick={handleSignIn} 
                    disabled={isLoading}
                />
                <SocialSignInButton 
                    provider="github" 
                    onClick={handleSignIn} 
                    disabled={isLoading}
                />
                <SocialSignInButton 
                    provider="kakao" 
                    onClick={handleSignIn} 
                    disabled={isLoading}
                />
            </div>
            <p className="mt-5 text-center text-muted text-caption">
                로그인 시 약관 및 개인정보처리방침에 동의합니다.
            </p>
        </BaseModal>
    );
};

export default LoginModal;
