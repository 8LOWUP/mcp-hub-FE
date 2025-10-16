interface MCPCardSkeletonProps {
  variant?: 'active' | 'new-workspace';
}

export default function MCPCardSkeleton({ variant = 'active' }: MCPCardSkeletonProps) {
  return (
    <div className="flex items-center justify-between w-full py-2 px-1 rounded-lg">
      {/* 좌측: 이미지/아이콘 + 이름 */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          {/* 이미지 스켈레톤 */}
          <div className="w-9 h-9 rounded-md flex-shrink-0 bg-gray-300 animate-pulse" />
          
          {/* 텍스트 스켈레톤 */}
          <div className="flex flex-col w-31">
            <div className="h-3 w-20 mb-1 bg-gray-500 rounded animate-pulse" />
            <div className="h-3 w-16 bg-gray-500 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* 우측: 토글 버튼 또는 선택 버튼 */}
      {variant === 'active' ? (
        <div className="w-10 h-5 rounded-full bg-gray-400 animate-pulse" />
      ) : (
        <div className="h-8 w-12 rounded bg-gray-400 animate-pulse" />
      )}
    </div>
  );
}
