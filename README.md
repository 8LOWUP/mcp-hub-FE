📂 Project Structure

MCP(Model Context Platform)를 소개하고, 웹사이트 내에서 직접 서비스를 체험할 수 있는 플랫폼입니다.
폴더 구조는 Next.js App Router를 기반으로, 재사용성과 유지보수를 고려해 구성되었습니다.

/app          # Next.js App Router 기반 페이지 & 라우팅
/components   # 재사용 가능한 UI 컴포넌트 (Button, Modal, Header 등)
/constants    # 전역 상수값 (routes, config, 메시지 등)
/contexts     # React Context API (Auth, Theme 등)
/features     # DDD 스타일 도메인 단위 기능 모음 (auth, chat, dashboard 등)
/hooks        # 재사용 가능한 Custom Hooks (useAuth, useDebounce 등)
/lib          # 외부 라이브러리, SDK 초기화 및 wrapper (axios, firebase 등)
/services     # 비즈니스 로직 + API 호출 계층 (authService, userService 등)
/store        # 전역 상태 관리 (Zustand, Redux 등)
/styles       # 글로벌 스타일, 테마, CSS/SCSS
/types        # TypeScript 타입 정의 (API 응답, 모델 등)
/utils        # 순수 함수 유틸 모음 (formatDate, validateEmail 등)


⸻

🏗️ DDD (Domain Driven Design) 적용

본 프로젝트는 일부 영역에서 **DDD(도메인 주도 설계)**를 적용합니다.
즉, 기능(도메인) 단위로 관련 파일을 모아 관리합니다.

예시:

/features
  /auth
    LoginForm.tsx
    useAuth.ts
    authService.ts
    types.ts
  /chat
    ChatBox.tsx
    useChat.ts
    chatService.ts

➡️ 로그인 관련 코드(auth)나 채팅 관련 코드(chat)가 한 폴더에 모여 있어,
유지보수와 확장성이 좋아집니다.

⸻

🚀 Tech Stack
	•	Framework: Next.js (App Router)
	•	Language: TypeScript
	•	Styling: TailwindCSS / SCSS
	•	State Management: Zustand (or Redux if needed)
	•	API: MCP API + Backend Services
	•	Others: Axios, Context API, Custom Hooks

⸻

✨ Features
	•	MCP 소개 페이지: MCP 개념 및 사용법 소개
	•	실시간 체험 서비스: MCP를 웹에서 직접 사용해볼 수 있는 인터페이스 제공
	•	유저 관리: 로그인/회원가입, 인증/인가
	•	대시보드: 사용 데이터 및 결과 시각화

⸻