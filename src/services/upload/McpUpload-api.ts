import { axiosInstance } from "@/services/AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";
import type { McpMetaRequestFormData, McpMetaResponse } from "@/types/upload/upload-types";

/* -------------------------------------------------------------------------- */
/* 🧩 공통 유틸: undefined / null 키 제거                                      */
/* -------------------------------------------------------------------------- */
/**
 * 객체에서 undefined 또는 null 값의 key를 제거합니다.
 * 신규 MCP 업로드 시 mcpId가 undefined이면 key 자체가 제거됩니다.
 */
const cleanObject = <T extends object>(obj: T): Partial<T> => {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([, value]) => value !== undefined && value !== null
        )
    ) as Partial<T>;
};

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
 * ✅ 신규 업로드 시 mcpId(undefined)는 key 자체가 제거됨.
 */
export const saveMcpMeta = async (
    body: McpMetaRequestFormData
): Promise<McpMetaResponse> => {
    console.log("🧩 [saveMcpMeta] 요청 시작:", body);

    const formData = new FormData();

    // 🖼️ file이 실제 파일인 경우 그대로 첨부
    if (body.file instanceof File) {
        formData.append("file", body.file);
    } else {
        // ⚙️ 파일이 없을 경우 빈 파일 추가 (Spring MultipartFile 필수 방지)
        formData.append(
            "file",
            new Blob([], { type: "application/octet-stream" }),
            "empty.txt"
        );
    }

    // ✅ meta 직렬화 시 undefined / null 필드 제거
    const cleanedMeta = cleanObject(body.meta);

    // 🧾 meta는 JSON Blob으로 직렬화 후 전송
    formData.append(
        "meta",
        new Blob([JSON.stringify(cleanedMeta)], { type: "application/json" })
    );

    console.log("📤 [saveMcpMeta] 전송 데이터:", {
        file: body.file instanceof File ? body.file.name : "empty.txt",
        meta: cleanedMeta,
    });

    // ✅ PATCH 요청 (Authorization 헤더는 AxiosInstance interceptor에서 자동 추가됨)
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
 * ✅ 신규 MCP 배포 시 mcpId(undefined)는 key 자체가 제거됨.
 */
export const publishMcp = async (
    body: McpMetaRequestFormData
): Promise<McpMetaResponse> => {
    console.log("🚀 [publishMcp] 요청 시작:", body);

    const formData = new FormData();

    // ✅ 파일 추가
    if (body.file instanceof File) {
        formData.append("file", body.file);
    } else {
        // 파일이 선택되지 않은 경우 빈 Blob 추가
        formData.append(
            "file",
            new Blob([], { type: "application/octet-stream" }),
            "empty.txt"
        );
    }

    // ✅ undefined / null 필드 제거
    const cleanedMeta = Object.fromEntries(
        Object.entries(body.meta).filter(([_, v]) => v !== undefined && v !== null)
    );

    // ✅ 신규 생성 시 mcpId 필드 제거 (meta와 동일한 동작)
    if (cleanedMeta.mcpId === undefined || cleanedMeta.mcpId === null) {
        delete cleanedMeta.mcpId;
    }

    // ✅ JSON 문자열로 Blob 생성
    formData.append(
        "meta",
        new Blob([JSON.stringify(cleanedMeta)], { type: "application/json" })
    );

    console.log("📤 [publishMcp] 전송 데이터:", {
        file: body.file instanceof File ? body.file.name : "empty.txt",
        meta: cleanedMeta,
    });

    // ✅ Authorization 헤더 자동 추가됨 (axiosInstance가 담당)
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
