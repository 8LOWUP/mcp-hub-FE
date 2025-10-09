import { axiosInstance } from "@/services/AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";
import type { McpMetaRequestFormData, McpMetaResponse } from "@/types/upload/upload-types";

/* -------------------------------------------------------------------------- */
/* 🧩 1️⃣ MCP 메타데이터 저장 (PATCH /mcps/dashboard/meta)                      */
/* -------------------------------------------------------------------------- */
/**
 * Swagger 명세상:
 * - multipart/form-data
 *   - file: binary (실제 파일)
 *   - meta: JSON 문자열 (Blob)
 *
 * ✅ 백엔드 수정 없이 multipart/form-data 그대로 전송.
 * ✅ Authorization 헤더는 AxiosInstance의 interceptor에서 자동으로 추가됨.
 */
export const saveMcpMeta = async (
    body: McpMetaRequestFormData
): Promise<McpMetaResponse> => {
    console.log("🧩 [saveMcpMeta] 요청 시작:", body);

    // ✅ FormData 구성
    const formData = new FormData();

    // 🖼️ file이 실제 파일인 경우 그대로 첨부
    if (body.file instanceof File) {
        formData.append("file", body.file);
    } else {
        // ⚙️ 파일이 없을 경우 빈 파일 추가 (Spring MultipartFile 필수 방지)
        formData.append("file", new Blob([], { type: "application/octet-stream" }), "empty.txt");
    }

    // 🧾 meta는 JSON Blob으로 직렬화 후 전송
    formData.append(
        "meta",
        new Blob([JSON.stringify(body.meta)], { type: "application/json" })
    );

    console.log("📤 [saveMcpMeta] 전송 데이터:", {
        file: body.file instanceof File ? body.file.name : "empty.txt",
        meta: body.meta,
    });

    // ✅ PATCH 요청 (headers는 자동 처리 — Authorization 유지)
    const { data } = await axiosInstance.patch<McpMetaResponse>(
        API_ENDPOINTS.MCP.DASHBOARD_META,
        formData
    );

    console.log("📩 [saveMcpMeta] 응답 수신:", data);
    return data;
};

/* -------------------------------------------------------------------------- */
/* 🚀 2️⃣ MCP 배포 (PATCH /mcps/dashboard/publish)                             */
/* -------------------------------------------------------------------------- */
/**
 * Swagger 명세상:
 * - multipart/form-data
 *   - file: binary (실제 파일)
 *   - meta: JSON 문자열 (Blob)
 *
 * ✅ Authorization 헤더 유지.
 */
export const publishMcp = async (
    body: McpMetaRequestFormData
): Promise<McpMetaResponse> => {
    console.log("🚀 [publishMcp] 요청 시작:", body);

    const formData = new FormData();

    if (body.file instanceof File) {
        formData.append("file", body.file);
    } else {
        formData.append("file", new Blob([], { type: "application/octet-stream" }), "empty.txt");
    }

    formData.append(
        "meta",
        new Blob([JSON.stringify(body.meta)], { type: "application/json" })
    );

    console.log("📤 [publishMcp] 전송 데이터:", {
        file: body.file instanceof File ? body.file.name : "empty.txt",
        meta: body.meta,
    });

    // ✅ Authorization 유지 — headers 지정하지 않음
    const { data } = await axiosInstance.patch<McpMetaResponse>(
        API_ENDPOINTS.MCP.DASHBOARD_PUBLISH,
        formData
    );

    console.log("📩 [publishMcp] 응답 수신:", data);
    return data;
};

/* -------------------------------------------------------------------------- */
/* 📦 3️⃣ Export                                                             */
/* -------------------------------------------------------------------------- */
export const mcpUploadApi = {
    saveMcpMeta,
    publishMcp,
};

export default mcpUploadApi;
