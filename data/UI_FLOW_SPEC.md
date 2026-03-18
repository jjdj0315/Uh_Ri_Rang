# Hackathon Platform — UI Flow Specification
> Claude Code용 구현 스펙 문서. localStorage 기반 상태 관리, Next.js App Router 구조 기준.

---

## 1. 전체 라우트 구조

```
/                          ← 메인페이지
/hackathons                ← 해커톤 목록
/hackathons/:slug          ← 해커톤 상세 (핵심 허브 페이지)
/rankings                  ← 랭킹
/camp                      ← 팀원 모집 (팀 리스트 / 생성)
```

---

## 2. 데이터 스토어 (localStorage)

모든 상태는 클라이언트 localStorage에 저장됩니다.

```ts
// 저장 키 목록
"hackathons"     // 해커톤 전체 목록
"teams"          // 팀(camp) 목록. 각 team은 hackathonSlug 필드를 가짐
"submissions"    // 제출 데이터
"leaderboards"   // 리더보드 데이터
```

### 주요 타입 정의

```ts
type Hackathon = {
  slug: string;
  title: string;
  // ... 기타 필드
};

type Team = {
  id: string;
  hackathonSlug: string; // 어떤 해커톤 소속인지 연결하는 키
  name: string;
  members: string[];
  // ... 기타 필드
};

type Submission = {
  id: string;
  hackathonSlug: string;
  teamId: string;
  // ... 기타 필드
};

type Leaderboard = {
  hackathonSlug: string;
  entries: { teamId: string; score: number }[];
};
```

---

## 3. 페이지별 상세 스펙

### 3-1. 메인페이지 `/`

- **역할**: 진입점. 다른 페이지로의 네비게이션 허브.
- **이동 가능 경로**:
  - → `/hackathons` (해커톤 목록)
  - → `/rankings` (랭킹)
  - → `/hackathons/:slug` (직접 이동 가능)

---

### 3-2. 해커톤 목록 `/hackathons`

- **역할**: 해커톤 카드 목록 표시.
- **데이터**: localStorage `"hackathons"` 읽기.
- **인터랙션**:
  - 카드 클릭 → `/hackathons/:slug` 로 이동.
- **이동 가능 경로**:
  - → `/hackathons/:slug`

---

### 3-3. 랭킹 `/rankings`

- **역할**: 전체 또는 해커톤별 랭킹 표시.
- **데이터**: localStorage `"leaderboards"` 읽기.
- **이동 가능 경로**:
  - → `/hackathons/:slug` (특정 해커톤 상세로 이동)

---

### 3-4. 해커톤 상세 `/hackathons/:slug` ⭐ (핵심 허브)

- **역할**: 해커톤의 모든 정보를 탭/섹션으로 제공하는 중심 페이지.
- **데이터**:
  - localStorage `"hackathons"` 에서 slug로 조회
  - localStorage `"leaderboards"` 에서 해당 slug 데이터 조회

#### 포함 섹션 (필수, 모두 이 페이지 안에 표시)

| 섹션명 | 설명 |
|--------|------|
| 개요 | 해커톤 기본 정보 (소개, 주제 등) |
| 팀(캠프) | 이 해커톤 소속 팀 목록 표시 |
| 평가 | 평가 기준 안내 |
| 상금 | 시상 내역 |
| 안내 | 참가 규칙 및 공지 |
| 일정 | 타임라인 / 일정표 |
| 제출(Submit) | 결과물 제출 폼 |
| 리더보드(Leaderboard) | 실시간 순위 표 |

#### 섹션별 동작

**팀(캠프) 섹션**
- localStorage `"teams"` 에서 `team.hackathonSlug === slug` 인 팀만 필터링하여 표시
- "이 해커톤 팀 보기/생성" 버튼 → `/camp` 로 이동

**제출(Submit) 섹션**
- 사용자가 제출 → localStorage `"submissions"` 에 저장
- 제출 완료 후 → localStorage `"leaderboards"` 업데이트
- 저장/제출 후 → 리더보드 섹션 자동 갱신

**리더보드(Leaderboard) 섹션**
- localStorage `"leaderboards"` 에서 해당 slug 데이터 읽어 표시
- 제출 이벤트 발생 시 자동으로 업데이트됨

#### 이동 가능 경로
- → `/camp` (팀 보기/생성 버튼)
- ← `/hackathons` (목록으로 돌아가기)
- ← `/rankings` (랭킹에서 진입)

---

### 3-5. 팀원 모집 `/camp`

- **역할**: 팀 목록 조회 및 새 팀 생성.
- **데이터**:
  - localStorage `"teams"` 읽기/쓰기
  - 각 팀은 `hackathonSlug` 필드로 특정 해커톤과 연결됨
- **인터랙션**:
  - 팀 생성 → localStorage `"teams"` 에 추가, `hackathonSlug` 세팅
  - 팀 선택 → `/hackathons/:slug` 로 복귀 (team.hackathonSlug 사용)
- **이동 가능 경로**:
  - → `/hackathons/:slug` (team.hackathonSlug 로 연결)

---

## 4. 데이터 흐름 요약

```
[제출(Submit)] 
  → submissions에 저장 
  → leaderboards 업데이트 
  → 리더보드 섹션 리렌더

[팀 생성 at /camp]
  → teams에 저장 (hackathonSlug 포함)
  → /hackathons/:slug 팀 섹션에서 필터링하여 표시

[랭킹 /rankings]
  → leaderboards 읽어 표시
  → 특정 해커톤 클릭 시 /hackathons/:slug 이동
```

---

## 5. Next.js 파일 구조 제안

```
app/
├── page.tsx                          # 메인페이지 /
├── hackathons/
│   ├── page.tsx                      # 해커톤 목록 /hackathons
│   └── [slug]/
│       └── page.tsx                  # 해커톤 상세 /hackathons/:slug
├── rankings/
│   └── page.tsx                      # 랭킹 /rankings
└── camp/
    └── page.tsx                      # 팀원 모집 /camp

lib/
└── storage.ts                        # localStorage CRUD 헬퍼 함수

types/
└── index.ts                          # Hackathon, Team, Submission, Leaderboard 타입
```

---

## 6. localStorage 헬퍼 함수 인터페이스 (구현 참고)

```ts
// lib/storage.ts
export const storage = {
  getHackathons: (): Hackathon[] => { ... },
  getTeams: (): Team[] => { ... },
  getTeamsBySlug: (slug: string): Team[] => { ... },  // hackathonSlug 필터
  getSubmissions: (): Submission[] => { ... },
  getLeaderboard: (slug: string): Leaderboard | null => { ... },

  saveTeam: (team: Team): void => { ... },
  saveSubmission: (submission: Submission): void => { ... },
  updateLeaderboard: (slug: string, entry: LeaderboardEntry): void => { ... },
};
```

---

> **구현 우선순위**: `/hackathons/:slug` 페이지가 모든 핵심 기능의 허브이므로 가장 먼저 구현 권장.
