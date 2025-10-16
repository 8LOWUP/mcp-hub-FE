"use client";

import React from "react";
import Image from "next/image";
import imageLoader from "@/lib/imageLoader";

type SearchResultItemProps = {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string | null;
    onClick: (id: number) => void;
};

const SearchResultItem: React.FC<SearchResultItemProps> = ({
    id,
    name,
    description,
    imageUrl,
    onClick,
}) => {
    const [imageError, setImageError] = React.useState(false);

    return (
        <li key={id}>
            <button
                type="button"
                className="flex items-center gap-3 w-full text-left px-3 py-2 hover:bg-surface-2 cursor-pointer"
                onClick={() => onClick(id)}
            >
                {/* MCP 썸네일 */}
                <div className="flex items-center justify-center w-8 h-8 rounded-md overflow-hidden bg-surface-3 border border-accent/10 shrink-0">
                    {!imageError ? (
                        <Image
                            src={imageUrl || "/placeholder.png"}
                            alt={`${name} MCP Logo`}
                            width={35}
                            height={35}
                            className="w-11 h-11 ml-1 flex-shrink-0"
                            onError={() => setImageError(true)}
                            loader={imageLoader}
                            unoptimized
                        />
                    ) : (
                        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-surface-2 rounded text-xs text-secondary font-bold">
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* 텍스트 */}
                <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                        {name}
                    </p>
                    {description && (
                        <p className="text-xs text-muted truncate">
                            {description}
                        </p>
                    )}
                </div>
            </button>
        </li>
    );
};

export default SearchResultItem;
