// Deployed 페이지 전용 더미 데이터
import { McpItemType } from "@/features/profiles/types";

export const DUMMY_DEPLOYED_LIST: McpItemType[] = [
    {
        id: "dep-1",
        title: "Notion’s MCP",
        description: "mcp에 대한 상세 설명이 이곳에 들어옵니다!!!",
        apiKey: "sk-****",
    },
];

export const DUMMY_DRAFT_LIST: McpItemType[] = [
    {
        id: "draft-1",
        title: "Notion’s MCP",
        description: "임시저장된 MCP입니다.",
        apiKey: "",
    },
];
