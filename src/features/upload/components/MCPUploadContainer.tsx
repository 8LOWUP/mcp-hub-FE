// src/features/upload/components/MCPUploadContainer.tsx 수정
"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import MCPUploadForm from "./MCPUploadForm";
import { axiosInstance } from "@/services/AxiosInstance";
import { API_ENDPOINTS } from "@/constants/apis/key";
import type { MyMcpDetailResponse } from "@/types/upload/upload-types";

const isOk = (c?: string) => ["SUCCESS", "COMMON200", "200"].includes(c ?? "");

const fetchMyUploadDetail = async (mcpId: number) => {
    const url = API_ENDPOINTS.MCP.DASHBOARD_DETAIL.replace("{mcpId}", String(mcpId));
    const { data } = await axiosInstance.get<MyMcpDetailResponse>(url);
    if (!isOk(data.code)) throw new Error(data.message || "상세 조회 실패");
    return data.result;
};

export default function MCPUploadContainer() {
    const searchParams = useSearchParams();
    const mcpIdParam = searchParams.get("mcpId");
    const mcpId = useMemo(() => Number(mcpIdParam), [mcpIdParam]);
    const isEditMode = Boolean(mcpIdParam);

    const [localMcpId, setLocalMcpId] = useState<number | null>(null);

    const { data: detail, isLoading, error } = useQuery({
        enabled: isEditMode && Number.isFinite(mcpId) && mcpId > 0,
        queryKey: ["myUploadDetail", mcpId],
        queryFn: () => fetchMyUploadDetail(mcpId),
    });

    useEffect(() => {
        if (!isEditMode) return;
        if (detail?.id && Number.isFinite(detail.id)) {
            setLocalMcpId(detail.id);
        } else if (Number.isFinite(mcpId) && mcpId > 0) {
            setLocalMcpId(mcpId);
        }
    }, [isEditMode, detail?.id, mcpId]);

    if (isEditMode && isLoading)
        return (
            <div className="flex pt-20 justify-center items-center min-h-screen bg-surface-1 px-4">
                <div className="max-w-3xl text-white p-6 rounded shadow-lg">
                    <p className="opacity-70">기존 내용을 불러오는 중...</p>
                </div>
            </div>
        );

    if (isEditMode && error)
        return (
            <div className="flex pt-20 justify-center items-center min-h-screen bg-surface-1 px-4">
                <div className="max-w-3xl text-white p-6 rounded shadow-lg">
                    <p className="text-red-500">
                        기존 내용 조회 실패. 권한이나 ID를 확인해주세요.
                    </p>
                </div>
            </div>
        );

    return (
        <MCPUploadForm
            detail={detail}
            isEditMode={isEditMode}
            localMcpId={localMcpId}
            setLocalMcpId={setLocalMcpId}
        />
    );
}
