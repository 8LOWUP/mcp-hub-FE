export type McpItemType = {
    id: string;            // 카드 key
    mcpId: number;         // ✅ 서버의 실제 MCP ID(숫자)
    title: string;
    description?: string;
    imageUrl?: string;
    published?: boolean;   // 배포/임시저장 구분
    isHighlighted?: boolean;
    apiKey?: string;
};
