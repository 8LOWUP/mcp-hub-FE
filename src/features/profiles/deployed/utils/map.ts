import { McpItemType } from "@/features/profiles/types";
import { UploadedMcpItemType } from "../types/mcps"; // ✅ 서버 타입 경로로 교체

export const mapToCard = (it: UploadedMcpItemType): McpItemType => ({
    id: String(it.id),     // UI key는 문자열
    mcpId: it.id,          // 업로드 페이지용 실제 숫자 id
    title: it.name,
    description: it.description,
    imageUrl: it.imageUrl,
    published: it.published,
});
