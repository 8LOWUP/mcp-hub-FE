// constants/mcp-data.ts
import type { McpCardData } from "@/features/market/types";

export const DUMMY_MCP_LIST: McpCardData[] = [
    // Memory Category
    { id: "1", title: "Notion Memory Manager", description: "노션 데이터베이스를 활용한 메모리 관리 시스템", usersCount: 2048, iconSrc: "/notionLogo.svg", saved: true, category: "memory" },
    { id: "2", title: "Personal Knowledge Base", description: "개인 지식 베이스 구축 및 관리 도구", usersCount: 1532, iconSrc: "/mcpLogo.svg", saved: false, category: "memory" },
    { id: "3", title: "Smart Note Taker", description: "AI 기반 스마트 노트 작성 및 정리 도구", usersCount: 987, iconSrc: "/mcpLogo.svg", saved: true, category: "memory" },
    { id: "4", title: "Memory Palace Builder", description: "기억의 궁전 기법을 활용한 학습 도구", usersCount: 756, iconSrc: "/mcpLogo.svg", saved: false, category: "memory" },
    { id: "5", title: "Contextual Memory", description: "상황별 메모리 저장 및 검색 시스템", usersCount: 1234, iconSrc: "/mcpLogo.svg", saved: true, category: "memory" },
    { id: "6", title: "Flashcard Generator", description: "자동 플래시카드 생성 및 학습 관리", usersCount: 892, iconSrc: "/mcpLogo.svg", saved: false, category: "memory" },
    { id: "7", title: "Memory Analytics", description: "메모리 사용 패턴 분석 및 최적화 도구", usersCount: 567, iconSrc: "/mcpLogo.svg", saved: true, category: "memory" },
    { id: "8", title: "Long-term Memory", description: "장기 기억 저장 및 관리 시스템", usersCount: 1123, iconSrc: "/mcpLogo.svg", saved: false, category: "memory" },
    { id: "9", title: "Memory Sync", description: "다양한 플랫폼 간 메모리 동기화 도구", usersCount: 445, iconSrc: "/mcpLogo.svg", saved: true, category: "memory" },
    { id: "10", title: "Smart Reminder", description: "AI 기반 스마트 알림 및 리마인더", usersCount: 1789, iconSrc: "/mcpLogo.svg", saved: false, category: "memory" },

    // Web Search Category
    { id: "11", title: "Google Search Pro", description: "고급 구글 검색 및 결과 분석 도구", usersCount: 2567, iconSrc: "/google.svg", saved: true, category: "web-search" },
    { id: "12", title: "DuckDuckGo Privacy", description: "프라이버시 중심 웹 검색 도구", usersCount: 1890, iconSrc: "/mcpLogo.svg", saved: false, category: "web-search" },
    { id: "13", title: "Academic Search", description: "학술 논문 및 연구 자료 검색", usersCount: 1345, iconSrc: "/mcpLogo.svg", saved: true, category: "web-search" },
    { id: "14", title: "News Aggregator", description: "실시간 뉴스 수집 및 분석 도구", usersCount: 2234, iconSrc: "/mcpLogo.svg", saved: false, category: "web-search" },
    { id: "15", title: "Image Search AI", description: "AI 기반 이미지 검색 및 분석", usersCount: 1567, iconSrc: "/mcpLogo.svg", saved: true, category: "web-search" },
    { id: "16", title: "Video Search", description: "비디오 콘텐츠 검색 및 요약 도구", usersCount: 987, iconSrc: "/youtube.svg", saved: false, category: "web-search" },
    { id: "17", title: "Social Media Search", description: "소셜 미디어 플랫폼 통합 검색", usersCount: 1789, iconSrc: "/instagram.svg", saved: true, category: "web-search" },
    { id: "18", title: "Product Search", description: "상품 비교 및 가격 검색 도구", usersCount: 1234, iconSrc: "/mcpLogo.svg", saved: false, category: "web-search" },
    { id: "19", title: "Job Search Assistant", description: "취업 정보 검색 및 매칭 도구", usersCount: 1456, iconSrc: "/mcpLogo.svg", saved: true, category: "web-search" },
    { id: "20", title: "Real-time Search", description: "실시간 웹 검색 및 모니터링", usersCount: 789, iconSrc: "/mcpLogo.svg", saved: false, category: "web-search" },

    // Browser Category
    { id: "21", title: "Chrome Automation", description: "크롬 브라우저 자동화 및 제어 도구", usersCount: 3456, iconSrc: "/mcpLogo.svg", saved: true, category: "browser" },
    { id: "22", title: "Firefox Extension", description: "파이어폭스 확장 프로그램 관리", usersCount: 2134, iconSrc: "/mcpLogo.svg", saved: false, category: "browser" },
    { id: "23", title: "Safari Helper", description: "사파리 브라우저 최적화 도구", usersCount: 1567, iconSrc: "/mcpLogo.svg", saved: true, category: "browser" },
    { id: "24", title: "Edge Manager", description: "엣지 브라우저 설정 및 관리", usersCount: 1234, iconSrc: "/mcpLogo.svg", saved: false, category: "browser" },
    { id: "25", title: "Tab Manager", description: "브라우저 탭 관리 및 정리 도구", usersCount: 2789, iconSrc: "/mcpLogo.svg", saved: true, category: "browser" },
    { id: "26", title: "Bookmark Organizer", description: "북마크 자동 정리 및 분류", usersCount: 1890, iconSrc: "/mcpLogo.svg", saved: false, category: "browser" },
    { id: "27", title: "Password Manager", description: "브라우저 비밀번호 관리 및 보안", usersCount: 2345, iconSrc: "/mcpLogo.svg", saved: true, category: "browser" },
    { id: "28", title: "Ad Blocker Pro", description: "고급 광고 차단 및 필터링", usersCount: 4567, iconSrc: "/mcpLogo.svg", saved: false, category: "browser" },
    { id: "29", title: "Download Manager", description: "다운로드 관리 및 최적화", usersCount: 1678, iconSrc: "/downLoader.svg", saved: true, category: "browser" },
    { id: "30", title: "Browser Analytics", description: "브라우저 사용 패턴 분석", usersCount: 1123, iconSrc: "/mcpLogo.svg", saved: false, category: "browser" },

    // Language Category
    { id: "31", title: "Korean Translator", description: "한국어 번역 및 언어 학습 도구", usersCount: 3456, iconSrc: "/mcpLogo.svg", saved: true, category: "language" },
    { id: "32", title: "English Grammar", description: "영어 문법 검사 및 교정 도구", usersCount: 2789, iconSrc: "/mcpLogo.svg", saved: false, category: "language" },
    { id: "33", title: "Japanese Helper", description: "일본어 학습 및 번역 도구", usersCount: 1890, iconSrc: "/mcpLogo.svg", saved: true, category: "language" },
    { id: "34", title: "Chinese Pinyin", description: "중국어 병음 학습 도구", usersCount: 1456, iconSrc: "/mcpLogo.svg", saved: false, category: "language" },
    { id: "35", title: "Spanish Tutor", description: "스페인어 학습 및 연습 도구", usersCount: 1234, iconSrc: "/mcpLogo.svg", saved: true, category: "language" },
    { id: "36", title: "French Assistant", description: "프랑스어 학습 및 발음 도구", usersCount: 987, iconSrc: "/mcpLogo.svg", saved: false, category: "language" },
    { id: "37", title: "German Teacher", description: "독일어 문법 및 어휘 학습", usersCount: 756, iconSrc: "/mcpLogo.svg", saved: true, category: "language" },
    { id: "38", title: "Italian Guide", description: "이탈리아어 기초 학습 도구", usersCount: 567, iconSrc: "/mcpLogo.svg", saved: false, category: "language" },
    { id: "39", title: "Portuguese Helper", description: "포르투갈어 학습 및 번역", usersCount: 445, iconSrc: "/mcpLogo.svg", saved: true, category: "language" },
    { id: "40", title: "Russian Tutor", description: "러시아어 키릴 문자 학습", usersCount: 334, iconSrc: "/mcpLogo.svg", saved: false, category: "language" },

    // Etc Category
    { id: "41", title: "GitHub Integration", description: "GitHub 저장소 관리 및 자동화", usersCount: 4567, iconSrc: "/github.svg", saved: true, category: "etc" },
    { id: "42", title: "VS Code Helper", description: "VS Code 확장 및 설정 관리", usersCount: 3456, iconSrc: "/vscode.svg", saved: false, category: "etc" },
    { id: "43", title: "Docker Manager", description: "Docker 컨테이너 관리 도구", usersCount: 2345, iconSrc: "/mcpLogo.svg", saved: true, category: "etc" },
    { id: "44", title: "AWS Assistant", description: "AWS 서비스 관리 및 모니터링", usersCount: 1890, iconSrc: "/mcpLogo.svg", saved: false, category: "etc" },
    { id: "45", title: "Slack Bot", description: "Slack 워크스페이스 자동화", usersCount: 2789, iconSrc: "/mcpLogo.svg", saved: true, category: "etc" },
    { id: "46", title: "Discord Helper", description: "Discord 서버 관리 도구", usersCount: 1567, iconSrc: "/mcpLogo.svg", saved: false, category: "etc" },
    { id: "47", title: "Telegram Bot", description: "텔레그램 봇 생성 및 관리", usersCount: 1234, iconSrc: "/mcpLogo.svg", saved: true, category: "etc" },
    { id: "48", title: "Calendar Sync", description: "다양한 캘린더 동기화 도구", usersCount: 1123, iconSrc: "/mcpLogo.svg", saved: false, category: "etc" },
    { id: "49", title: "Email Manager", description: "이메일 자동화 및 관리", usersCount: 987, iconSrc: "/mcpLogo.svg", saved: true, category: "etc" },
    { id: "50", title: "File Organizer", description: "파일 자동 정리 및 분류", usersCount: 1789, iconSrc: "/file.svg", saved: false, category: "etc" },
];
