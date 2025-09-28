// chat/components/ActiveMCPCard.tsx
"use client";

import { TbCloudCheck, TbCloudX } from "react-icons/tb";

type ActiveMCPCardProps = {
  id: string;
  name: string;
  active?: boolean;         // 토글 상태
  selected?: boolean;       // 선택 상태
  onSelect?: (id: string) => void;
  onToggle?: (active: boolean) => void;
};

export default function ActiveMCPCard({
  name,
  active = false,
  onToggle,
}: ActiveMCPCardProps) {
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();                // 카드 클릭으로 전파 방지
    onToggle?.(e.target.checked);
  };

  return (
    <div
      className={[
        "flex items-center justify-between w-full px-3 py-2",
        "transition-colors",
      ].join(" ")}
    >
      {/* 좌측: 아이콘 + 이름 */}
      <div className="flex text-2xl justify-center items-end gap-2">
        {active ? <TbCloudCheck className="text-accent"/> : <TbCloudX className="text-secondary"/> }
        <h3 className="text-sm text-foreground">{name}</h3>
      </div>

      {/* 우측: 토글 버튼 */}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={active}
          onChange={handleToggle}
        />
        <div className="w-10 h-5 bg-gray-600 rounded-full peer peer-checked:bg-yellow-400 transition-colors"></div>
        <div
          className={[
            "absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
            active ? "translate-x-5" : "translate-x-0",
          ].join(" ")}
        ></div>
      </label>
    </div>
  );
}