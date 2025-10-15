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

    console.log("iconSrc", iconSrc);
    
    const locale = useLocale();

    return (

        <Link
            href={`/${locale}/detail/${id}`}
            className={clsx(
                "flex flex-col p-3 py-3.5 justify-between justify-items-center items-center w-[300px] h-[165px] rounded-md",
                "border border-white/20 bg-surface-1",
                "transition-all duration-400 ease-in-out",
                "hover:border-accent",
                "active:scale-[0.96] active:bg-surface-2",
                className
            )}

        >
            

            {/* 본문 */}
            <div className="flex flex-col w-full">
                <div className="flex w-full h-full justify-between items-start gap-3 flex-1">
                    <div className="flex h-full items-center justify-center">
                            <Image
                                src={iconSrc}
                                alt={`${title} MCP Logo`}
                                width={35}
                                height={35}
                                className="w-11 h-11 ml-1 flex-shrink-0"
                                onError={() => setImageError(true)}
                                loader={imageLoader}
                                unoptimized
                            />
                    </div>
                    <div className="flex w-4/5 flex-col justify-start flex-1">
                        <div className="text-primary text-[18px] font-extrabold truncate mt-1">{title}</div>
                        {developerName && (
                            <div className="text-sm text-secondary">by {developerName}</div>
                        )}
                    </div>
                </div>
                <div className="text-secondary text-sm line-clamp-2 my-2 m-1 overflow-hidden">{description}</div>
            </div>

            {/* 상단 라벨 */}
            <div className="flex w-full justify-between items-center">
                <div className="flex gap-2">
                    {/* saved 상태에 따라 하나만 렌더링 */}
                    <span
                        className={clsx(
                            "text-xs px-2 py-1 font-semibold text-secondary rounded-lg",
                            saved ? "bg-surface-2  text-accent" : "bg-surface-2 text-disabled"
                        )}
                    >{saved ? "Saved" : "Unsaved"}</span>
                </div>

                {usersCount !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-secondary">
                        <Image
                            src="/downLoader.svg"
                            alt="downloads"
                            width={16}
                            height={16}
                            className="w-4 h-4 opacity-80"
                            loader={imageLoader}
                            unoptimized
                        />
                        {usersCount}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default MCPCard;

