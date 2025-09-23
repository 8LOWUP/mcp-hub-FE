// src/features/detail/hooks/useMarketDetail.ts
import { useState, useEffect } from "react";
import { McpDetail, MOCK_MARKET_DATA } from "./constants";

export function useMarketDetail(id?: string) {
    const [data, setData] = useState<McpDetail>(MOCK_MARKET_DATA);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        async function fetchData() {
            try {
                const res = await fetch(`/api/market/${id}`);
                if (!res.ok) throw new Error("Fetch failed");
                const result: McpDetail = await res.json();
                setData(result);
            } catch (error) {
                console.error("Fetch failed, using mock data", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    return { data, setData, loading };
}
