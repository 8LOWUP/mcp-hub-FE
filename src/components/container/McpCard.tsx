import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

interface MCPCardProps {
    id: string;
    title: string;
    description: string;
    iconSrc?: string; // mcp로고 이미지 경로 (기본값: /mcpLogo.svg)
    saved?: boolean;
    usersCount?: number;
    className?: string;
}

const MCPCard: React.FC<MCPCardProps> = ({
                                             id,
                                             title,
                                             description,
                                             iconSrc = "/mcpLogo.svg", // 기본 아이콘을 mcpLogo.svg로 설정
                                             saved = false,
                                             usersCount,
                                             className,
                                         }) => {
    return (

        <Link
            href={`/mcp/${id}`}
            className={clsx(
                "flex flex-col p-6 justify-items-center items-center w-full max-w-sm bg-surface-1 rounded-md",
                className
            )}
        >
            {/* 상단 라벨 */}
            <div className="flex w-full justify-between items-center mb-3">
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
                        />
                        {usersCount}
                    </div>
                )}
            </div>

            {/* 본문 */}
            <div className="flex w-full justify-between items-center">
                <Image src={iconSrc} alt={title} width={35} height={35} className="w-13 h-13 ml-0.5"/>
                <div className="flex w-4/5 flex-col">
                    <span className="text-primary">{title}</span>
                    <span className="text-secondary text-sm">{description}</span>
                </div>
            </div>
        </Link>
    );
};

export default MCPCard;

