import { useState, useEffect } from "react";
import { McpDetail, MOCK_MARKET_DATA } from "./constants";

export function useMarketDetail(id?: string) {
    const [data, setData] = useState<McpDetail>(MOCK_MARKET_DATA);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        setError(null);

        (async () => {
            try {
                const res = await fetch(`/api/market/${id}`);
                if (!res.ok) {
                    const fetchError = new Error(`Fetch failed with status ${res.status}`);
                    console.error(fetchError);
                    setError(fetchError);
                    setData(MOCK_MARKET_DATA);
                    return;
                }

                const result: McpDetail = await res.json();
                setData(result);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error("Fetch failed, using mock data", err);
                    setError(err);
                } else {
                    const unknownError = new Error("Unknown error occurred");
                    console.error(unknownError, err);
                    setError(unknownError);
                }
                setData(MOCK_MARKET_DATA);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    return { data, setData, loading, error };
}
