# 🔌 MCP Hub (Frontend)

> MCP(Model Context Protocol)를 소개하고, 웹에서 바로 탐색·체험·관리할 수 있는 허브 플랫폼

개발자와 사용자가 MCP 서버를 **마켓에서 찾고**, **상세 정보를 확인**하며, **워크스페이스 채팅으로 연동을 시험**하고, **업로드·프로필·LLM 토큰**까지 한곳에서 다룰 수 있도록 만든 프론트엔드 애플리케이션입니다.

## 💡 Project Overview

MCP Hub FE는 단순한 정적 소개 페이지를 넘어, **인증 기반 워크플로**와 **API 연동**을 전제로 합니다. Next.js App Router와 도메인 단위 폴더 구조(`features`)로 화면과 비즈니스 로직을 나누고, 국제화(`next-intl`)와 다크/라이트 테마(`next-themes`)를 지원해 서비스형 제품에 가깝게 동작하도록 구성되어 있습니다.

백엔드와의 통신은 Axios 기반 서비스 계층으로 정리되어 있으며, MCP·워크스페이스·멤버·파일·LLM 등 API를 화면에서 일관되게 사용합니다.

## 👥 Contributors

<div align="center">

| 김진성 | 김서현 | 이혜연 |
|-------------|-------------|-------------|
| <a href="https://github.com/smileman62"><img src="https://github.com/smileman62.png" width="150" height="150" alt="김진성"/></a> | <a href="https://github.com/hyunnniii"><img src="https://github.com/hyunnniii.png" width="150" height="150" alt="김서현"/></a> | <a href="https://github.com/heyn2"><img src="https://github.com/heyn2.png" width="150" height="150" alt="이혜연"/></a> |
| [@smileman62](https://github.com/smileman62) | [@hyunnniii](https://github.com/hyunnniii) | [@heyn2](https://github.com/heyn2) |

</div>

## 📌 서비스 목표

1. **MCP 발견 경험**: 랜딩·마켓에서 MCP를 탐색하고 상세 페이지로 이어지는 흐름을 제공합니다.
2. **로그인 후 심화 기능**: 채팅(워크스페이스), MCP 업로드, 프로필·LLM 관리 등 보호된 라우트에서 실사용 시나리오를 지원합니다.
3. **운영 가능한 구조**: DDD 스타일 `features`, 공통 `components`·`services`·`hooks`로 유지보수와 확장을 용이하게 합니다.

## ✨ 주요 기능

### 🏠 랜딩 & 마켓

서비스 소개와 MCP 목록(마켓) 탐색, 카드·필터 등 마켓형 UI로 콘텐츠를 노출합니다.

### 📦 MCP 상세

개별 MCP의 메타데이터·연동 정보를 보여 주고, 로그인 사용자 기준으로 저장(북마크) 여부 등을 표시할 수 있는 구조를 둡니다.

### 💬 워크스페이스 채팅

인증된 사용자가 워크스페이스 단위로 대화·연동을 시험할 수 있는 채팅 화면을 제공합니다.

### ⬆️ MCP 업로드

보호된 업로드 플로에서 MCP 관련 자료·설정을 등록할 수 있습니다.

### 👤 프로필 & LLM / 배포 관리

프로필 영역에서 LLM 토큰 관리, 배포된 MCP 목록 등 계정·연동 설정을 다룹니다.

### 🆘 지원 & 인증

지원 페이지, OAuth 콜백 등 로그인·문의 관련 진입점을 포함합니다.

## 🛠️ Tech Stack

- **Next.js 15** (App Router): 라우팅·서버/클라이언트 컴포넌트
- **React 19**: UI 렌더링
- **TypeScript**: 타입 안정성
- **Tailwind CSS 4**: 유틸리티 기반 스타일
- **next-intl**: 다국어(로케일) 라우팅 및 메시지
- **next-themes**: 라이트/다크 테마
- **TanStack Query**: 서버 상태·캐싱
- **Zustand**: 클라이언트 전역 상태
- **Axios**: HTTP 클라이언트
- **Framer Motion**: 인터랙션·애니메이션
- **Lucide React / React Icons**: 아이콘
- **react-hot-toast / Sonner**: 알림(토스트)

## 📂 프로젝트 구조 (요약)

```
src/app              # App Router 페이지·레이아웃 ([locale], (protected) 등)
src/components       # 공통 UI
src/constants        # 라우트·설정·상수
src/contexts         # Auth, Theme 등 Context
src/features         # 도메인별 기능 (auth, chat, upload, …)
src/hooks            # 공통 훅
src/lib              # 유틸·외부 연동 래퍼
src/services         # API·비즈니스 호출 계층
src/store            # Zustand 스토어
src/types            # 타입 정의
```

API 사용 패턴은 `src/services/README.md`를 참고하세요.

## ⚙️ Getting Started

### Prerequisites

- **Node.js** 18 이상 권장
- 패키지 매니저: **npm**, **pnpm**, **yarn** 중 하나

### Installation

1. 저장소 클론 후 프로젝트 루트로 이동합니다.

2. 의존성 설치

```bash
npm install
```

3. 환경 변수  
   백엔드 URL 등은 `.env.local`에 설정합니다. (예: `NEXT_PUBLIC_API_URL`)

4. 개발 서버 실행

```bash
npm run dev
```

5. 브라우저에서 `http://localhost:3000` 접속 (Next.js 기본 포트)

### Available Scripts

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint
```

## 🎯 해결하는 문제들

| 문제점 | MCP Hub FE의 방향 |
|--------|-------------------|
| MCP 정보가 산재해 있다 | 랜딩·마켓·상세로 한 흐름에서 탐색 |
| 연동을 바로 시험하기 어렵다 | 로그인 후 워크스페이스 채팅 등 체험 경로 |
| 토큰·배포 설정이 분산된다 | 프로필·LLM·업로드 화면으로 집약 |
| 팀 단위 유지보수 | features 중심 도메인 구조와 공통 서비스 계층 |

## 🌟 기대 효과

- MCP 생태계를 **웹 허브**에서 소개·검색·체험까지 연결
- 인증·API·i18n·테마를 갖춘 **제품 수준의 프론트엔드** 기반 마련
- 백엔드 스웨거/엔드포인트와 맞춘 **일관된 클라이언트 호출** (`src/services`)

## 🏆 비전

MCP를 “설명 문서”가 아니라 **실제로 써볼 수 있는 서비스**로 연결하고, 업로드·채팅·토큰 관리까지 이어지는 **통합 허브**로 발전하는 것을 목표로 합니다.

## 📞 Contact

프로젝트 문의·제안은 저장소 관리자 또는 사내 채널을 통해 연락해 주세요.

---

**MCP Hub**와 함께 MCP를 더 쉽게 발견하고 연결해 보세요.
