import {useTranslations} from 'next-intl';
import "../globals.css"
import LandingChatStartButton from '@/features/landing/components/LandingChatStartButton';
import LandingMarketGrid from '@/features/landing/components/LandingMarketGrid';
import { DUMMY_MCP_LIST } from '@/constants/mcp-data';
import { CATEGORY_PRESET, CategoryId } from '@/features/market/constants';

export default function LandingPage() {
  const t = useTranslations('LandingPage');
  
  // 카테고리별로 데이터 필터링
  const getItemsByCategory = (category: CategoryId) => {
    if (category === "all") return DUMMY_MCP_LIST;
    return DUMMY_MCP_LIST.filter(item => item.category === category);
  };

  // 표시할 카테고리들 (all 제외)
  const displayCategories: CategoryId[] = ["memory", "web-search", "browser", "language", "etc"];

  return (
    <div className='flex-1 min-h-screen bg-surface-1 pt-20'>
      <div className="mt-6 flex flex-col justify-center items-center max-w-7xl mx-auto px-4">
          <h1 className='text-4xl py-10'>MCP HUB</h1>
          <LandingChatStartButton />
          
          {/* 카테고리별 MCP 섹션들 */}
          <div className="w-full space-y-12 my-12">
            {displayCategories.map((category) => {
              const categoryItems = getItemsByCategory(category);
              if (categoryItems.length === 0) return null;
              
              return (
                <LandingMarketGrid 
                  key={category}
                  category={category} 
                  items={categoryItems} 
                />
              );
            })}
          </div>
      </div>
    </div>
  );
}

