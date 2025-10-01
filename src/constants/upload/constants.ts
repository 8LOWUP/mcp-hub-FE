//src/constants/upload/constants.ts
export const ERROR_MESSAGES = {
    MCP_NAME: "MCP 이름을 입력해주세요.",
    DESCRIPTION: "설명을 입력해주세요.",
    SERVER_URL: "서버 URL을 입력해주세요.",
    CONNECTION_PLATFORM: "연결 플랫폼을 입력해주세요.",
    DEVELOPER_NAME: "개발자 이름을 입력해주세요.",
    SOURCE_CODE_URL: "소스 코드 URL을 입력해주세요.",
    LICENSE: "라이센스를 입력해주세요.",
};

// 카테고리 매핑
export const CATEGORY_MAP: Record<string, number> = {
    "web server": 1,
    "memory": 2,
    "browser": 3,
    "language": 4,
    "etc": 5,
};

// 라이선스 매핑
export const LICENSE_MAP: Record<string, number> = {
    "MIT License": 1,
    "GPL License": 2,
    "Apache License 2.0": 3,
    "Proprietary": 4,
    "기타": 5,
};
