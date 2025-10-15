import { getTranslations } from 'next-intl/server';
import { getLandingMCPData } from '@/services/landing/apis';
import type { getLandingMCPDataRequestBody, MCPItem } from '@/types/landing/landingMCPDataType';
import { DUMMY_MCP_LIST } from '@/constants/mcp-data';
import type { McpCardData } from '@/features/market/types';
import { CategoryId } from '@/features/market/constants';
import MarketPage from "@/features/market/components/page/MarketPage";

export const revalidate = 60; // ISR: 60초 간 재검증

// Market 페이지 전용 메타데이터
export const metadata = {
  title: "MCP Market | MCP HUB",
  description: "다양한 MCP(Model Context Protocol) 도구들을 발견하고 사용해보세요. 웹 검색, 메모리, 브라우저, 언어 처리 등 카테고리별로 정리된 MCP 컬렉션을 제공합니다.",
  keywords: "MCP, Model Context Protocol, AI tools, 웹 검색, 메모리, 브라우저, 언어 처리, AI 도구",
  openGraph: {
    title: "MCP Market | MCP HUB",
    description: "다양한 MCP(Model Context Protocol) 도구들을 발견하고 사용해보세요.",
    type: "website",
  },
};

// 카테고리 매핑 객체
const CATEGORY_MAPPING = {
  "web-search": 1,
  "memory": 2,
  "browser": 3,
  "language": 4,
  "etc": 5,
} as const;

// MCPItem을 McpCardData로 변환하는 헬퍼 함수
function convertMCPItemToMcpCardData(item: MCPItem, category: CategoryId): McpCardData {
  return {
    id: item.id.toString(),
    title: item.name,
    description: item.description,
    iconSrc: item.imageUrl && item.imageUrl.trim() !== "" ? item.imageUrl : "/default-mcp-logo.svg",
    saved: false,
    usersCount: item.savedUserCount,
    category: category,
    developerName: item.developerName,
  };
}

// 모든 카테고리의 MCP 데이터를 가져오는 함수
async function fetchAllMCPData(): Promise<McpCardData[]> {
  try {
    // 모든 카테고리의 데이터를 병렬로 가져오기
    const allCategories = Object.entries(CATEGORY_MAPPING) as [CategoryId, number][];
    
    const categoryPromises = allCategories.map(async ([categoryKey, categoryId]) => {
      try {
        const requestData: getLandingMCPDataRequestBody = {
          page: 0,
          size: 50, // 더 많은 데이터 가져오기
          sort: "popular",
          category: categoryId,
          search: ""
        };
        const response = await getLandingMCPData(requestData);
        return response.result.content.map(item => convertMCPItemToMcpCardData(item, categoryKey));
      } catch (error) {
        console.warn(`카테고리 ${categoryKey} 데이터 가져오기 실패, 더미 데이터 사용:`, error);
        return DUMMY_MCP_LIST.filter(item => item.category === categoryKey);
      }
    });

    const categoryResults = await Promise.all(categoryPromises);
    
    // 모든 카테고리 데이터를 하나의 배열로 합치기
    const allData = categoryResults.flat();
    
    // API 데이터가 비어있으면 더미 데이터 사용
    if (allData.length === 0) {
      console.warn('모든 카테고리에서 API 데이터가 비어있음, 더미 데이터 사용');
      return DUMMY_MCP_LIST;
    }
    
    return allData;
  } catch (error) {
    console.warn('MCP 데이터 가져오기 실패, 더미 데이터 사용:', error);
    return DUMMY_MCP_LIST;
  }
}

export default async function Page() {
    const t = await getTranslations('MCPMarket');
    
    // MCP 데이터를 서버에서 미리 가져오기 (SEO 최적화)
    const mcpData = await fetchAllMCPData();

    return <MarketPage initialData={mcpData} />;
}
