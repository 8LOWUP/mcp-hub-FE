// chat/components/ActiveMCPCard.tsx
"use client";

import { useMcpDetail } from "@/hooks/detail/useMcpDetail";
import imageLoader from "@/lib/imageLoader";
import Image from "next/image";
import { useState } from "react";
import { processMcpImageUrl, getFallbackIconProps } from "@/utils/imageUtils";
import { useTranslations } from "next-intl";

type ActiveMCPCardProps = {
  id: string;
  name?: string;            // 선택적 이름 (상세 정보에서 가져올 수 있음)
  active?: boolean;         // 토글 상태
  isLoading?: boolean;      // 로딩 상태
  onToggle?: (active: boolean) => void;
};

export default function ActiveMCPCard({
  id,
  name,
  active = false,
  isLoading = false,
  onToggle,
}: ActiveMCPCardProps) {
  // Locale translations
  const t = useTranslations('ChatPage');
  // MCP 상세 정보 가져오기
  const { data: mcpDetail, isLoading: isDetailLoading } = useMcpDetail(id);
  const [imageError, setImageError] = useState(false);
  
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle?.(e.target.checked);
  };

  // 표시할 이름과 이미지 결정
  const displayName = mcpDetail?.name || name || `MCP-${id}`;
  const rawImageUrl = mcpDetail?.imageUrl;
  const isDetailLoadingState = isDetailLoading || isLoading;
  
  // 이미지 URL 처리
  const imageUrl = processMcpImageUrl(rawImageUrl);

  return (
    <div
      className={[
        "flex items-center justify-between w-full py-2 px-1 rounded-lg",
        isDetailLoadingState ? "opacity-50 pointer-events-none" : ""
      ].join(" ")}
    >
        {/* 좌측: 아이콘/이미지 + 이름 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {!imageError && imageUrl ? (
              <Image
                src={imageUrl} 
                alt={displayName}
                width={36}
                height={36}
                className="w-9 h-9 object-cover rounded-md"
                loader={imageLoader}
                unoptimized
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={getFallbackIconProps(displayName, 'md').className}>
                {getFallbackIconProps(displayName, 'md').text}
              </div>
            )}
            <div className="flex flex-col w-31">
              <h3 className="text-xs font-medium text-foreground">{displayName}</h3>
              <p className={[
                "text-xs transition-colors duration-300",
                active ? "text-ActiveMCP-accent" : "text-secondary",
              ].join(" ")}>
                {active ? t('inUse') : t('notInUse')}
              </p>
            </div>
          </div>
        </div>

      {/* 우측: 토글 버튼 */}
      <label 
        className="relative inline-flex items-center cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          className="sr-only peer"
          checked={active}
          onChange={handleToggle}
          disabled={isDetailLoadingState}
        />
        <div className={[
          "w-10 h-5 rounded-full transition-all duration-300 ease-in-out",
          active ? "bg-accent shadow-lg shadow-accent/25" : "bg-gray-600",
          isDetailLoadingState ? "opacity-50" : ""
        ].join(" ")}></div>
        <div
          className={[
            "absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out",
            active ? "translate-x-5 shadow-accent/20" : "translate-x-0",
          ].join(" ")}
        ></div>
      </label>
    </div>
  );
}