// chat/components/NewWorkspaceMCPCard.tsx
"use client";

import PrimaryButton from "@/components/ui/PrimaryButton";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";

type NewWorkspaceMCPCardProps = {
  id: string;
  name: string;
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
  const handleClick = () => onSelect?.(!selected);
  const buttonClass = [
    "h-8 py-0 px-3 text-sm transition-colors",
    selected
      ? "bg-accent text-black hover:bg-surface-3"
      : "bg-surface-4 text-white hover:bg-accent/90",
  ].join(" ");

  return (
    <div
      className={[
        "flex items-center justify-between w-full px-3 py-2 rounded-lg",
        isLoading ? "opacity-50 pointer-events-none" : "",
      ].join(" ")}
    >
      {/* 좌측: 이름 */}
      <div className="flex items-center gap-2">
        <div
          className={[
            "transform transition-all duration-300 ease-out",
            selected ? "opacity-100 scale-110" : "opacity-70 scale-100",
          ].join(" ")}
        >
            {selected ? (
              <MdCheckCircle className="text-accent w-4 h-4" />
            ) : (
              <MdRadioButtonUnchecked className="text-foreground/50 w-4 h-4" />
            )}
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-foreground">{name}</h3>
          <p className={[
            "text-xs transition-colors duration-300",
            selected ? "text-accent" : "text-secondary",
          ].join(" ")}>
            {selected ? "선택됨" : "미선택"}
          </p>
        </div>
      </div>

      {/* 우측: 사용하기 / 해제 버튼 */}
      <div onClick={(e) => e.stopPropagation()}>
        <PrimaryButton additionalClassName={buttonClass} variant={"custom"} onClick={handleClick}>
          {selected ? "해제" : "사용"}
        </PrimaryButton>
      </div>
    </div>
  );
}


