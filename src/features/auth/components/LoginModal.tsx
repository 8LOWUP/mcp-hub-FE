"use client";
import React from "react";
import { usePathname } from "next/navigation";
import BaseModal from "@/components/ui/modal/BaseModal";
import SocialSignInButton from "./SocialSignInButton";
import { ProviderId } from "@/features/auth/constants";
import { signIn } from "next-auth/react";

type Props = { isOpen: boolean; onClose: () => void };

const LoginModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const locale = pathname.split("/")[1] || "en";
    const callbackUrl = `/${locale}`;

    const handleSignIn = async (provider: ProviderId) => {
        (document.activeElement as HTMLElement | null)?.blur();
        await signIn(provider, { callbackUrl });
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
                <SocialSignInButton provider="google" onClick={handleSignIn} />
                <SocialSignInButton provider="github" onClick={handleSignIn} />
                <SocialSignInButton provider="kakao" onClick={handleSignIn} />
            </div>
            <p className="mt-5 text-center text-muted text-caption">
                로그인 시 약관 및 개인정보처리방침에 동의합니다.
            </p>
        </BaseModal>
    );
};

export default LoginModal;
