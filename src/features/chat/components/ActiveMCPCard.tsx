// chat/components/ActiveMCPCard.tsx
"use client";

import { TbCloudCheck, TbCloudX } from "react-icons/tb";

type ActiveMCPCardProps = {
  id: string;
  name: string;
  active?: boolean;         // 토글 상태
  isLoading?: boolean;      // 로딩 상태
  onToggle?: (active: boolean) => void;
  detailText?: string;      // 추가 정보 (워크스페이스/MC P정보 등)
};

export default function ActiveMCPCard({
  id,
  name,
  active = false,
  isLoading = false,
  onToggle,
  detailText,
}: ActiveMCPCardProps) {
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle?.(e.target.checked);
  };

  return (
    <div
      className={[
        "flex items-center justify-between w-full px-3 py-2 rounded-lg",
        isLoading ? "opacity-50 pointer-events-none" : ""
      ].join(" ")}
    >
      {/* 좌측: 아이콘 + 이름 */}
      <div className="flex items-center gap-2">
        {active ? (
          <TbCloudCheck className="text-accent text-lg" />
        ) : (
          <TbCloudX className="text-secondary text-lg" />
        )}
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-foreground">{name}</h3>
          {detailText && (
            <p className="text-xs text-foreground/70">{detailText}</p>
          )}
          <p className="text-xs text-foreground/60">
            {active ? "활성화됨" : "비활성화됨"}
          </p>
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
          disabled={isLoading}
        />
        <div className={[
          "w-10 h-5 rounded-full transition-all duration-300 ease-in-out",
          active ? "bg-accent shadow-lg shadow-accent/25" : "bg-gray-600",
          isLoading ? "opacity-50" : ""
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