export interface Tool {
    id: string;
    description: string;
}

export interface UploadFormData {
    mcpName: string;
    description: string;
    tags: string;
    serverUrl: string;
    connectionPlatforms: string;
    tools: Tool[];
    developerName: string;
    sourceCodeUrl: string;
    license: string;
    icon: File | null;
}
