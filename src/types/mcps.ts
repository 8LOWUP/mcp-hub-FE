export type McpToolType = { name: string; content: string };

export type McpMetaType = {
    mcpId: number;
    name: string;
    description: string;
    categoryId: number;
    sourceUrl?: string;
    imageUrl?: string;
    requestUrl?: string;
    platformName?: string;
    developerName?: string;
    isKeyRequired?: boolean;
    licenseId?: number;
    tools?: McpToolType[];
    file?: File;
};
