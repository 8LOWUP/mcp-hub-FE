import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import imageLoader from "@/lib/imageLoader";
import {useLocale} from "next-intl";

interface MCPCardProps {
    id: string;
    title: string;
    description: string;
    iconSrc?: string; // mcp로고 이미지 경로 (기본값: /default-mcp-logo.svg)
    saved?: boolean;
    usersCount?: number;
    developerName?: string;
    className?: string;
}

const MCPCard: React.FC<MCPCardProps> = ({
    id,
    title,
    description,
    iconSrc = "/default-mcp-logo.svg", // 기본 아이콘을 default-mcp-logo.svg로 설정
    saved = false,
    usersCount,
    developerName,
    className,
}) => {
    const [imageError, setImageError] = useState(false);
    
    const buildImageUrl = (path?: string | null) => {
        if (!path || path.trim() === "") return "/placeholder.png";

        // https://img.com으로 시작하는 경우 API URL로 변환
        if (path.startsWith('https://img.com')) {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8080';
            const cleanApiUrl = apiUrl.replace(/\/+$/, '');
            return path.replace('https://img.com', `${cleanApiUrl}/img.com`);
        }

        // 절대 URL은 그대로 반환
        if (/^https?:\/\//i.test(path)) return path;

        // 중복 슬래시 방지
        if (path.startsWith("/")) {
            return `/__api${path}`;
        } else {
            return `/__api/${path}`;
        }
    };

    const safeIconSrc = buildImageUrl(iconSrc);

    const locale = useLocale();

    return (

        <Link
            href={`/${locale}/detail/${id}`}
            className={clsx(
                "flex flex-col p-4 justify-between justify-items-center items-center w-full h-[165px] rounded-md",
                "border border-white/20 bg-surface-1",
                "transition-all duration-400 ease-in-out",
                "hover:border-accent",
                "active:scale-[0.96] active:bg-surface-2",
                className
            )}

        >
            

            {/* 본문 */}
            <div className="flex flex-col w-full flex-1">
                <div className="flex w-full items-start gap-3 mb-2">
                    <div className="flex-shrink-0">
                        {!imageError ? (
                            <Image
                                src={safeIconSrc}
                                alt={`${title} MCP Logo`}
                                width={40}
                                height={40}
                                className="w-10 h-10"
                                onError={() => setImageError(true)}
                                loader={imageLoader}
                                unoptimized
                            />
                        ) : (
                            <div className="w-10 h-10 flex items-center justify-center bg-surface-2 rounded text-xs text-secondary font-bold">
                                {title.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-primary text-base font-bold truncate">{title}</div>
                        {developerName && (
                            <div className="text-xs text-secondary truncate">by {developerName}</div>
                        )}
                    </div>
                </div>
                <div className="text-secondary text-sm line-clamp-2 leading-relaxed mt-2">{description}</div>
            </div>

            {/* 하단 라벨 */}
            <div className="flex w-full justify-between items-center mt-auto">
                <div className="flex gap-2">
                    <span
                        className={clsx(
                            "text-xs px-2 py-1 font-medium rounded-full",
                            saved ? "bg-accent/20 text-accent" : "bg-surface-2 text-secondary"
                        )}
                    >
                        {saved ? "Saved" : "Save"}
                    </span>
                </div>

                {usersCount !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-secondary">
                        <Image
                            src="/downLoader.svg"
                            alt="downloads"
                            width={14}
                            height={14}
                            className="w-3.5 h-3.5 opacity-70"
                            loader={imageLoader}
                            unoptimized
                        />
                        <span className="font-medium">{usersCount}</span>
                    </div>
                )}
            </div>
        </Link>
    );
};

export default MCPCard;

