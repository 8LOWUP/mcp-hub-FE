"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

interface LandingSearchBarProps {
    placeholder?: string;
}

const LandingChatStartButton = ({ placeholder }: LandingSearchBarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('LandingPage');
    
    // 타이핑 애니메이션을 위한 상태
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping] = useState(true);
    
    // 다국어 placeholder 사용
    const chatPlaceholder = placeholder || t('chatStartPlaceholder');
    
    // 타이핑 애니메이션 효과
    useEffect(() => {
        if (!isTyping) return;
        
        const timer = setTimeout(() => {
            if (currentIndex < chatPlaceholder.length) {
                setDisplayedText(prev => prev + chatPlaceholder[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            } else {
                // 타이핑 완료 후 잠시 대기
                setTimeout(() => {
                    setDisplayedText('');
                    setCurrentIndex(0);
                }, 2000);
            }
        }, 100); // 타이핑 속도 조절
        
        return () => clearTimeout(timer);
    }, [currentIndex, chatPlaceholder, isTyping]);

    // 현재 라우팅에 /chat 추가
    const handleSearch = () => {
        // 현재 경로에서 locale 추출
        const localeMatch = pathname.match(/^\/([a-z]{2})/);
        const locale = localeMatch ? localeMatch[1] : 'en'; // 기본값은 'en'
        
        // /{locale}/chat 형태로 이동
        router.push(`/${locale}/chat`);
    };


    return (
        <div
            onClick={handleSearch}
            className={clsx(
                "flex w-full max-w-2xl justify-between items-center",
                " w-full rounded-full bg-surface-2 p-5 py-3",
                "text-sm text-foreground placeholder:text-muted-foreground",
                "border-gray-500 border-1",
                "cursor-pointer transition-all duration-200",
                "hover:bg-surface-3 hover:scale-[1.02]",
                "active:scale-[0.98] active:bg-surface-3"
        )}>
            <span className="relative">
                {displayedText}
                <span className="animate-pulse">|</span>
            </span>
            {/* 우측: 장식용 아이콘 */}
            <div
                className={[
                "shrink-0 grid place-items-center rounded-full size-8",
                "bg-accent text-black",
                ].join(" ")}
            >
                {/* 종이비행기 아이콘 */}
                <svg
                viewBox="0 0 24 24"
                className="size-4 sm:size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
            </div>
        </div>
    );
}

export default LandingChatStartButton;