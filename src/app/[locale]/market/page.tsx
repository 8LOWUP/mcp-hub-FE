import { getLandingMCPData } from "@/services/landing/apis";
import type { getLandingMCPDataRequestBody, MCPItem } from "@/types/landing/landingMCPDataType";
import { DUMMY_MCP_LIST } from "@/constants/mcp-data";
import type { McpCardData } from "@/features/market/types";
import { CategoryId } from "@/features/market/constants";
import MarketPage from "@/features/market/components/page/MarketPage";

export const revalidate = 60;

export const metadata = {
  title: "MCP Market | MCP HUB",
  description:
      "다양한 MCP(Model Context Protocol) 도구들을 발견하고 사용해보세요. 웹 검색, 메모리, 브라우저, 언어 처리 등 카테고리별로 정리된 MCP 컬렉션을 제공합니다.",
  keywords: "MCP, Model Context Protocol, AI tools, 웹 검색, 메모리, 브라우저, 언어 처리, AI 도구",
  openGraph: {
    title: "MCP Market | MCP HUB",
    description: "다양한 MCP(Model Context Protocol) 도구들을 발견하고 사용해보세요.",
    type: "website",
  },
};

// 카테고리 매핑
const CATEGORY_MAPPING = {
  "web-search": 1,
  memory: 2,
  browser: 3,
  language: 4,
  etc: 5,
} as const;

/* MCPItem → McpCardData 변환 */
function convertMCPItemToMcpCardData(item: MCPItem, category: CategoryId): McpCardData {
  return {
    id: item.id.toString(),
    title: item.name,
    description: item.description,
    iconSrc: item.imageUrl && item.imageUrl.trim() !== "" ? item.imageUrl : "/default-mcp-logo.svg",
    saved: false,
    usersCount: item.savedUserCount,
    category,
    developerName: item.developerName,
  };
}

/* 중복 제거(같은 id) */
function dedupeById(list: McpCardData[]): McpCardData[] {
  const map = new Map<string, McpCardData>();
  for (const it of list) {
    if (!map.has(it.id)) map.set(it.id, it);
  }
  return Array.from(map.values());
}

/* 모든 카테고리의 MCP 데이터(검색어 포함) 가져오기 */
async function fetchAllMCPData(search: string): Promise<McpCardData[]> {
  try {
    const allCategories = Object.entries(CATEGORY_MAPPING) as [CategoryId, number][];

    const categoryPromises = allCategories.map(async ([categoryKey, categoryId]) => {
      try {
        const requestData: getLandingMCPDataRequestBody = {
          page: 0,
          size: 50,               // 자동완성/검색 결과 충분히 담도록
          sort: search ? "createdAt,desc" : "popular",
          category: categoryId,
          search: search ?? "",   // ✅ 검색어 반영
        };
        const response = await getLandingMCPData(requestData);
        return response.result.content.map((item) =>
            convertMCPItemToMcpCardData(item, categoryKey)
        );
      } catch (error) {
        console.warn(`카테고리 ${categoryKey} API 실패 → 더미 사용:`, error);
        // 검색어가 있는 경우 더미에도 필터 적용
        const base = DUMMY_MCP_LIST.filter((d) => d.category === categoryKey);
        return search
            ? base.filter(
                (d) =>
                    d.title.toLowerCase().includes(search.toLowerCase()) ||
                    d.description?.toLowerCase().includes(search.toLowerCase())
            )
            : base;
      }
    });

    const categoryResults = await Promise.all(categoryPromises);
    const merged = dedupeById(categoryResults.flat());

    if (merged.length === 0) {
      console.warn("API 결과 비어있음 → 더미 사용");
      return search
          ? DUMMY_MCP_LIST.filter(
              (d) =>
                  d.title.toLowerCase().includes(search.toLowerCase()) ||
                  d.description?.toLowerCase().includes(search.toLowerCase())
          )
          : DUMMY_MCP_LIST;
    }

    return merged;
  } catch (error) {
    console.warn("MCP 데이터 가져오기 실패 → 더미 사용:", error);
    return search
        ? DUMMY_MCP_LIST.filter(
            (d) =>
                d.title.toLowerCase().includes(search.toLowerCase()) ||
                d.description?.toLowerCase().includes(search.toLowerCase())
        )
        : DUMMY_MCP_LIST;
  }
}

/* Server Component: URL 쿼리 읽기 */
export default async function Page({
                                     searchParams,
                                   }: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const search = (typeof searchParams?.search === "string" ? searchParams?.search : "") || "";

  const mcpData = await fetchAllMCPData(search);

  return <MarketPage initialData={mcpData} />;
}
