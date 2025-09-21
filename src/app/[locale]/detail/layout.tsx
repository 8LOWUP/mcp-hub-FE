

// (선택) 이 라우트 전용 메타데이터 임시
import {Metadata} from "next";

export const metadata : Metadata = {
    title: "Chat | MCP HUB",
    description: "MCP를 위한 LLM 채팅 페이지",
};

// (선택) 정적 빌드 시 사용할 로케일 목록 임시
// 프로젝트에 맞게 수정/삭제하세요.
export function generateStaticParams() {
    return [{ locale: "ko" }, { locale: "en" }];
}
