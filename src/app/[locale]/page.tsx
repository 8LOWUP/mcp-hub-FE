import { getTranslations } from 'next-intl/server';
import "../globals.css"
import LandingChatStartButton from '@/features/landing/components/LandingChatStartButton';
import LandingMarketGrid from '@/features/landing/components/LandingMarketGrid';
import { CategoryId } from '@/features/market/constants';
import type { McpCardData } from '@/features/market/types';
import { API_ENDPOINTS, API_BASE_URL } from '@/constants/apis/key';

export const revalidate = 60; // ISR: 60초 간 재검증

async function fetchCategoryItems(category: CategoryId, limit: number = 10): Promise<McpCardData[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || API_BASE_URL;
  const url = new URL(`${baseUrl}${API_ENDPOINTS.MCP.LIST}`);
  url.searchParams.set('category', category);
  url.searchParams.set('limit', String(limit));

  try {
    const res = await fetch(url.toString(), { next: { revalidate } });
    if (!res.ok) return [];
    const data = await res.json();
    const items = (data?.result ?? []) as Array<any>;
    return items.map((item: any) => ({
      id: String(item.id ?? item.mcpId ?? ''),
      title: item.name ?? item.title ?? 'Untitled',
      description: item.description ?? '',
      iconSrc: item.imageUrl ?? '/mcpLogo.svg',
      usersCount: item.savedUserCount ?? 0,
      saved: Boolean(item.saved),
      // API 카테고리명과 무관하게, 섹션 기준으로 설정
      category,
    })) as McpCardData[];
  } catch {
    return [];
  }
}

export default async function LandingPage() {
  const t = await getTranslations('LandingPage');

  // 표시할 카테고리들 (all 제외)
  const displayCategories: CategoryId[] = ["memory", "web-search", "browser", "language", "etc"];

  const categoryItemsList = await Promise.all(
    displayCategories.map((cat) => fetchCategoryItems(cat))
  );

  return (
    <div className='flex-1 min-h-screen bg-surface-1 pt-20'>
      <div className="mt-6 flex flex-col justify-center items-center max-w-7xl mx-auto px-4">
          <h1 className='text-4xl py-10'>MCP HUB</h1>
          <LandingChatStartButton />

          {/* 카테고리별 MCP 섹션들 */}
          <div className="w-full space-y-12 my-12">
            {displayCategories.map((category, idx) => {
              const items = categoryItemsList[idx] ?? [];
              if (!items.length) return null;

              return (
                <LandingMarketGrid 
                  key={category}
                  category={category}
                  items={items}
                />
              );
            })}
          </div>
      </div>
    </div>
  );
}

