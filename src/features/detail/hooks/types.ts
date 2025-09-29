//src/features/detail/hooks/types.ts
export interface Review{
    id: string;
    author: string;
    content: string;
    createdAt: string;
    rating: number; //1~5
}

export interface McpDetail {
    mcpName: string;
    tag: string;
    about: string;
    tools: string[];
    reviews: Review[];
    url: string;
    connectionPlatform: string[];
    developerName: string;
    published: string;
    sourceCode: string;
    license: string;
    downloader: string;
    mcpLogo: string;
}
