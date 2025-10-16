"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { getMcpAutoComplete, type McpAutoCompleteItem } from "@/services/search/mcp-search-api";

const useDebouncedValue = (value: string, delay = 300) => {
    const [v, setV] = React.useState(value);
    React.useEffect(() => {
        const t = setTimeout(() => setV(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return v;
};

export const useMcpSearch = (keyword: string, size = 8) => {
    const debounced = useDebouncedValue(keyword);

    const query = useQuery({
        queryKey: ["mcp-autocomplete", debounced, size],
        queryFn: () => getMcpAutoComplete(debounced, size),
        enabled: debounced.trim().length > 0,
        staleTime: 30_000,
        gcTime: 5 * 60_000,
    });

    return {
        items: (query.data ?? []) as McpAutoCompleteItem[],
        ...query,
    };
};
