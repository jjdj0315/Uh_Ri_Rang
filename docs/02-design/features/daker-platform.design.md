# DAKER 해커톤 플랫폼 Design Document

> **Summary**: 해커톤 탐색, 팀 모집, 제출, 리더보드, AI 팀매칭을 제공하는 해커톤 플랫폼의 상세 설계
>
> **Project**: DAKER
> **Author**: Team DAKER
> **Date**: 2026-03-16
> **Status**: Draft
> **Planning Doc**: [daker-platform.plan.md](../../01-plan/features/daker-platform.plan.md)

---

## 1. Overview

### 1.1 Design Goals

- 5개 페이지와 AI 팀매칭이 매끄럽게 동작하는 해커톤 플랫폼 구현
- localStorage만으로 데이터 CRUD를 처리하되, 실제 서비스처럼 자연스러운 UX 제공
- 심사자가 별도 설정 없이 Vercel URL에서 모든 기능을 체험 가능하게 구성

### 1.2 Design Principles

- **단순함 우선**: Starter 레벨에 맞는 단순한 폴더 구조, 최소 의존성
- **데이터 중심**: 예시 JSON 구조를 그대로 살려서 타입 정의 → 컴포넌트가 데이터를 렌더링하는 흐름
- **빈 상태 대응**: 모든 목록/테이블에 빈 상태 UI를 반드시 포함
- **실패 허용**: AI 검색 실패 시에도 일반 기능은 정상 동작

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    브라우저 (Client)                       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Next.js App Router                              │    │
│  │  app/layout.tsx ── Navbar + ThemeProvider        │    │
│  │  ├── app/page.tsx                    (/)        │    │
│  │  ├── app/hackathons/page.tsx         (목록)     │    │
│  │  ├── app/hackathons/[slug]/page.tsx  (상세)     │    │
│  │  ├── app/camp/page.tsx               (팀 모집)  │    │
│  │  └── app/rankings/page.tsx           (랭킹)     │    │
│  └──────────────────────┬──────────────────────────┘    │
│                         │ 읽기/쓰기                      │
│  ┌──────────────────────▼──────────────────────────┐    │
│  │ lib/storage.ts (localStorage 헬퍼)              │    │
│  │  hackathons | teams | submissions | leaderboards│    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────┘
                          │ POST /api/match (AI 검색만)
                          ▼
               ┌─────────────────────┐
               │ app/api/match/      │
               │   route.ts          │
               │ (Vercel Serverless) │
               └──────────┬──────────┘
                          │ GEMINI_API_KEY
                          ▼
               ┌─────────────────────┐
               │    Gemini API       │
               └─────────────────────┘
```

### 2.2 Data Flow

```
앱 로드 → localStorage 확인 → 비어있으면 예시 JSON 초기화
                              → 있으면 바로 읽기
페이지 진입 → lib/storage.ts로 데이터 읽기 → React state → 렌더링
사용자 액션 → lib/storage.ts로 데이터 쓰기 → state 갱신 → 리렌더링
AI 검색 → fetch('/api/match') → 서버에서 Gemini 호출 → 결과 렌더링
```

### 2.3 Dependencies

| Package | Purpose | Version |
|---------|---------|---------|
| `next` | App Router 프레임워크 | ^15 |
| `react` / `react-dom` | UI 라이브러리 | ^19 |
| `tailwindcss` | 유틸리티 CSS | ^4 |
| `@shadcn/ui` | UI 컴포넌트 (Button, Card, Tabs, Dialog, Input, Select, Badge...) | latest |
| `next-themes` | 다크모드 | ^0.4 |
| `@google/generative-ai` | Gemini API SDK (서버 전용) | latest |
| `lucide-react` | 아이콘 | latest |

---

## 3. Data Model

### 3.1 TypeScript 타입 정의

```typescript
// ============ Hackathon ============

interface Hackathon {
  slug: string;
  title: string;
  status: "ongoing" | "ended" | "upcoming";
  tags: string[];
  thumbnailUrl: string;
  period: {
    timezone: string;
    submissionDeadlineAt: string; // ISO 8601
    endAt: string;
  };
  links: {
    detail: string;
    rules: string;
    faq: string;
  };
}

interface HackathonDetail {
  slug: string;
  title: string;
  sections: {
    overview: {
      summary: string;
      teamPolicy: {
        allowSolo: boolean;
        maxTeamSize: number;
      };
    };
    info: {
      notice: string[];
      links: { rules: string; faq: string };
    };
    eval: {
      metricName: string;
      description: string;
      scoreSource?: "vote";          // 투표형일 때만 존재
      scoreDisplay?: {
        label: string;
        breakdown: { key: string; label: string; weightPercent: number }[];
      };
      limits?: {
        maxRuntimeSec?: number;
        maxSubmissionsPerDay?: number;
      };
    };
    schedule: {
      timezone: string;
      milestones: { name: string; at: string }[];
    };
    prize: {
      items: { place: string; amountKRW: number }[];
    };
    teams: {
      campEnabled: boolean;
      listUrl: string;
    };
    submit: {
      allowedArtifactTypes: string[];   // "zip" | "text" | "url" | "pdf"
      submissionUrl: string;
      guide: string[];
      submissionItems?: {               // 단계별 제출일 때
        key: string;
        title: string;
        format: string;
      }[];
    };
    leaderboard: {
      publicLeaderboardUrl: string;
      note: string;
    };
  };
}

// ============ Team ============

interface Team {
  teamCode: string;
  hackathonSlug: string;
  name: string;
  isOpen: boolean;
  memberCount: number;
  lookingFor: string[];
  intro: string;
  contact: {
    type: "link" | "email";
    url: string;
  };
  createdAt: string;
}

// ============ Submission ============

interface Submission {
  id: string;                          // crypto.randomUUID()
  hackathonSlug: string;
  title: string;
  artifactType: string;                // "zip" | "url" | "pdf" | "text"
  artifactValue: string;               // 파일명 또는 URL
  notes?: string;
  submittedAt: string;
  // 단계별 제출일 때
  submissionItems?: {
    key: string;                       // "plan" | "web" | "pdf"
    value: string;
  }[];
}

// ============ Leaderboard ============

interface LeaderboardData {
  hackathonSlug: string;
  updatedAt: string;
  entries: LeaderboardEntry[];
}

interface LeaderboardEntry {
  rank: number;
  teamName: string;
  score: number;
  submittedAt: string;
  scoreBreakdown?: Record<string, number>;  // { participant: 82, judge: 90 }
  artifacts?: {
    webUrl?: string;
    pdfUrl?: string;
    planTitle?: string;
  };
}

// ============ AI Match ============

interface MatchRequest {
  query: string;
  hackathonSlug?: string;
}

interface MatchResponse {
  matches: {
    teamCode: string;
    teamName: string;
    reason: string;
    score: number;
  }[];
}
```

### 3.2 Entity Relationships

```
[Hackathon] 1 ──── N [HackathonDetail]  (slug로 연결, 1:1 매핑)
     │
     └── slug ──── N [Team]             (hackathonSlug로 필터)
     │
     └── slug ──── N [Submission]       (hackathonSlug로 필터)
     │
     └── slug ──── 1 [LeaderboardData]  (hackathonSlug로 매칭)
```

### 3.3 localStorage Schema

| Key | Type | 초기 데이터 소스 |
|-----|------|-----------------|
| `hackathons` | `Hackathon[]` | `public_hackathons.json` |
| `hackathonDetails` | `HackathonDetail[]` | `public_hackathon_detail.json` (본체 + extraDetails 합침) |
| `teams` | `Team[]` | `public_teams.json` |
| `submissions` | `Submission[]` | `[]` (빈 배열) |
| `leaderboards` | `LeaderboardData[]` | `public_leaderboard.json` (본체 + extraLeaderboards 합침) |

---

## 4. API Specification

### 4.1 Endpoint List

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/match` | AI 팀매칭 검색 | 불필요 |

이 프로젝트에서 서버 API는 이것 하나뿐이다. 나머지는 전부 localStorage 직접 접근.

### 4.2 POST /api/match

**Request:**
```json
{
  "query": "React 프론트 개발자 있는 팀 찾아줘",
  "hackathonSlug": "aimers-8-model-lite"
}
```

**Response (200 OK):**
```json
{
  "matches": [
    {
      "teamCode": "T-ALPHA",
      "teamName": "Team Alpha",
      "reason": "Backend, ML Engineer를 모집 중이며 React 경험이 있는 프론트엔드 개발자와 시너지가 기대됩니다.",
      "score": 0.85
    }
  ]
}
```

**Error Response (500):**
```json
{
  "error": "AI 검색에 실패했습니다. 잠시 후 다시 시도해주세요."
}
```

**서버 로직 (route.ts):**
1. request body에서 `query`, `hackathonSlug` 추출
2. `teams` 데이터를 body에서 받거나, 클라이언트에서 함께 전송
3. Gemini API에 프롬프트 전송:
   - 시스템: "너는 해커톤 팀 매칭 전문가다. 주어진 팀 목록에서 사용자 조건에 맞는 팀을 추천하고 근거를 설명해라. JSON으로 응답해라."
   - 사용자: `query` + `teams` JSON
4. Gemini 응답을 파싱하여 `MatchResponse` 형태로 반환
5. 실패 시 500 에러 반환

---

## 5. UI/UX Design

### 5.1 공통 레이아웃

```
┌─────────────────────────────────────────────┐
│  [DAKER 로고]   해커톤  Camp  Rankings [🌙] │ ← Navbar
├─────────────────────────────────────────────┤
│                                             │
│              Page Content                   │
│                                             │
└─────────────────────────────────────────────┘
```

### 5.2 메인페이지 (`/`)

```
┌─────────────────────────────────────────────┐
│  Navbar                                     │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │         Hero 배너 영역               │    │
│  │   "다양한 해커톤에 참가하고,         │    │
│  │    팀을 만들고, 실력을 겨뤄보세요"   │    │
│  │         [해커톤 보러가기 →]          │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌──────────────┐  ┌──────────────┐         │
│  │ 🏆 팀 모집    │  │ 📊 랭킹 보기  │         │
│  │ 함께할 팀원을 │  │ 글로벌 순위를 │         │
│  │ 찾아보세요    │  │ 확인하세요    │         │
│  │  [→ /camp]   │  │ [→ /rankings]│         │
│  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────┘
```

### 5.3 해커톤 목록 (`/hackathons`)

```
┌─────────────────────────────────────────────┐
│  Navbar                                     │
├─────────────────────────────────────────────┤
│  해커톤 목록                                 │
│  "진행 중인 해커톤을 확인하고 참가해보세요"   │
│                                             │
│  [전체] [진행중] [종료] [예정]   태그: [▼]  │
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ 썸네일    │ │ 썸네일    │ │ 썸네일    │    │
│  │ 제목      │ │ 제목      │ │ 제목      │    │
│  │ [진행중]  │ │ [종료]    │ │ [예정]    │    │
│  │ LLM vLLM │ │ Idea Web │ │ Vibe Web │    │
│  │ ~02.26   │ │ ~03.09   │ │ ~04.27   │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│                                             │
│  (필터 결과 없을 때)                         │
│  "조건에 맞는 해커톤이 없습니다."             │
│  [필터 초기화]                               │
└─────────────────────────────────────────────┘
```

### 5.4 해커톤 상세 (`/hackathons/:slug`)

```
┌─────────────────────────────────────────────┐
│  Navbar                                     │
├─────────────────────────────────────────────┤
│  해커톤 제목                     [진행중]    │
├─────────────────────────────────────────────┤
│  [개요][안내][평가][일정][상금]              │
│  [Teams][Submit][Leaderboard]               │
├─────────────────────────────────────────────┤
│                                             │
│  (개요 탭 예시)                              │
│  대회 설명 텍스트...                         │
│  ┌────────────────────────────┐             │
│  │ 팀 정책                     │             │
│  │ 솔로 참가: 허용             │             │
│  │ 최대 팀 인원: 5명           │             │
│  └────────────────────────────┘             │
│                                             │
│  (Submit 탭 예시)                            │
│  제출 가이드:                                │
│  • 제출물은 규정에 맞는 단일 zip 파일...     │
│  허용 타입: [zip]                            │
│  ┌────────────────────────────┐             │
│  │ 제목:  [____________]       │             │
│  │ 파일:  [파일 선택] or URL   │             │
│  │ 메모:  [____________]       │             │
│  │        [제출하기]           │             │
│  └────────────────────────────┘             │
│                                             │
│  (Leaderboard 탭 - 빈 상태)                 │
│  "아직 리더보드가 없습니다."                  │
└─────────────────────────────────────────────┘
```

### 5.5 팀원 모집 (`/camp`)

```
┌─────────────────────────────────────────────┐
│  Navbar                                     │
├─────────────────────────────────────────────┤
│  팀원 모집                                   │
│  "함께할 팀원을 찾거나, 새 팀을 만들어보세요" │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ 🤖 AI에게 원하는 조건을 말해보세요   │    │
│  │ [Python BE인데 기획자 있는 팀...]    │    │
│  │                         [AI 검색]   │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  (AI 추천 결과)                              │
│  ┌─ AI 추천 ──────────────────────────┐     │
│  │ Team Alpha              매칭 85%   │     │
│  │ "Backend, ML 모집 중이며..."        │     │
│  │                       [연락하기]    │     │
│  └─────────────────────────────────────┘    │
│                                             │
│  해커톤: [전체 ▼]              [+ 팀 만들기] │
│                                             │
│  ┌──────────────┐  ┌──────────────┐         │
│  │ Team Alpha   │  │ PromptRunners│         │
│  │ 모집중 ✅    │  │ 모집중 ✅     │         │
│  │ 3/5명       │  │ 1/5명        │         │
│  │ Backend, ML │  │ FE, Designer │         │
│  │ [연락하기]   │  │ [연락하기]    │         │
│  └──────────────┘  └──────────────┘         │
│                                             │
│  ── 팀 만들기 모달 ──                        │
│  ┌─────────────────────────────────────┐    │
│  │ 팀 이름*:    [____________]          │    │
│  │ 소개:        [____________]          │    │
│  │ 해커톤*:     [드롭다운 ▼]            │    │
│  │ 모집 분야:   [Frontend ✕] [+ 추가]  │    │
│  │ 인원:        [5 ▼]                  │    │
│  │ 연락 방법*:  ○ 오픈카톡 ○ 이메일     │    │
│  │ 연락처 URL*: [____________]          │    │
│  │              [취소] [팀 생성하기]     │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### 5.6 글로벌 랭킹 (`/rankings`)

```
┌─────────────────────────────────────────────┐
│  Navbar                                     │
├─────────────────────────────────────────────┤
│  글로벌 랭킹                                 │
│  "전체 해커톤을 아우르는 글로벌 랭킹입니다"   │
│                                             │
│  [전체] [월간] [주간]                        │
│                                             │
│  ┌──────┬──────────────┬─────────┐          │
│  │ 순위  │ 팀명          │ Points  │          │
│  ├──────┼──────────────┼─────────┤          │
│  │ 🥇 1 │ 404found     │ 87.5    │          │
│  │ 🥈 2 │ LGTM         │ 84.2    │          │
│  │ 🥉 3 │ Team Alpha   │ 0.74    │          │
│  └──────┴──────────────┴─────────┘          │
│                                             │
│  (빈 상태)                                   │
│  "아직 랭킹 데이터가 없습니다."               │
└─────────────────────────────────────────────┘
```

### 5.7 Component List

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `Navbar` | `components/layout/Navbar.tsx` | 네비게이션 + 다크모드 토글 |
| `ThemeProvider` | `components/layout/ThemeProvider.tsx` | next-themes 래퍼 |
| `EmptyState` | `components/common/EmptyState.tsx` | 빈 상태 UI (아이콘 + 메시지 + 액션 버튼) |
| `HackathonCard` | `components/hackathon/HackathonCard.tsx` | 해커톤 카드 (썸네일, 제목, 상태, 태그, 기간) |
| `HackathonFilter` | `components/hackathon/HackathonFilter.tsx` | 상태/태그 필터 바 |
| `HackathonTabs` | `components/hackathon/HackathonTabs.tsx` | 상세 페이지 탭 컨테이너 |
| `OverviewTab` | `components/hackathon/tabs/OverviewTab.tsx` | 개요 탭 콘텐츠 |
| `InfoTab` | `components/hackathon/tabs/InfoTab.tsx` | 안내 탭 콘텐츠 |
| `EvalTab` | `components/hackathon/tabs/EvalTab.tsx` | 평가 탭 콘텐츠 |
| `ScheduleTab` | `components/hackathon/tabs/ScheduleTab.tsx` | 일정 탭 (타임라인) |
| `PrizeTab` | `components/hackathon/tabs/PrizeTab.tsx` | 상금 탭 |
| `TeamsTab` | `components/hackathon/tabs/TeamsTab.tsx` | 팀 목록 탭 |
| `SubmitTab` | `components/hackathon/tabs/SubmitTab.tsx` | 제출 폼 탭 |
| `LeaderboardTab` | `components/hackathon/tabs/LeaderboardTab.tsx` | 리더보드 탭 |
| `TeamCard` | `components/camp/TeamCard.tsx` | 팀 카드 (팀명, 상태, 인원, 분야, 연락) |
| `TeamCreateForm` | `components/camp/TeamCreateForm.tsx` | 팀 생성 폼 (모달) |
| `AISearchBar` | `components/camp/AISearchBar.tsx` | AI 검색 입력 + 결과 |
| `AIMatchResult` | `components/camp/AIMatchResult.tsx` | AI 추천 결과 카드 |
| `RankingTable` | `components/rankings/RankingTable.tsx` | 랭킹 테이블 |
| `StatusBadge` | `components/common/StatusBadge.tsx` | 상태 뱃지 (진행중/종료/예정/모집중/마감) |

---

## 6. Error Handling

### 6.1 에러 유형별 처리

| 상황 | UI 처리 | 기술적 처리 |
|------|---------|-------------|
| 목록 빈 상태 | `EmptyState` 컴포넌트 표시 | 배열 length === 0 체크 |
| 존재하지 않는 slug | "해커톤을 찾을 수 없습니다." + 돌아가기 링크 | find() 결과 undefined 체크 |
| 폼 필수값 미입력 | 필드 하단 인라인 에러 + 버튼 비활성화 | 제출 전 validation 함수 |
| 허용되지 않는 파일 타입 | "이 해커톤은 {types}만 제출 가능합니다." | allowedArtifactTypes 체크 |
| AI 검색 빈 입력 | "검색어를 입력해주세요." | query.trim() === "" 체크 |
| AI API 호출 실패 | "AI 검색에 실패했습니다." + 일반 목록 유지 | try-catch + fallback |
| AI 매칭 결과 없음 | "조건에 맞는 팀을 찾지 못했습니다." | matches.length === 0 체크 |
| localStorage 손상 | 자동 재초기화 (사용자 인지 안 함) | try-catch + initData() 재실행 |

### 6.2 Validation 규칙

**팀 생성 폼:**
- 팀 이름: 필수, 1~30자
- 해커톤: 필수 선택
- 연락처 URL: 필수, URL 형식
- 모집 분야: 선택, 최소 0개
- 인원: 1~10

**제출 폼:**
- 제목: 필수, 1~100자
- 파일/URL: 필수, allowedArtifactTypes에 맞는 타입
- 메모: 선택, 0~500자

---

## 7. Security Considerations

- [x] Gemini API 키를 서버 환경변수에만 저장 (브라우저 노출 방지)
- [x] 외부 링크 새 탭 열기 + `rel="noopener noreferrer"`
- [x] XSS 방지: React의 기본 이스케이핑 활용, dangerouslySetInnerHTML 사용 안 함
- [ ] API Route에 rate limiting (선택적 — Vercel 기본 보호 의존)

---

## 8. Test Plan

### 8.1 수동 테스트 (Zero Script QA)

대회 특성상 자동화 테스트 대신 수동 시나리오로 검증한다.

| 시나리오 | 확인 사항 |
|---------|----------|
| 최초 접속 | localStorage 초기화 → 데이터 렌더링 정상 |
| 해커톤 필터 | 상태/태그 필터 동작 → 결과 갱신 → 빈 상태 UI |
| 해커톤 상세 탭 전환 | 8개 탭 모두 내용 표시 → 데이터 매핑 정확 |
| 팀 생성 | 필수값 검증 → 생성 → 목록 반영 → 상세 Teams 탭 반영 |
| Submit | 제출 → localStorage 저장 → 재접속 시 유지 |
| AI 검색 | 자연어 입력 → 로딩 → 결과 표시 → 근거 확인 |
| AI 검색 실패 | 네트워크 끊김 → 에러 메시지 → 일반 목록 유지 |
| 다크모드 | 토글 → 전체 페이지 테마 전환 → 새로고침 후 유지 |
| 반응형 | 모바일 너비 → 레이아웃 정상 → 탭 스크롤 가능 |
| 빈 상태 | localStorage 비우기 → 재접속 → 자동 초기화 |

---

## 9. Coding Convention

### 9.1 Naming Conventions

| Target | Rule | Example |
|--------|------|---------|
| 컴포넌트 | PascalCase | `HackathonCard`, `TeamCreateForm` |
| 파일 (컴포넌트) | PascalCase.tsx | `HackathonCard.tsx` |
| 파일 (유틸) | kebab-case.ts | `init-data.ts` |
| 폴더 | kebab-case | `components/hackathon/` |
| 변수/함수 | camelCase | `getTeams()`, `hackathonSlug` |
| 상수 | UPPER_SNAKE_CASE | `STORAGE_KEYS` |
| 타입/인터페이스 | PascalCase | `Hackathon`, `Team` |

### 9.2 Import Order

```typescript
// 1. React / Next.js
import { useState } from "react";
import Link from "next/link";

// 2. 외부 라이브러리
import { Search } from "lucide-react";

// 3. 내부 컴포넌트
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";

// 4. 내부 유틸/데이터
import { getTeams } from "@/lib/storage";

// 5. 타입
import type { Team } from "@/lib/types";
```

### 9.3 Environment Variables

| Variable | Purpose | Scope |
|----------|---------|-------|
| `GEMINI_API_KEY` | Gemini API 인증 키 | Server only (API Route) |

---

## 10. Implementation Guide

### 10.1 File Structure

```
src/
├── app/
│   ├── layout.tsx                         # RootLayout: ThemeProvider + Navbar
│   ├── page.tsx                           # 메인페이지
│   ├── globals.css                        # Tailwind 글로벌 스타일
│   ├── hackathons/
│   │   ├── page.tsx                       # 해커톤 목록
│   │   └── [slug]/
│   │       └── page.tsx                   # 해커톤 상세
│   ├── camp/
│   │   └── page.tsx                       # 팀원 모집
│   ├── rankings/
│   │   └── page.tsx                       # 글로벌 랭킹
│   └── api/
│       └── match/
│           └── route.ts                   # AI 팀매칭 API
├── components/
│   ├── ui/                                # shadcn/ui (Button, Card, Tabs, Dialog, Input, Select, Badge...)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── ThemeProvider.tsx
│   ├── common/
│   │   ├── EmptyState.tsx
│   │   └── StatusBadge.tsx
│   ├── hackathon/
│   │   ├── HackathonCard.tsx
│   │   ├── HackathonFilter.tsx
│   │   ├── HackathonTabs.tsx
│   │   └── tabs/
│   │       ├── OverviewTab.tsx
│   │       ├── InfoTab.tsx
│   │       ├── EvalTab.tsx
│   │       ├── ScheduleTab.tsx
│   │       ├── PrizeTab.tsx
│   │       ├── TeamsTab.tsx
│   │       ├── SubmitTab.tsx
│   │       └── LeaderboardTab.tsx
│   ├── camp/
│   │   ├── TeamCard.tsx
│   │   ├── TeamCreateForm.tsx
│   │   ├── AISearchBar.tsx
│   │   └── AIMatchResult.tsx
│   └── rankings/
│       └── RankingTable.tsx
├── lib/
│   ├── types.ts                           # 모든 TypeScript 타입
│   ├── storage.ts                         # localStorage CRUD 헬퍼
│   ├── init-data.ts                       # 예시 JSON → localStorage 초기화
│   └── utils.ts                           # 날짜 포맷, 금액 포맷 등
└── data/                                  # 초기화용 JSON import
    ├── hackathons.ts                      # 예시 해커톤 데이터
    ├── hackathon-details.ts               # 예시 상세 데이터
    ├── teams.ts                           # 예시 팀 데이터
    └── leaderboards.ts                    # 예시 리더보드 데이터
```

### 10.2 Implementation Order

1. [ ] **프로젝트 초기화**: Next.js + Tailwind + shadcn/ui + next-themes
2. [ ] **타입 정의**: `lib/types.ts` — 모든 인터페이스
3. [ ] **데이터 레이어**: `data/*.ts` + `lib/storage.ts` + `lib/init-data.ts`
4. [ ] **공통 컴포넌트**: Navbar, ThemeProvider, EmptyState, StatusBadge
5. [ ] **메인페이지**: `app/page.tsx` — 배너 + 바로가기
6. [ ] **해커톤 목록**: HackathonCard + HackathonFilter + `app/hackathons/page.tsx`
7. [ ] **해커톤 상세**: HackathonTabs + 8개 탭 컴포넌트 + `app/hackathons/[slug]/page.tsx`
8. [ ] **팀원 모집**: TeamCard + TeamCreateForm + `app/camp/page.tsx`
9. [ ] **랭킹**: RankingTable + `app/rankings/page.tsx`
10. [ ] **AI 팀매칭**: AISearchBar + AIMatchResult + `app/api/match/route.ts`
11. [ ] **빈 상태/에러 처리**: 전 페이지 빈 상태 UI + 폼 validation
12. [ ] **Vercel 배포**: 환경변수 설정 + 배포 + 테스트

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-16 | Initial draft — 타입, 컴포넌트, API, UI 레이아웃, 구현 순서 | Team DAKER |
