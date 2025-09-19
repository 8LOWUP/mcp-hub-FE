"use client";

type HistoryCardProps = {
  title: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  onMenuClick?: () => void;
};

export default function HistoryCard({
  title,
  description,
  selected = false,
  onClick,
  onMenuClick,
}: HistoryCardProps) {
  return (
    <div className="relative w-full my-2">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        className={[
          "block w-full text-left transition-colors",
          selected
            ? "bg-surface-2"
            : "bg-surface-1 hover:bg-surface-2",
          "border border-white/[0.12]",
          "rounded-lg p-5",
          "text-foreground",
        ].join(" ")}
      >
        <h3 className="text-sm font-bold">{title}</h3>
        {description && (
          <p className="mt-2 text-xs text-foreground/60 truncate">
            {description}
          </p>
        )}
      </button>

      {/* 옵션 버튼 (세로 점 3개) */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="히스토리 카드 메뉴 열기"
        className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full"
      >
        <span className="flex flex-col gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
        </span>
      </button>
    </div>
  );
}