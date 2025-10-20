// chat/components/NewWorkspaceMCPCard.tsx
"use client";

import PrimaryButton from "@/components/ui/PrimaryButton";
import { useMcpDetail } from "@/hooks/detail/useMcpDetail";
import imageLoader from "@/lib/imageLoader";
import Image from "next/image";
import { useState } from "react";
import { processMcpImageUrl, getFallbackIconProps } from "@/utils/imageUtils";
import { useTranslations } from "next-intl";

type NewWorkspaceMCPCardProps = {
  id: string;
  name?: string;            // 선택적 이름 (상세 정보에서 가져올 수 있음)
  selected?: boolean;
  isLoading?: boolean;
  onSelect?: (selected: boolean) => void;
};

export default function NewWorkspaceMCPCard({
  id,
  name,
  selected = false,
  isLoading = false,
  onSelect,
}: NewWorkspaceMCPCardProps) {
  // Locale translations
  const t = useTranslations('ChatPage');
  // MCP 상세 정보 가져오기
  const { data: mcpDetail, isLoading: isDetailLoading } = useMcpDetail(id);
  const [imageError, setImageError] = useState(false);
  
  const handleClick = () => onSelect?.(!selected);

  // 표시할 이름과 이미지 결정
  const displayName = mcpDetail?.name || name || `MCP-${id}`;
  const rawImageUrl = mcpDetail?.imageUrl;
  const isDetailLoadingState = isDetailLoading || isLoading;
  
  // 이미지 URL 처리
  const imageUrl = processMcpImageUrl(rawImageUrl);
  const buttonClass = [
    "h-8 py-0 px-3 text-sm transition-colors",
    selected
      ? "bg-accent text-black hover:bg-accent/90"
      : "bg-surface-4 text-white hover:bg-accent/90",
  ].join(" ");

  return (
    <div
      className={[
        "flex items-center justify-between w-full px-1 py-2 rounded-lg",
        isDetailLoadingState ? "opacity-50 pointer-events-none" : "",
      ].join(" ")}
    >
      {/* 좌측: 이미지/아이콘 + 이름 */}
      <div className="flex items-center gap-2">
        {!imageError && imageUrl ? (
          <div className="w-9 h-9 rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={imageUrl}
              alt={displayName}
              width={36}
              height={36}
              className="w-full h-full object-cover"
              loader={imageLoader}
              unoptimized
              onError={() => setImageError(true)}
            />
          </div>
          ) : (
            <div className={getFallbackIconProps(displayName, 'md').className}>
              {getFallbackIconProps(displayName, 'md').text}
            </div>
          )}
        <div className="flex flex-col">
          <h3 className="text-xs font-medium text-foreground">{displayName}</h3>
          <p className={[
            "text-xs transition-colors duration-300",
            selected ? "text-ActiveMCP-accent" : "text-secondary",
          ].join(" ")}>
            {selected ? t('selected') : t('notSelected')}
          </p>
        </div>
      </div>

      {/* 우측: 사용하기 / 해제 버튼 */}
      <div onClick={(e) => e.stopPropagation()}>
        <PrimaryButton additionalClassName={buttonClass} variant={"custom"} onClick={handleClick}>
          {selected ? t('remove') : t('use')}
        </PrimaryButton>
      </div>
    </div>
  );
}


