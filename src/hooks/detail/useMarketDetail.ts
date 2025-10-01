"use client";

import { useEffect, useState } from "react";
import { getMcpDetail } from "@/services/detail/api";
import type { McpItem } from "@/types/detail/detail-types";

export const useMarketDetail = (id: string) => {
    const [data, setData] = useState<McpItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getMcpDetail(id);

                const mappedData: McpItem = {
                    ...res,
                    connectionPlatform: res.platformName
                        ? res.platformName.split(",").map((p) => p.trim())
                        : [],
                    about: res.description,
                    url: res.requestUrl,
                };

                setData(mappedData);
            } catch (err: any) {
                setError(err.message || "MCP 불러오기 실패");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return { data, loading, error, setData };
};
