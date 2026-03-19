# DAKER 해커톤 플랫폼 Planning Document

> **Summary**: 해커톤 탐색, 팀 모집, 제출, 리더보드, AI 팀매칭을 제공하는 해커톤 플랫폼 웹서비스
>
> **Project**: DAKER
> **Author**: Team DAKER
> **Date**: 2026-03-16
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

"긴급 인수인계 해커톤" 과제로, 제공된 기능 명세서와 예시 데이터만을 기반으로 해커톤 플랫폼 웹서비스를 구현하고 Vercel에 배포한다.

### 1.2 Background

- 대회 규칙: 백엔드 없이 localStorage로 데이터 관리, Vercel 배포 필수
- 평가 기준: 기본 구현(30) + 확장 아이디어(30) + 완성도(25) + 문서(15) = 100점
- 바이브 코딩(AI 도구) 활용 개발 허용

### 1.3 Related Documents

- 기능 명세: `data/memo.png`, `data/memo_ocr.md`
- UI 흐름도: `data/Hackathon-UI-Flow.png`
- UI 흐름 스펙: `data/UI_FLOW_SPEC.md`
- 디자인 시스템 스펙: `data/FIGMA_AI_DESIGN_SPEC.md` (색상, 타이포, 컴포넌트 스타일)
- 예시 데이터: `data/예시자료/*.json` (hackathons, hackathon_detail, teams, leaderboard)
- 서비스 구조 설명: `docs/service-architecture.md`, `docs/service-architecture.html`
- TODO 리스트: `TODO-list.md`

---

## 2. Scope

### 2.1 In Scope

- [x] 공통 레이아웃 (네비게이션 바, 다크모드, 반응형)
- [x] 메인페이지 (`/`)
- [x] 해커톤 목록 (`/hackathons`) — 카드 리스트 + 필터
- [x] 해커톤 상세 (`/hackathons/:slug`) — 8개 탭
- [x] 팀원 모집 (`/camp`) — 팀 목록 + 생성
- [x] 글로벌 랭킹 (`/rankings`)
- [x] AI 팀매칭 검색형 (Track 1) — Gemini API 연동
- [x] 빈 상태 UI / 입력 검증 / 에러 처리
- [x] Vercel 배포

### 2.2 In Scope (Phase 2 — 확장 기능 추가분)

- [x] 유저 역할 시스템 (팀장/팀원/무소속 — localStorage 기반)
- [x] Camp 페이지 역할별 UI 분기 (팀장→"팀원 찾기", 무소속→"팀 찾기")
- [x] AI 매칭 역할별 분기 (role 파라미터에 따라 Gemini 프롬프트 분기)
- [x] 리더보드 디자인 개선 (Top 3 포디엄, 내 순위 하이라이트)
- [x] 팀 카드 프로그래스 바 (maxTeamSize 기반 인원 시각화) — 구현 완료

### 2.3 Out of Scope

- Track 2 AI 대화형 매칭 (시간 남으면 추가)
- 훈수 피드 (시간 남으면 추가)
- 실제 백엔드/DB 연동
- 사용자 인증/로그인

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| **공통** | | | |
| FR-01 | 네비게이션 바 (해커톤 목록 / Camp / Rankings 이동) | High | Pending |
| FR-02 | 다크모드 토글 (라이트/다크 전환) | High | Pending |
| FR-03 | 앱 최초 로드 시 예시 JSON → localStorage 자동 초기화 | High | Pending |
| **메인페이지** | | | |
| FR-04 | 배너 영역 클릭 → /hackathons 이동 | High | Pending |
| FR-05 | 팀 모집 바로가기 → /camp 이동 | High | Pending |
| FR-06 | 랭킹 바로가기 → /rankings 이동 | High | Pending |
| **해커톤 목록** | | | |
| FR-07 | 해커톤 카드 리스트 렌더링 (제목, 상태 뱃지, 태그, 기간) | High | Pending |
| FR-08 | 상태 필터 (진행중/종료/예정) | High | Pending |
| FR-09 | 태그 필터 | Medium | Pending |
| FR-10 | 카드 클릭 → /hackathons/:slug 이동 | High | Pending |
| FR-11 | 필터 결과 0건일 때 빈 상태 UI | High | Pending |
| **해커톤 상세** | | | |
| FR-12 | 탭 UI (개요/안내/평가/일정/상금/Teams/Submit/Leaderboard) | High | Pending |
| FR-13 | 개요 탭: summary + teamPolicy 표시 | High | Pending |
| FR-14 | 안내 탭: notice 목록 + rules/faq 링크 | High | Pending |
| FR-15 | 평가 탭: 평가 기준 + 제한사항 + 투표형일 때 가중치 표시 | High | Pending |
| FR-16 | 일정 탭: milestones 타임라인 | High | Pending |
| FR-17 | 상금 탭: 순위별 상금 표시 | High | Pending |
| FR-18 | Teams 탭: hackathonSlug로 팀 필터 + /camp 이동 링크 | High | Pending |
| FR-19 | Submit 탭: 제출 폼 (제목/파일or URL/메모) → localStorage 저장 | High | Pending |
| FR-20 | Submit 탭: 단계별 제출 UI (submissionItems 있을 경우) | Medium | Pending |
| FR-21 | Leaderboard 탭: 순위 테이블 + scoreBreakdown + 빈 상태 UI | High | Pending |
| **팀원 모집** | | | |
| FR-22 | 팀 카드 리스트 (팀명, 모집 상태, 인원, 분야, 소개) | High | Pending |
| FR-23 | hackathonSlug 쿼리 파라미터로 필터링 | High | Pending |
| FR-24 | 팀 만들기 폼 (팀이름 필수, 연락처 필수, 모집 분야, 인원) | High | Pending |
| FR-25 | 생성된 팀 localStorage 저장 | High | Pending |
| FR-26 | /hackathons/:slug ↔ /camp 상호 이동 | High | Pending |
| **랭킹** | | | |
| FR-27 | 글로벌 랭킹 테이블 (rank, 닉네임, points) | High | Pending |
| FR-28 | 기간 필터 (전체/월간/주간) | Medium | Pending |
| **AI 팀매칭 (Track 1)** | | | |
| FR-29 | /camp에 AI 검색창 UI | High | Pending |
| FR-30 | /api/match API Route — Gemini API 호출 | High | Pending |
| FR-31 | 추천 팀 + 추천 근거 표시 | High | Pending |
| FR-32 | AI 검색 로딩/에러/결과없음 상태 처리 | High | Pending |
| **유저 역할 시스템** | | | |
| FR-33 | 메인페이지 첫 방문 시 역할 선택 다이얼로그 (팀장/팀원/무소속) | High | Pending |
| FR-34 | localStorage에 userProfile 저장 (role, hackathonSlug, teamCode, teamName) | High | Pending |
| FR-35 | storage.ts에 getUserProfile() / setUserProfile() 헬퍼 | High | Pending |
| FR-36 | Navbar 또는 설정에서 역할 재선택 가능 | Medium | Pending |
| **Camp 역할별 분기** | | | |
| FR-37 | 팀장/팀원 → "팀원 찾기" 뷰 (예비 팀원 리스트) | High | Pending |
| FR-38 | 무소속 → "팀 찾기" 뷰 (모집 중인 팀 리스트, 현재와 유사) | High | Pending |
| FR-39 | 역할별 AI 버튼 텍스트/프롬프트 힌트 분기 | Medium | Pending |
| FR-40 | /api/match에 role 파라미터 추가, Gemini 프롬프트 역할별 분기 | High | Pending |
| **리더보드 개선** | | | |
| FR-41 | Top 3 포디엄 디자인 (금/은/동 아이콘 + 배경 + 크기 차등) | Medium | Pending |
| FR-42 | 내 팀 순위 하이라이트 행 (userProfile.teamName 기준) | Medium | Pending |
| FR-43 | 내 순위 요약 카드 (팀명, 순위, 점수, 상위 %) | Medium | Pending |
| **팀 카드 개선** | | | |
| FR-44 | Team에 maxTeamSize 필드 추가 | High | Done |
| FR-45 | 세그먼트 프로그래스 바 (인원 현황 시각화) | High | Done |
| FR-46 | 정원 마감 시 "정원 마감" 표시 | High | Done |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 사용성 | 동선이 직관적이고 가독성이 좋을 것 | 심사위원 체험 기준 |
| 안정성 | 오류/예외 시 서비스가 멈추지 않을 것 | 빈 상태 UI, 에러 핸들링 |
| 성능 | 페이지 로드 1초 이내, AI 검색 응답 5초 이내 | Vercel 배포 후 측정 |
| 반응형 | 모바일/태블릿/데스크톱 대응 | 디바이스별 확인 |
| 접근성 | 다크모드 지원, 적절한 명암비 | 시각적 확인 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 5개 페이지 모든 기능 동작 확인
- [ ] 모든 빈 상태/에러 상태 UI 처리 완료
- [ ] AI 팀매칭 검색 정상 동작
- [ ] 다크모드 전 페이지 정상 동작
- [ ] Vercel 배포 완료 + 외부 접속 확인
- [ ] 기획서 제출 완료

### 4.2 Quality Criteria

- [ ] 빌드 에러 없음
- [ ] 모바일/데스크톱 반응형 동작
- [ ] localStorage 초기화/복구 정상 동작
- [ ] 외부 링크 새 탭 열기 동작

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Gemini API 키 노출 | High | Low | API Route로 서버 경유, 환경변수로 관리 |
| Gemini API 호출 실패/지연 | Medium | Medium | 에러 UI 표시 + 일반 팀 목록은 유지 |
| localStorage 용량 초과 | Low | Low | 예시 데이터 4종만 저장, 용량 작음 |
| localStorage 데이터 손상 | Medium | Low | 무결성 검사 후 자동 재초기화 |
| 심사자 환경에서 API 키 없이 접속 | High | High | Gemini API 키는 Vercel 환경변수로 설정, 심사자는 별도 키 불필요 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure (`components/`, `lib/`, `types/`) | Static sites, portfolios, landing pages | ✅ |
| **Dynamic** | Feature-based modules, services layer | Web apps with backend, SaaS MVPs | ☐ |
| **Enterprise** | Strict layer separation, DI, microservices | High-traffic systems, complex architectures | ☐ |

> Starter 선택 이유: 백엔드 없이 localStorage만 사용하는 프론트엔드 중심 프로젝트. 5개 페이지 + API Route 1개로 구조가 단순함.

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | Next.js / React / Vue | **Next.js (App Router)** | Vercel 배포 최적화, API Route 지원 |
| State Management | Context / Zustand / localStorage | **React state + localStorage** | 별도 상태 라이브러리 불필요한 규모 |
| Styling | Tailwind / CSS Modules | **Tailwind + shadcn/ui** | 빠른 개발, 일관된 컴포넌트 |
| Dark Mode | next-themes / custom | **next-themes** | 간편한 테마 전환 |
| AI API | Gemini / OpenAI | **Gemini API** | 프로젝트 요구사항 |
| Data Storage | localStorage / IndexedDB | **localStorage** | 대회 규칙, 단순한 구조 |

### 6.3 Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 공통 레이아웃 (네비게이션, 다크모드)
│   ├── page.tsx                  # 메인페이지 (/)
│   ├── hackathons/
│   │   ├── page.tsx              # 해커톤 목록
│   │   └── [slug]/
│   │       └── page.tsx          # 해커톤 상세
│   ├── camp/
│   │   └── page.tsx              # 팀원 모집
│   ├── rankings/
│   │   └── page.tsx              # 글로벌 랭킹
│   └── api/
│       └── match/
│           └── route.ts          # AI 팀매칭 API Route
├── components/                   # 공통/재사용 컴포넌트
│   ├── ui/                       # shadcn/ui 컴포넌트
│   ├── layout/                   # Navbar, Footer 등
│   ├── hackathon/                # 해커톤 관련 (카드, 탭, 필터)
│   ├── camp/                     # 팀 관련 (카드, 폼, AI 검색)
│   └── common/                   # EmptyState, Loading 등
├── lib/                          # 유틸리티
│   ├── storage.ts                # localStorage CRUD 헬퍼
│   ├── init-data.ts              # 예시 JSON → localStorage 초기화
│   └── types.ts                  # TypeScript 타입 정의
└── data/                         # 초기화용 예시 데이터 (import용)
```

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- [x] `CLAUDE.md` has coding conventions section
- [ ] ESLint configuration (`.eslintrc.*`) — 프로젝트 초기화 시 생성
- [ ] Prettier configuration (`.prettierrc`) — 프로젝트 초기화 시 생성
- [ ] TypeScript configuration (`tsconfig.json`) — 프로젝트 초기화 시 생성

### 7.2 Conventions to Define

| Category | To Define | Priority |
|----------|-----------|:--------:|
| **Naming** | 컴포넌트: PascalCase, 파일: kebab-case, 변수: camelCase | High |
| **Folder structure** | 위 6.3 구조 따름 | High |
| **Import order** | react → next → 외부 → 내부 → 스타일 | Medium |
| **Environment variables** | `GEMINI_API_KEY` (서버 전용) | High |
| **Error handling** | 빈 상태 UI 컴포넌트 통일, try-catch로 API 에러 처리 | Medium |

### 7.3 Environment Variables

| Variable | Purpose | Scope |
|----------|---------|-------|
| `GEMINI_API_KEY` | Gemini API 인증 | Server only |

---

## 8. 시스템 구성

백엔드 없이 브라우저(localStorage)가 DB 역할을 하며, 유일한 서버 로직은 AI 매칭용 API Route 하나다.

```
브라우저 (Client)
├── Next.js App Router ─ 페이지 렌더링, 라우팅
├── Tailwind + shadcn/ui ─ 스타일링
├── next-themes ─ 다크모드
└── localStorage ─ 데이터 저장/조회
       │  hackathons, teams, submissions, leaderboards
       │
       │  AI 검색 요청만 서버로 전송
       ▼
/api/match (Vercel 서버리스 함수) → Gemini API
```

---

## 9. 페이지 구성

### 9.1 메인페이지 (`/`)
- 서비스 배너, 주요 페이지 바로가기
- 배너 클릭 → `/hackathons`, 팀 모집 버튼 → `/camp`, 랭킹 버튼 → `/rankings`

### 9.2 해커톤 목록 (`/hackathons`)
- 해커톤 카드 리스트 (제목, 상태, 태그, 기간)
- 상태/태그 필터로 목록 좁히기, 카드 클릭 → `/hackathons/:slug`

### 9.3 해커톤 상세 (`/hackathons/:slug`)
- 탭으로 나뉜 8개 섹션 (개요, 안내, 평가, 일정, 상금, Teams, Submit, Leaderboard)
- Teams 탭에서 `/camp`으로 이동, Submit 탭에서 제출물 localStorage 저장, Leaderboard 탭에서 순위 확인

### 9.4 팀원 모집 (`/camp`)
- 해커톤별 팀 카드 (팀명, 모집 여부, 인원, 모집 분야, 연락처)
- 팀 만들기 폼, AI 검색창에 자연어 입력 → 팀 추천 결과 표시

### 9.5 랭킹 (`/rankings`)
- 전체 해커톤 통합 순위 테이블 (rank, 닉네임, points), 기간 필터

### 9.6 페이지 연결 관계
```
/  ──→  /hackathons  ──→  /hackathons/:slug
│                              ↕ (Teams탭 ↔ Camp)
├──→  /camp ←──────────────────┘
└──→  /rankings
네비게이션 바에서 /hackathons, /camp, /rankings 어디서든 이동 가능
```

---

## 10. 핵심 기능 명세

### 10.1 공통

| 기능 | 입력 → 동작 → 결과 |
|------|-------------------|
| 네비게이션 | 메뉴 항목 클릭 → 해당 경로로 라우팅 → 페이지 이동 |
| 다크모드 | 토글 버튼 클릭 → next-themes 테마 전환 → 화면 전체 라이트/다크 전환 |
| 데이터 초기화 | 앱 최초 로드 → localStorage 비어있으면 예시 JSON 복사 → 4개 키 세팅 |

### 10.2 메인페이지

| 기능 | 입력 → 동작 → 결과 |
|------|-------------------|
| 배너 이동 | 배너 클릭 → `/hackathons` 라우팅 → 해커톤 목록 표시 |
| 팀 모집 바로가기 | 버튼 클릭 → `/camp` 라우팅 → 팀원 모집 페이지 표시 |
| 랭킹 바로가기 | 버튼 클릭 → `/rankings` 라우팅 → 글로벌 랭킹 표시 |

### 10.3 해커톤 목록

| 기능 | 입력 → 동작 → 결과 |
|------|-------------------|
| 목록 렌더링 | 페이지 진입 → localStorage hackathons 읽기 → 카드 리스트 표시 |
| 상태 필터 | 필터 버튼 클릭 → status 값으로 필터링 → 해당 상태만 표시 |
| 태그 필터 | 태그 선택 → tags 배열 포함 여부 필터링 → 해당 태그만 표시 |
| 카드 클릭 | 카드 클릭 → `/hackathons/${slug}` 라우팅 → 상세 페이지 표시 |
| 빈 상태 | 필터 결과 0건 → "조건에 맞는 해커톤이 없습니다." + 필터 초기화 버튼 |

### 10.4 해커톤 상세

| 기능 | 입력 → 동작 → 결과 |
|------|-------------------|
| 탭 전환 | 탭 버튼 클릭 → 섹션 콘텐츠 교체 → 해당 탭 내용 표시 |
| 개요 | 탭 진입 → overview 데이터 읽기 → summary + teamPolicy 표시 |
| 안내 | 탭 진입 → info 데이터 읽기 → notice 목록 + 규정/FAQ 링크 표시 |
| 평가 | 탭 진입 → eval 데이터 읽기 → 평가 기준 + 제한사항 표시 (투표형이면 가중치 표시) |
| 일정 | 탭 진입 → schedule 데이터 읽기 → milestones 타임라인 표시 |
| 상금 | 탭 진입 → prize 데이터 읽기 → 순위별 상금 표시 |
| Teams | 탭 진입 → teams에서 hackathonSlug 필터 → 팀 목록 표시 + /camp 이동 버튼 |
| Submit | 제목/파일or URL/메모 입력 후 제출 클릭 → localStorage submissions 저장 → "제출 완료" 확인 |
| Leaderboard | 탭 진입 → leaderboards에서 해당 slug 읽기 → 순위 테이블 표시 (없으면 빈 상태 UI) |

### 10.5 팀원 모집

| 기능 | 입력 → 동작 → 결과 |
|------|-------------------|
| 팀 목록 | 페이지 진입 → localStorage teams 읽기 → 팀 카드 리스트 표시 |
| 해커톤 필터 | ?hackathon=slug 또는 드롭다운 → hackathonSlug 필터링 → 해당 해커톤 팀만 표시 |
| 팀 만들기 | 폼 작성(팀명 필수, 연락처 필수, 분야, 인원) → localStorage teams에 추가 → 새 팀 카드 표시 |
| 연락하기 | 버튼 클릭 → contact.url로 새 탭 열기 → 외부 링크 이동 |
| 빈 상태 | 팀 0건 → "아직 등록된 팀이 없습니다." + 팀 만들기 버튼 |

### 10.6 랭킹

| 기능 | 입력 → 동작 → 결과 |
|------|-------------------|
| 랭킹 표시 | 페이지 진입 → leaderboards 전체 합산/정렬 → 글로벌 순위 테이블 표시 |
| 기간 필터 | 전체/월간/주간 버튼 클릭 → submittedAt 기준 필터링 → 해당 기간 순위 표시 |

### 10.7 AI 팀매칭 (Track 1)

| 기능 | 입력 → 동작 → 결과 |
|------|-------------------|
| AI 검색 | 자연어 입력 + 검색 클릭 → POST /api/match (query + teams + role) → 서버에서 Gemini 호출 → 추천 팀/팀원 + 근거 표시 |
| 역할별 분기 | role이 leader/member → 무소속 유저 풀에서 매칭 / role이 unaffiliated → 모집 중인 팀에서 매칭 |
| 빈 입력 | 빈 검색어로 검색 → "검색어를 입력해주세요." 표시 |
| API 실패 | 네트워크/서버 에러 → "AI 검색에 실패했습니다." 표시 + 일반 팀 목록 유지 |
| 결과 없음 | Gemini가 매칭 못 함 → "조건에 맞는 팀을 찾지 못했습니다." 표시 |

### 10.8 유저 역할 시스템

| 기능 | 입력 → 동작 → 결과 |
|------|-------------------|
| 역할 선택 | 첫 방문 시 다이얼로그 → 팀장/팀원/무소속 선택 → localStorage userProfile 저장 |
| 팀장 선택 | 팀장 선택 → 해커톤 선택 → 본인 팀 선택 → profile에 role + hackathonSlug + teamCode 저장 |
| 팀원 선택 | 팀원 선택 → 해커톤 선택 → 소속 팀 선택 → profile에 저장 |
| 무소속 선택 | 무소속 선택 → role만 저장 |
| 역할 변경 | Navbar/설정에서 재선택 → 다이얼로그 다시 표시 → profile 업데이트 |

### 10.9 Camp 역할별 분기

| 기능 | 입력 → 동작 → 결과 |
|------|-------------------|
| 팀장/팀원 뷰 | Camp 접근 → userProfile.role 확인 → "팀원 찾기" 제목 + 예비 팀원 리스트 표시 + AI 버튼 "AI로 팀원 찾기" |
| 무소속 뷰 | Camp 접근 → role이 unaffiliated → "팀 찾기" 제목 + 모집 중인 팀 리스트 표시 + AI 버튼 "AI로 팀 찾기" |
| 팀 만들기 | 무소속만 표시, 팀장/팀원은 숨김 (이미 소속) |

### 10.10 리더보드 개선

| 기능 | 입력 → 동작 → 결과 |
|------|-------------------|
| Top 3 포디엄 | 리더보드 진입 → 상위 3팀을 별도 카드로 분리 표시 (금/은/동 아이콘 + 크기 차등) |
| 내 순위 하이라이트 | 리더보드 진입 → userProfile.teamName과 일치하는 행 강조 색상 표시 |
| 내 순위 요약 | 리더보드 상단에 내 팀 순위/점수/상위 % 요약 카드 표시 |

---

## 11. 주요 사용 흐름

**흐름 1 — 해커톤 탐색**: 메인 접속 → 배너 클릭 → /hackathons → 필터로 찾기 → 카드 클릭 → /hackathons/:slug → 탭 전환하며 상세 확인

**흐름 2 — 팀 합류**: 해커톤 상세 Teams 탭 → "팀 보기" 클릭 → /camp → 모집중인 팀 확인 → "연락하기" 클릭 → 외부 링크로 연락

**흐름 3 — AI로 팀 찾기**: /camp → AI 검색창에 자연어 입력 → 검색 → 추천 팀 + 근거 확인 → "연락하기"

**흐름 4 — 팀 만들기**: /camp → "팀 만들기" → 폼 작성 → 생성 → 팀 목록에 즉시 반영

**흐름 5 — 제출**: /hackathons/:slug Submit 탭 → 가이드 확인 → 폼 작성 → 제출 → localStorage 저장

**흐름 6 — 순위 확인**: Leaderboard 탭 또는 /rankings → 순위 테이블 확인 → 기간 필터 조정

**흐름 7 — 첫 방문 역할 설정**: 메인 최초 접속 → 역할 선택 다이얼로그 → 팀장/팀원/무소속 선택 → (팀장/팀원이면) 해커톤 + 팀 선택 → 프로필 저장 → Camp 등에서 역할별 UI 적용

**흐름 8 — 팀장이 팀원 찾기**: 역할이 팀장 → /camp 접속 → "팀원 찾기" 뷰 → AI 검색 "Python 백엔드 경험자 찾아줘" → 추천 결과 확인 → 연락

---

## 12. 예외 상황 처리

**빈 데이터**: 모든 목록/테이블에 빈 상태 UI를 제공한다. 팀이 없을 때는 "팀 만들기" 버튼을, 필터 결과가 없을 때는 "필터 초기화" 버튼을 함께 표시하여 다음 행동으로 유도한다.

**잘못된 접근**: 존재하지 않는 slug로 접속하면 "해커톤을 찾을 수 없습니다." + 목록 돌아가기 링크를 표시한다.

**입력 오류**: 필수값(팀 이름, 연락처, 제출 제목 등) 미입력 시 인라인 에러 메시지를 표시하고 제출 버튼을 비활성화한다. 허용되지 않는 파일 타입이면 해당 해커톤의 허용 타입을 안내한다.

**AI 검색 관련**: 빈 입력 시 안내 메시지, API 실패 시 에러 표시하되 일반 팀 목록은 유지, 매칭 결과 없으면 검색어 변경 안내를 한다.

**데이터 손상**: localStorage가 비어있거나 손상되면 예시 JSON으로 자동 재초기화한다.

---

## 13. 개발 및 개선 계획

### 13.1 Phase별 계획

**Phase 1 — 기본 구현 (최우선)**
1. 프로젝트 초기화 + 공통 레이아웃 + 데이터 초기화
2. 해커톤 목록 + 상세 (8개 탭)
3. 팀원 모집 + 랭킹
4. 빈 상태 UI + 입력 검증 → Vercel 배포

**Phase 2 — 확장 기능**
1. Track 1: AI 팀매칭 검색형 (/api/match + Gemini + UI) — 구현 완료
2. 유저 역할 시스템 (팀장/팀원/무소속 선택 + localStorage 저장)
3. Camp 역할별 UI 분기 (팀장→팀원 찾기, 무소속→팀 찾기)
4. AI 매칭 역할별 프롬프트 분기

**Phase 3 — 완성도 개선**
- 리더보드 Top 3 포디엄 디자인 (금/은/동 카드)
- 리더보드 내 순위 하이라이트 + 요약 카드
- 팀 카드 프로그래스 바 — 구현 완료
- 메인페이지 진행 중 해커톤 카드 표시 — 구현 완료
- 스켈레톤 로딩 UI, D-day 뱃지, 토스트 알림
- 모집 마감 팀 흐리게 처리, 모집중 팀 상단 정렬
- localStorage 무결성 검사, 이미지 lazy loading
- 디자인 시스템 적용 (FIGMA_AI_DESIGN_SPEC.md 기반 색상/타이포 통일)

**Phase 4 — 추가 확장 (시간 남으면)**
- 훈수 피드 (프로젝트 쇼케이스 + 리뷰/조언 + 좋아요)
- Track 2: AI 대화형 매칭

**Phase 5 — 문서**
- 기획서 (1차 제출), 솔루션 PDF (최종 제출)

### 13.2 우선순위

| 순위 | 항목 | 배점 연관 | 상태 |
|------|------|----------|------|
| 1 | Phase 1 기본 구현 | 기본 구현 30점 | ✅ 완료 |
| 2 | Track 1 AI 검색형 | 확장 30점 핵심 | ✅ 완료 |
| 3 | 팀 카드 프로그래스 바 | 완성도 25점 | ✅ 완료 |
| 4 | 메인페이지 해커톤 카드 개선 | 완성도 25점 | ✅ 완료 |
| 5 | 유저 역할 시스템 | 확장 30점 핵심 | 🔜 다음 |
| 6 | Camp 역할별 분기 + AI 분기 | 확장 30점 | 🔜 다음 |
| 7 | 리더보드 포디엄 + 내 순위 | 완성도 25점 | 🔜 다음 |
| 8 | 디자인 시스템 통일 | 완성도 25점 | 대기 |
| 9 | 빈 상태/에러 처리 점검 | 완성도 25점 | 대기 |
| 10 | 훈수 피드 | 확장 30점 보강 | 시간 남으면 |
| 11 | Track 2 대화형 | 확장 30점 | 시간 남으면 |
| 12 | 문서/PDF | 문서 15점 | 병행 작성 |

### 13.3 일정 (업데이트)

```
Day 1~3     Phase 1 기본 구현 + Track 1 AI 매칭 ── ✅ 완료
Day 3       팀 카드 프로그래스 바 + 메인페이지 개선 ── ✅ 완료 (팀원)
            ── 기본 구현 + 핵심 확장 완료 ──
Day 4       유저 역할 시스템 + Camp 역할별 분기
Day 5       AI 매칭 역할 분기 + 리더보드 포디엄/내 순위
Day 6       디자인 시스템 통일 + UX 개선 + Vercel 배포
Day 7       기획서 정리 + 솔루션 PDF 작성
```

### 13.4 역할 분담 (팀원 jjh 작업 반영)

| 담당 | 완료한 작업 | 다음 작업 |
|------|-----------|----------|
| **jjh** | 메인페이지 개선, 팀 카드 프로그래스 바, TODO-list 작성, 디자인 스펙 문서 | 유저 역할 시스템, 리더보드 개선 (TODO-list 기준) |
| **jdj** | 전체 기본 구현 (5개 페이지 + AI), Plan/Design 문서 | 위 작업과 겹치지 않는 영역 |

---

## 14. 화면 설명용 문구

| 페이지 | 문구 |
|--------|------|
| 메인 | "다양한 해커톤에 참가하고, 팀을 만들고, 실력을 겨뤄보세요." |
| 해커톤 목록 | "진행 중인 해커톤을 확인하고 참가해보세요." |
| 해커톤 상세 | (해커톤 제목 + summary 동적 표시) |
| 팀원 모집 | "함께할 팀원을 찾거나, 새로운 팀을 만들어보세요." |
| 랭킹 | "전체 해커톤을 아우르는 글로벌 랭킹입니다." |
| AI 검색 영역 | "AI에게 원하는 조건을 말해보세요. 딱 맞는 팀을 찾아드립니다." |

---

## 15. 페이지 항목 구성

### 메인 (`/`)
- 네비게이션 바
- Hero 배너 ("아이디어를 현실로. 함께 만드는 혁신") + "해커톤 둘러보기" / "랭킹 보기" 버튼
- 진행 중인 해커톤 카드 섹션 (총 상금, 마감일, 참가 팀 수 표시)
- "모든 해커톤 보기" 버튼
- 첫 방문 시 역할 선택 다이얼로그 오버레이

### 해커톤 목록 (`/hackathons`)
- 페이지 제목 + 설명 문구
- 필터 바: 상태 버튼(진행중/종료/예정) + 태그 드롭다운
- 해커톤 카드 그리드 (썸네일, 제목, 상태 뱃지, 태그 칩, 기간)
- 빈 상태 UI

### 해커톤 상세 (`/hackathons/:slug`)
- 해커톤 제목 + 상태 뱃지
- 탭 바 (개요/안내/평가/일정/상금/Teams/Submit/Leaderboard)
- 탭 콘텐츠 영역 (탭별 상세 내용)

### 팀원 모집 (`/camp`) — 역할별 분기
- 페이지 제목: 팀장/팀원 → "팀원 찾기" / 무소속 → "팀 찾기"
- AI 검색창 (역할별 버튼 텍스트/힌트 분기) + 추천 결과 영역
- 해커톤 필터 드롭다운
- 팀장/팀원 → 예비 팀원 리스트 / 무소속 → 모집 중인 팀 카드 그리드
- 팀 카드: 팀명, 모집 상태, 프로그래스 바(인원 현황), 분야, 소개, 연락하기
- 팀 만들기 버튼 (무소속만 표시) → 폼 (팀이름, 연락처, 모집 분야, 인원, maxTeamSize)
- 빈 상태 UI

### 글로벌 랭킹 (`/rankings`)
- 페이지 제목 + 설명 문구
- 내 순위 요약 카드 (팀명, 순위, 점수, 상위 %)
- Top 3 포디엄 카드 (금/은/동 아이콘 + 크기 차등)
- 기간 필터 버튼 (전체/월간/주간)
- 랭킹 테이블 (순위, 닉네임, 포인트) — 내 팀 행 하이라이트
- 빈 상태 UI

---

## Next Steps

1. [x] Design 문서 작성 (`daker-platform.design.md`) — 완료
2. [x] 프로젝트 초기화 및 기본 구현 — 완료
3. [ ] 유저 역할 시스템 구현
4. [ ] Camp 역할별 분기 + AI 분기 구현
5. [ ] 리더보드 포디엄 + 내 순위 구현
6. [ ] 디자인 시스템 통일 (FIGMA_AI_DESIGN_SPEC 기반)
7. [ ] Vercel 배포
8. [ ] 기획서 + 솔루션 PDF 작성

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-16 | Initial draft — 전체 기능 명세, 시스템 구성, 사용 흐름, 개발 계획 포함 | Team DAKER |
| 0.2 | 2026-03-19 | 팀원(jjh) 작업 반영 — 유저 역할 시스템, Camp 역할 분기, 리더보드 개선, 팀 카드 프로그래스 바, 메인페이지 개선, 디자인 스펙 문서 추가 | Team DAKER |
