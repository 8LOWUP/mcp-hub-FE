// src/features/profiles/deployed/utils/map.ts
import { McpItemType } from "@/features/profiles/types";
import { UploadedMcpItemType } from "../types/mcps";

export const mapToCard = (it: UploadedMcpItemType): McpItemType => ({
    id: String(it.id),
    mcpId: it.id,
    title: it.name,
    description: it.description,
    imageUrl: it.imageUrl,
    // ✅ 리스트엔 published가 없을 수 있으므로 publishedDate/lastPublishedAt로 판정
    published: Boolean(
        (it as any).publishedDate ||
        (it as any).lastPublishedAt ||
        (typeof (it as any).published === "boolean" && (it as any).published)
    ),
});
