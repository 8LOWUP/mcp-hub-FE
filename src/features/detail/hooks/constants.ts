import { McpDetail } from "./types";

export const MOCK_MARKET_DATA: McpDetail = {
    mcpName:"AI agent MCP",
    about: "이 마켓은 예시 마켓입니다.",
    tools: ["Tool 1", "Tool 2", "Tool 3", "Tool 4", "Tool 5", "Tool 6"],
    reviews: [
        { id: "1", author: "Alice", content: "좋아요!", createdAt: "2023-09-01", rating: 5 },
        { id: "2", author: "Bob", content: "정말 편리합니다.", createdAt: "2023-09-02", rating: 4 },
        { id: "3", author: "Charlie", content: "추천합니다.", createdAt: "2023-09-03", rating: 5 },
    ],
    url: "https://example.com",
    connectionPlatform: ["Youtube", "Notion", "Google", "Vscode"],
    developerName: "KIKI",
    published: "2021.12.13",
    sourceCode: "http://example.com",
    license:"MIT",
    tag: "web server",
    downloader: "1000",
    mcpLogo: "/mcpLogo.svg"
};

export type { McpDetail };