# API 서비스 사용 가이드

## AxiosInstance 기초 세팅 완료! 🎉

### 📁 생성된 파일들
- `AxiosInstance.ts` - Axios 인스턴스 및 인터셉터 설정
- `McpUpload-api.ts` - API 서비스 함수들
- `../constants/apis/key.ts` - API 관련 상수들 (스웨거 기반)
- `../types/McpUpload-api.ts` - API 관련 타입 정의

### 🚀 사용 방법

#### 1. 기본 사용법 (실제 스웨거 기반)
```typescript
import { apiService } from '@/services/api';

// 소셜 로그인
const kakaoLogin = await apiService.auth.kakaoLogin();
const googleLogin = await apiService.auth.googleLogin();
const githubLogin = await apiService.auth.githubLogin();

// 사용자 정보
const myInfo = await apiService.members.getMe();
const memberInfo = await apiService.members.getMember('member-123');

// MCP 관련
const mcpList = await apiService.mcp.getMcps({
  page: 1,
  limit: 10,
  category: 'memory'
});
const mcpDetail = await apiService.mcp.getMcp('mcp-123');
const myMcps = await apiService.mcp.getMyMcps();

// 파일 업로드
const uploadResponse = await apiService.files.uploadFile('image', file);

// 워크스페이스
const workspaces = await apiService.workspaces.getWorkspaces();
const workspaceChats = await apiService.workspaces.getWorkspaceChats('workspaces-123');
```

#### 2. 직접 axios 인스턴스 사용
```typescript
import { axiosInstance } from '@/services/AxiosInstance';

// GET 요청
const response = await axiosInstance.get('/members/me');

// POST 요청
const response = await axiosInstance.post('/mcps/mcp-123', {
  title: 'My MCP',
  description: 'Description here'
});
```

#### 3. 환경변수 설정
`.env.local` 파일에 다음 내용을 추가하세요:
```env
NEXT_PUBLIC_API_URL=http://61.109.236.22/api
```

### 🔧 주요 기능

#### 자동 토큰 관리
- 요청 시 자동으로 Authorization 헤더 추가
- 401 에러 시 자동으로 토큰 삭제 및 로그인 페이지 리다이렉트

#### 에러 처리
- 401: 인증 토큰 만료 처리
- 403: 접근 권한 없음
- 404: 리소스 없음
- 500+: 서버 오류

#### Next.js 호환성
- SSR/SSG 환경에서 안전한 localStorage 사용
- 환경변수 자동 로드

### 📝 API 엔드포인트 (실제 스웨거 기반)

#### 인증 관련
- `GET /members/auth/social/kakao` - 카카오 로그인
- `GET /members/auth/social/google` - 구글 로그인
- `GET /members/auth/social/github` - 깃허브 로그인
- `POST /members/auth/token/reissue` - 토큰 재발급
- `DELETE /members/auth/logout` - 로그아웃

#### 사용자(Members) 관련
- `GET /members/me` - 내 정보 조회
- `PATCH /members/me` - 내 정보 수정
- `DELETE /members/me` - 회원 탈퇴
- `GET /members/{memberId}` - 사용자 정보 조회
- `GET /members/search` - 사용자 검색

#### MCP 관련
- `GET /mcps` - MCP 목록 조회
- `GET /mcps/{mcpId}` - MCP 상세 조회
- `POST /mcps/{mcpId}` - MCP 생성/수정
- `DELETE /mcps/{mcpId}` - MCP 삭제
- `GET /mcps/me` - 내 MCP 목록
- `GET /mcps/dashboard` - MCP 대시보드
- `POST /mcps/dashboard` - 대시보드 생성
- `GET /mcps/dashboard/{mcpId}` - 특정 MCP 대시보드
- `GET /mcps/dashboard/{mcpId}/meta` - MCP 메타데이터
- `POST /mcps/dashboard/{mcpId}/publish` - MCP 게시
- `GET /mcps/dashboard/{mcpId}/url` - MCP URL
- `GET /mcps/review/{mcpId}` - MCP 리뷰 조회
- `POST /mcps/review/{mcpId}` - MCP 리뷰 작성
- `DELETE /mcps/review/{reviewId}` - 리뷰 삭제
- `PATCH /mcps/review/{reviewId}` - 리뷰 수정
- `GET /mcps/token/check/{mcpId}` - MCP 토큰 확인
- `GET /mcps/token/{platformId}` - 플랫폼 토큰

#### 파일 관련
- `GET /files` - 파일 목록 조회
- `POST /files/{category}` - 파일 업로드
- `POST /files/presigned-url/{category}` - 사전 서명된 URL
- `DELETE /files` - 파일 삭제

#### LLM 관련
- `GET /llm` - LLM 목록 조회
- `GET /llm/token` - LLM 토큰 조회

#### 워크스페이스 관련
- `GET /workspaces` - 워크스페이스 목록 조회
- `GET /workspaces/{workspaceId}` - 워크스페이스 상세 조회
- `GET /workspaces/{workspaceId}/chats` - 워크스페이스 채팅 조회
- `GET /workspaces/{workspaceId}/mcps` - 워크스페이스 MCP 조회

### 🎯 다음 단계
1. 백엔드 API 서버와 연동
2. 실제 API 엔드포인트에 맞게 상수 수정
3. 에러 처리 로직 커스터마이징
4. 로딩 상태 관리 추가
