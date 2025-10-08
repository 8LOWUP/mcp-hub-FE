import { axiosInstance } from "@/services/AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";
import type {
    FileUploadRequest,
    FileUploadResponse,
    McpMetaRequest,
    McpMetaResponse,
} from "@/types/upload/upload-types";

/* ----------------------------- 📂 파일 업로드 (S3 Presigned URL 방식) ----------------------------- */
/**
 * 파일 업로드 API
 * - Swagger 명세: POST /files/presigned-url/{category}
 * - Step 1️⃣ Presigned URL 발급 요청
 * - Step 2️⃣ 발급받은 URL로 S3에 파일 업로드
 * - Step 3️⃣ 업로드된 S3 Object URL 반환
 */
export const uploadFile = async ({
                                     category,
                                     file,
                                 }: FileUploadRequest): Promise<FileUploadResponse> => {
    // 1️⃣ Presigned URL 요청 (fileName은 query parameter로 전달)
    const presignedUrlEndpoint = API_ENDPOINTS.FILES.PRESIGNED_URL.replace(
        "{category}",
        category
    );

    const { data } = await axiosInstance.post(presignedUrlEndpoint, null, {
        params: { fileName: file.name },
    });

    const presignedUrl = data?.result?.url;
    if (!presignedUrl) {
        throw new Error("Presigned URL을 가져오지 못했습니다.");
    }

    // 2️⃣ 실제 파일을 AWS S3에 업로드
    await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
    });

    // 3️⃣ Presigned URL의 '?' 이전이 실제 파일 접근 URL
    const uploadedUrl = presignedUrl.split("?")[0];

    // ✅ CommonResponse<FileUploadResult> 형태로 반환
    return {
        timestamp: new Date().toISOString(),
        code: "SUCCESS",
        message: "파일 업로드 성공",
        result: {
            url: uploadedUrl,
        },
    };
};

/* ---------------------------- 🗂 MCP 메타데이터 임시저장 ---------------------------- */
/**
 * MCP 메타데이터 저장 API
 * - Swagger 명세: PATCH /mcps/dashboard/meta
 */
export const saveMcpMeta = async (
    body: McpMetaRequest
): Promise<McpMetaResponse> => {
    const { data } = await axiosInstance.patch<McpMetaResponse>(
        API_ENDPOINTS.MCP.DASHBOARD_META,
        body
    );
    return data;
};

/* ----------------------------- 🚀 MCP 배포 ----------------------------- */
/**
 * MCP 배포 API
 * - Swagger 명세: PATCH /mcps/dashboard/publish
 */
export const publishMcp = async (
    body: McpMetaRequest
): Promise<McpMetaResponse> => {
    const { data } = await axiosInstance.patch<McpMetaResponse>(
        API_ENDPOINTS.MCP.DASHBOARD_PUBLISH,
        body
    );
    return data;
};

/* ------------------------------- 🧩 통합 객체 ------------------------------ */
export const mcpUploadApi = {
    uploadFile,
    saveMcpMeta,
    publishMcp,
};

export default mcpUploadApi; // 있어도 괜찮아요 (둘 다 가능)

