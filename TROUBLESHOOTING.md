# ImageLoader 오류 해결 가이드

## 문제 상황
다른 팀원들이 ImageLoader 관련 오류를 겪고 있지만, 일부 개발자는 정상 작동함

## 해결 방법

### 1. 환경 변수 확인
```bash
# .env.local 파일이 있는지 확인
ls -la .env.local

# 환경 변수 설정 확인
echo $NEXT_PUBLIC_API_URL
```

### 2. 이미지 파일 확인
```bash
# 필수 이미지 파일들이 존재하는지 확인
ls -la public/logo.svg
ls -la public/catprofile.svg
ls -la public/default-mcp-logo.svg
```

### 3. Next.js 캐시 초기화
```bash
# .next 폴더 삭제 후 재빌드
rm -rf .next
npm run build
# 또는
yarn build
```

### 4. 의존성 재설치
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
# 또는
yarn install
```

### 5. 환경 변수 설정
`.env.local` 파일 생성:
```env
NEXT_PUBLIC_API_URL=http://61.109.236.22/
NEXT_PUBLIC_API_IMAGE_URL=https://61.109.236.22/
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
```

### 6. Next.js 버전 확인
```bash
npm list next
# 또는
yarn list next
```

## 현재 정상 작동하는 이유
- 환경 변수가 올바르게 설정됨
- 필수 이미지 파일들이 모두 존재함
- Next.js 캐시가 정상 상태임

## 추가 디버깅
```bash
# 개발 서버 실행 시 상세 로그 확인
npm run dev
# 또는
yarn dev
```
