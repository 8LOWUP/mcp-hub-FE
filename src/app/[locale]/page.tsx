import { getTranslations } from 'next-intl/server';
import "../globals.css"
import LandingChatStartButton from '@/features/landing/components/LandingChatStartButton';
import LandingMarketGrid from '@/features/landing/components/LandingMarketGrid';
import AnimatedGradient from '@/components/animations/AnimatedGradient';
import FadeInOnScroll from '@/components/animations/FadeInOnScroll';
import { CategoryId } from '@/features/market/constants';
import type { McpCardData } from '@/features/market/types';
import { getLandingMCPData } from '@/services/landing/apis';
import type { getLandingMCPDataRequestBody, MCPItem } from '@/types/landing/landingMCPDataType';
import { DUMMY_MCP_LIST } from '@/constants/mcp-data';

export const revalidate = 60; // ISR: 60초 간 재검증

// 카테고리 매핑 객체를 상수로 분리
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
    id: item.id.toString(), // number를 string으로 변환
    title: item.name,
    description: item.description,
    iconSrc: item.imageUrl && item.imageUrl.trim() !== "" ? item.imageUrl : "/default-mcp-logo.svg",
    saved: false, // 기본값
    usersCount: item.savedUserCount,
    category: category,
    developerName: item.developerName,
  };
}

// 5개 카테고리별 데이터를 받아오는 함수들 (백엔드 실패 또는 데이터 없을 시 더미 데이터 사용)
async function fetchWebSearchData(): Promise<McpCardData[]> {
  try {
    const requestData: getLandingMCPDataRequestBody = {
      page: 0,
      size: 10,
      sort: "popular",
      category: CATEGORY_MAPPING["web-search"],
      search: ""
    };
    const response = await getLandingMCPData(requestData);
    const apiData = response.result.content.map(item => convertMCPItemToMcpCardData(item, "web-search"));
    
    // API 데이터가 비어있으면 더미 데이터 사용
    if (apiData.length === 0) {
      console.warn('백엔드 API 성공했지만 데이터가 비어있음, 더미 데이터 사용');
      return DUMMY_MCP_LIST.filter(item => item.category === "web-search");
    }
    
    return apiData;
  } catch (error) {
    console.warn('백엔드 서버 연결 실패, 더미 데이터 사용:', error);
    // 백엔드 실패 시 더미 데이터 사용
    return DUMMY_MCP_LIST.filter(item => item.category === "web-search");
  }
}

async function fetchMemoryData(): Promise<McpCardData[]> {
  try {
    const requestData: getLandingMCPDataRequestBody = {
      page: 0,
      size: 10,
      sort: "popular",
      category: CATEGORY_MAPPING["memory"],
      search: ""
    };
    const response = await getLandingMCPData(requestData);
    const apiData = response.result.content.map(item => convertMCPItemToMcpCardData(item, "memory"));
    
    // API 데이터가 비어있으면 더미 데이터 사용
    if (apiData.length === 0) {
      console.warn('백엔드 API 성공했지만 데이터가 비어있음, 더미 데이터 사용');
      return DUMMY_MCP_LIST.filter(item => item.category === "memory");
    }
    
    return apiData;
  } catch (error) {
    console.warn('백엔드 서버 연결 실패, 더미 데이터 사용:', error);
    return DUMMY_MCP_LIST.filter(item => item.category === "memory");
  }
}

async function fetchBrowserData(): Promise<McpCardData[]> {
  try {
    const requestData: getLandingMCPDataRequestBody = {
      page: 0,
      size: 10,
      sort: "popular",
      category: CATEGORY_MAPPING["browser"],
      search: ""
    };
    const response = await getLandingMCPData(requestData);
    const apiData = response.result.content.map(item => convertMCPItemToMcpCardData(item, "browser"));
    
    // API 데이터가 비어있으면 더미 데이터 사용
    if (apiData.length === 0) {
      console.warn('백엔드 API 성공했지만 데이터가 비어있음, 더미 데이터 사용');
      return DUMMY_MCP_LIST.filter(item => item.category === "browser");
    }
    
    return apiData;
  } catch (error) {
    console.warn('백엔드 서버 연결 실패, 더미 데이터 사용:', error);
    return DUMMY_MCP_LIST.filter(item => item.category === "browser");
  }
}

async function fetchLanguageData(): Promise<McpCardData[]> {
  try {
    const requestData: getLandingMCPDataRequestBody = {
      page: 0,
      size: 10,
      sort: "popular",
      category: CATEGORY_MAPPING["language"],
      search: ""
    };
    const response = await getLandingMCPData(requestData);
    const apiData = response.result.content.map(item => convertMCPItemToMcpCardData(item, "language"));
    
    // API 데이터가 비어있으면 더미 데이터 사용
    if (apiData.length === 0) {
      console.warn('백엔드 API 성공했지만 데이터가 비어있음, 더미 데이터 사용');
      return DUMMY_MCP_LIST.filter(item => item.category === "language");
    }
    
    return apiData;
  } catch (error) {
    console.warn('백엔드 서버 연결 실패, 더미 데이터 사용:', error);
    return DUMMY_MCP_LIST.filter(item => item.category === "language");
  }
}

async function fetchEtcData(): Promise<McpCardData[]> {
  try {
    const requestData: getLandingMCPDataRequestBody = {
      page: 0,
      size: 10,
      sort: "popular",
      category: CATEGORY_MAPPING["etc"],
      search: ""
    };
    const response = await getLandingMCPData(requestData);
    const apiData = response.result.content.map(item => convertMCPItemToMcpCardData(item, "etc"));
    
    // API 데이터가 비어있으면 더미 데이터 사용
    if (apiData.length === 0) {
      console.warn('백엔드 API 성공했지만 데이터가 비어있음, 더미 데이터 사용');
      return DUMMY_MCP_LIST.filter(item => item.category === "etc");
    }
    
    return apiData;
  } catch (error) {
    console.warn('백엔드 서버 연결 실패, 더미 데이터 사용:', error);
    return DUMMY_MCP_LIST.filter(item => item.category === "etc");
  }
}

export default async function LandingPage() {
  const t = await getTranslations('LandingPage');

  // 5개 카테고리별 데이터를 병렬로 받아오기
  const [
    webSearchData,
    memoryData,
    browserData,
    languageData,
    etcData
  ] = await Promise.all([
    fetchWebSearchData(),
    fetchMemoryData(),
    fetchBrowserData(),
    fetchLanguageData(),
    fetchEtcData()
  ]);

  return (
    <AnimatedGradient>
      <div className='flex-1 min-h-screen pt-20'>
        <div className="mt-6 flex flex-col justify-center items-center max-w-7xl mx-auto px-10">
              <h1 className='font-bold text-4xl pt-10 pb-2'>{t('title')}</h1>
              <p className='text-secondary mb-5'>{t('about')}</p>
              <LandingChatStartButton />


            {/* 카테고리별 MCP 섹션들 */}
            <div className="w-full space-y-6 my-12">
              {/* Web Search 카테고리 */}
              <FadeInOnScroll delay={200}>
                <LandingMarketGrid 
                  key="web-search"
                  category="web-search"
                  items={webSearchData}
                />
              </FadeInOnScroll>

              {/* Memory 카테고리 */}
              <FadeInOnScroll delay={400}>
                <LandingMarketGrid 
                  key="memory"
                  category="memory"
                  items={memoryData}
                />
              </FadeInOnScroll>

              {/* Browser 카테고리 */}
              <FadeInOnScroll delay={600}>
                <LandingMarketGrid 
                  key="browser"
                  category="browser"
                  items={browserData}
                />
              </FadeInOnScroll>

              {/* Language 카테고리 */}
              <FadeInOnScroll delay={200}>
                <LandingMarketGrid 
                  key="language"
                  category="language"
                  items={languageData}
                />
              </FadeInOnScroll>

              {/* Etc 카테고리 */}
              <FadeInOnScroll delay={200}>
                <LandingMarketGrid 
                  key="etc"
                  category="etc"
                  items={etcData}
                />
              </FadeInOnScroll>
            </div>
        </div>
      </div>
    </AnimatedGradient>
  );
}

