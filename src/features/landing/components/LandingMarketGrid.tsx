"use client";

import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import MCPCard from "@/components/container/McpCard";
import { McpCardData } from "@/features/market/types";
import { CATEGORY_PRESET, CategoryId } from "@/features/market/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 기본 MCP 카드 데이터 생성 함수
const createDefaultMCPCards = (category: CategoryId, t: any): McpCardData[] => {
  const categoryLabels = {
    "all": "All",
    "web-search": "Web Search",
    "memory": "Memory", 
    "browser": "Browser",
    "language": "Language",
    "etc": "Etc"
  };

  const defaultCards: McpCardData[] = [
    {
      id: `${category}-default-1`,
      title: `${categoryLabels[category]} MCP 1`,
      description: `A sample ${categoryLabels[category].toLowerCase()} MCP for demonstration.`,
      iconSrc: "/default-mcp-logo.svg",
      saved: false,
      usersCount: 0,
      category: category,
      developerName: "Sample Developer",
    },
    {
      id: `${category}-default-2`,
      title: `${categoryLabels[category]} MCP 2`, 
      description: `Another ${categoryLabels[category].toLowerCase()} MCP example.`,
      iconSrc: "/default-mcp-logo.svg",
      saved: false,
      usersCount: 0,
      category: category,
      developerName: "Demo Creator",
    },
    {
      id: `${category}-default-3`,
      title: `${categoryLabels[category]} MCP 3`,
      description: `Third ${categoryLabels[category].toLowerCase()} MCP for testing.`,
      iconSrc: "/default-mcp-logo.svg",
      saved: false,
      usersCount: 0,
      category: category,
      developerName: "Test Author",
    }
  ];
  
  return defaultCards;
};

interface LandingMarketGridProps {
  category: CategoryId;
  items: McpCardData[];
}

const LandingMarketGrid: React.FC<LandingMarketGridProps> = ({ category, items }) => {
  // Locale translations
  const t = useTranslations('MCPMarket');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // 카테고리 정보 가져오기
  const categoryInfo = CATEGORY_PRESET.find(cat => cat.id === category);
  const categoryLabel = categoryInfo?.label || "Unknown";

  // 스크롤 가능 여부 확인
  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // 스크롤 이벤트 리스너 등록
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollability();
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [items]);

  // 좌측 스크롤
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // 스크롤할 픽셀 수
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // 우측 스크롤
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // 스크롤할 픽셀 수
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // 데이터가 없으면 기본 카드 사용
  const displayItems = items?.length > 0 ? items : createDefaultMCPCards(category, t);

  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-primary">{categoryLabel}</h2>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`
              p-2 rounded-full transition-all duration-200
              ${canScrollLeft 
                ? 'bg-surface-2 hover:bg-surface-3 text-primary cursor-pointer' 
                : 'bg-surface-1 text-disabled cursor-not-allowed'
              }
            `}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`
              p-2 rounded-full transition-all duration-200
              ${canScrollRight 
                ? 'bg-surface-2 hover:bg-surface-3 text-primary cursor-pointer' 
                : 'bg-surface-1 text-disabled cursor-not-allowed'
              }
            `}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 스크롤 가능한 카드 컨테이너 */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {displayItems.map((item) => (
          <div key={item.id} className="flex-shrink-0">
            <MCPCard {...item} />
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default LandingMarketGrid;
