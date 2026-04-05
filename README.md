# DAKER - 해커톤 플랫폼

해커톤 탐색, 팀 빌딩, AI 팀매칭까지 한 곳에서.

## 배포 URL

https://uh-ri-rang.vercel.app

## 테스트 계정

| 아이디 | 비밀번호 | 닉네임 | 역할 | 비고 |
|--------|----------|--------|------|------|
| minsu | 1234 | 김민수 | 팀장 | T-ALPHA 팀장, Python/PyTorch/Docker |
| seoyeon | 1234 | 박서연 | 팀장 | T-BETA 팀장, React/Next.js/Figma |
| jiwoo | 1234 | 한지우 | 팀장 | T-HANDOVER-01 팀장, React/TypeScript |
| hyunwoo | 1234 | 김현우 | 무소속 | React/Next.js/TypeScript |
| soojin | 1234 | 이수진 | 무소속 | Python/FastAPI/Docker |

> 모든 테스트 계정의 비밀번호는 `1234`입니다. 게스트 모드로도 접속 가능합니다.

## 주요 기능

- **해커톤 목록/상세**: 상태 필터(진행중/종료/예정), 탭별 상세 정보
- **팀 모집 (Camp)**: 해커톤별 팀 생성/참여, 모집 분야 설정
- **AI 팀매칭**: 자연어 검색으로 팀/팀원 추천 (Gemini API)
- **리더보드**: 해커톤별 점수/순위, 글로벌 랭킹
- **다크 모드**: 전체 테마 전환 지원

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **Theme**: next-themes
- **AI**: Google Gemini API (gemini-2.5-flash)
- **Data**: localStorage
- **Deploy**: Vercel

## 로컬 실행

```bash
cd frontend
npm install
npm run dev
```

http://localhost:3000 에서 확인

## 환경변수

| 변수명 | 설명 |
|--------|------|
| GOOGLE_API_KEY | Google Gemini API Key (AI 팀매칭용) |

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 메인페이지 - 배너, 해커톤 카드, 팀 모집/랭킹 링크 |
| `/hackathons` | 해커톤 목록 - 카드 리스트, 상태 필터 |
| `/hackathons/:slug` | 해커톤 상세 - 개요, 팀, 평가, 상금, 일정, 제출, 리더보드 |
| `/camp` | 팀 모집 - AI 매칭 검색, 팀 리스트/생성 |
| `/rankings` | 글로벌 랭킹 |
| `/myteam` | 내 팀 관리 |
| `/signup` | 회원가입/로그인 |
