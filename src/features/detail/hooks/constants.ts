import { McpDetail } from "./types";

export const MOCK_MARKET_DATA: McpDetail = {
    mcpName:"AI agent MCP",
    about: "이 mcp는 기업과 개인이 시장에서 효율적으로 연결되고 협업할 수 있도록 지원하는 플랫폼입니다. Notion에서 MCP를 활용하면, 다음과 같은 기능과 장점을 얻을 수 있습니다",
    tools: ["Tool 1", "Tool 2", "Tool 3", "Tool 4", "Tool 5", "Tool 6"],
    reviews: [
        { id: "1", author: "Alice", content: "좋아요!그리고 편리합니다. 아주 좋아요. 아주 좋다구요", createdAt: "2023-09-01", rating: 5 },
        { id: "2", author: "Bob", content: "정말 편리합니다.", createdAt: "2023-09-02", rating: 3 },
        { id: "3", author: "Charlie", content: "추천합니다.", createdAt: "2023-09-03", rating: 2 },
        { id: "4", author: "ChuChu", content: "추천합니다.", createdAt: "2023-09-03", rating: 3 },
        { id: "5", author: "Cha", content: "추천합니다.", createdAt: "2023-09-03", rating: 5 },
        { id: "6", author: "kim", content: "추천합니다.", createdAt: "2023-09-03", rating: 3 },

    ],
    url: "https://example.com",
    connectionPlatform: ["Youtube", "Google", "Vscode", "Instagram", "Notion"],
    developerName: "KIKI",
    published: "2021.12.13",
    sourceCode: "http://example.com",
    license:"MIT",
    tag: "web server",
    downloader: "1000",
    mcpLogo: "/mcpLogo.svg"
};

export type { McpDetail };
