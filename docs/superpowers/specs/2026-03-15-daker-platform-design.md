# DAKER 해커톤 플랫폼 설계 문서

## 1. 프로젝트 개요

해커톤 플랫폼 웹서비스. "긴급 인수인계 해커톤" 과제로, 기능 명세서와 예시 데이터를 기반으로 구현한다.

### 목표
- 기본 구현 (6개 페이지) 완성
- 확장 기능 (AI 팀매칭 + 훈수 피드) 으로 차별화
- Vercel 배포, 심사자가 바로 사용 가능

### 평가 기준
| 항목 | 배점 | 평가 포인트 |
|------|------|-------------|
| 기본 구현 | 30 | 웹 페이지 구현도, 데이터 기반 렌더링, 필터/정렬 동작, 빈 상태 UI |
| 확장(아이디어) | 30 | 팀 고유 기능/UX 개선의 참신함·실용성, "서비스로서 가치", 일관된 흐름 |
| 완성도 | 25 | 사용성(동선/가독성), 안정성(오류/예외 처리), 성능(로딩/반응성), 접근성/반응형 |
| 문서/설명 | 15 | 기획서의 명확성, PPT 설계/구현 설명력, 재현성 |

### 보안 원칙 (공개 금지 항목)
- 내부 유저 정보 노출 금지
- 유저가 비공개 설정한 정보 노출 금지
- 다른 팀의 내부 정보 (제출물, 전략 등) 노출 금지
- API 키, 환경변수 등 민감 정보 클라이언트 노출 금지

---

## 2. 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js (App Router) |
| 스타일링 | shadcn/ui + Tailwind CSS |
| 다크 모드 | next-themes |
| 데이터 저장 | localStorage |
| LLM | Gemini API |
| API 호출 | Next.js API Route (서버리스) |
| 배포 | Vercel |

### 아키텍처

```
[브라우저]
  ├── 페이지 렌더링 (Next.js)
  ├── 데이터 CRUD (localStorage)
  └── AI 매칭 요청
        ↓
      /api/match (Next.js API Route)
        ↓
      Gemini API (환경변수 GEMINI_API_KEY로 키 관리)
```

---

## 3. 공통 UI (모든 페이지 적용)

### 3.1 네비게이션 바 (상단 고정)
- 로고/홈 → `/`
- 해커톤 목록 → `/hackathons`
- 팀 찾기 → `/camp`
- 랭킹 → `/rankings`
- 피드 → `/feed` (확장 기능)
- 다크 모드 토글 버튼

### 3.2 3종 상태 UI (모든 데이터 로딩 구간에 적용)

| 상태 | UI |
|------|------|
| **로딩중** | 스켈레톤 UI 또는 스피너 + "로딩 중..." 텍스트 |
| **데이터 없음** | 빈 상태 일러스트 + 안내 메시지 (예: "아직 등록된 해커톤이 없습니다") |
| **에러** | 에러 아이콘 + 에러 메시지 + "다시 시도" 버튼 |

### 3.3 반응형 레이아웃
- 데스크톱: 최대 너비 제한, 가운데 정렬
- 태블릿: 2열 그리드 → 1열로 축소
- 모바일: 네비게이션 햄버거 메뉴, 카드 1열 풀너비

### 3.4 다크 모드
- next-themes로 시스템 설정 자동 감지
- 수동 토글 버튼 (네비게이션 바)
- 라이트/다크 두 모드 지원

---

## 4. 페이지 구성

### 4.1 메인페이지 (`/`)

**레이아웃**: 큰 카드형 버튼 3개를 중심으로 구성

| 요소 | 설명 |
|------|------|
| 히어로 배너 | 플랫폼 소개 문구 + 현재 진행 중인 해커톤 하이라이트 |
| 해커톤 보러가기 카드 | 큰 카드 버튼 → `/hackathons`로 이동. 현재 진행중/예정 해커톤 수 표시 |
| 팀 찾기 카드 | 큰 카드 버튼 → `/camp`로 이동. 현재 모집 중인 팀 수 표시 |
| 랭킹 보기 카드 | 큰 카드 버튼 → `/rankings`로 이동. 상위 랭커 미리보기 |

### 4.2 해커톤 목록 (`/hackathons`)

**레이아웃**: 필터 바 + 카드 리스트

**카드에 표시할 정보**:
- 썸네일 이미지 (`thumbnailUrl`)
- 제목 (`title`)
- 상태 배지 (`status`): 진행중=초록, 종료=회색, 예정=파랑
- 태그 목록 (`tags`): 칩/배지 형태
- 시작일 / 종료일 (`period.endAt` 기준)
- 참가자 수 (해당 해커톤의 teams 데이터에서 memberCount 합산)

**필터 기능**:
| 필터 | 설명 |
|------|------|
| 상태 필터 | 전체 / 진행중 / 종료 / 예정 (탭 또는 드롭다운) |
| 태그 필터 | 태그 클릭으로 필터링 (다중 선택 가능) |

**인터랙션**:
- 카드 클릭 → `/hackathons/:slug`로 이동
- 카드 hover 시 살짝 올라오는 애니메이션

### 4.3 해커톤 상세 (`/hackathons/:slug`)

**레이아웃**: 상단 헤더 (제목, 상태, 기간) + 탭 기반 섹션

**★ 핵심: 7개 탭 섹션은 필수**

#### 탭 1: 개요 (Overview) / 안내
| 항목 | 데이터 소스 | 표시 방식 |
|------|-------------|-----------|
| 대회 요약 | `sections.overview.summary` | 텍스트 블록 |
| 팀 정책 | `sections.overview.teamPolicy` | "솔로 참가 가능" / "최대 N명" 배지 |
| 공지사항 | `sections.info.notice[]` | 번호 매긴 리스트 |
| 규정 링크 | `sections.info.links.rules` | 외부 링크 버튼 |
| FAQ 링크 | `sections.info.links.faq` | 외부 링크 버튼 |

#### 탭 2: 평가 (Eval)
| 항목 | 데이터 소스 | 표시 방식 |
|------|-------------|-----------|
| 평가 지표명 | `sections.eval.metricName` | 제목 |
| 평가 설명 | `sections.eval.description` | 텍스트 |
| 제한사항 (점수 기반) | `sections.eval.limits` | "최대 런타임: 1200초", "일일 제출 횟수: 5회" |
| 점수 구성 (투표 기반) | `sections.eval.scoreDisplay.breakdown` | 프로그레스 바 (참가자 30% / 심사위원 70%) |

평가 방식은 해커톤 설정에 따라 다름:
- `scoreSource`가 없으면 → 점수 기반 (limits 표시)
- `scoreSource: "vote"` → 투표 기반 (breakdown 비율 표시)

#### 탭 3: 일정 (Schedule)
| 항목 | 데이터 소스 | 표시 방식 |
|------|-------------|-----------|
| 타임라인 | `sections.schedule.milestones[]` | 세로 타임라인 UI, 각 마일스톤의 이름 + 날짜/시간 |
| 현재 단계 | 현재 시간과 milestones 비교 | 현재 단계 하이라이트, 지난 단계 흐리게 |

#### 탭 4: 상금 (Prize)
| 항목 | 데이터 소스 | 표시 방식 |
|------|-------------|-----------|
| 수상 목록 | `sections.prize.items[]` | 1st/2nd/3rd 카드, 금액 강조, 트로피 아이콘 |

#### 탭 5: 팀 (Teams/Camp)
| 항목 | 데이터 소스 | 표시 방식 |
|------|-------------|-----------|
| 팀 목록 | teams 데이터에서 `hackathonSlug` 필터 | 팀 카드 리스트 (이름, 인원, 모집 역할, 모집 상태) |
| 팀 생성 버튼 | - | "이 해커톤에서 팀 만들기" 버튼 → 팀 생성 모달/폼 |
| 초대/수락/거절 | - | 팀 카드에 "지원하기" 버튼 → contact URL로 이동 |

**팀 구성 시 유의사항 팝업** (옵션):
- 팀 생성/지원 버튼 클릭 시 팝업으로 유의사항 안내
- "최대 N명까지 가능합니다", "솔로 참가도 가능합니다" 등 teamPolicy 기반 메시지

#### 탭 6: 제출 (Submit)
| 항목 | 데이터 소스 | 표시 방식 |
|------|-------------|-----------|
| 제출 가이드 | `sections.submit.guide[]` | 번호 매긴 안내 리스트 |
| 제출 폼 | `sections.submit.allowedArtifactTypes` | 타입에 따른 입력 필드 동적 생성 |
| 메모 | - | 텍스트 입력 (optional) |

**제출 폼 상세**:

| `allowedArtifactTypes` 값 | 입력 UI |
|---------------------------|---------|
| `zip` | 파일 업로드 (drag & drop, .zip만 허용) |
| `csv` | 파일 업로드 (.csv만 허용) |
| `pdf` | 파일 업로드 (.pdf만 허용) |
| `url` | URL 입력 필드 (URL 유효성 검사) |
| `text` | 텍스트 영역 (여러 줄 입력) |
| `text_or_url` | 텍스트/URL 탭 전환 입력 |
| `pdf_url` | URL 입력 필드 (PDF URL) |

**submissionItems가 있는 경우** (단계별 제출):
- 각 항목별로 별도 섹션 표시 (예: "기획서(1차 제출)", "최종 웹링크 제출", "최종 솔루션 PDF 제출")
- 각 섹션에 해당 format에 맞는 입력 폼

**제출 후**:
- localStorage의 submissions에 저장
- 제출 완료 토스트 알림
- 제출 내역 표시 (제출 시간, 파일명/URL)

#### 탭 7: 리더보드 (Leaderboard)

| 상태 | 표시 |
|------|------|
| 제출 내역 있음 | 랭킹 테이블: 순위, 팀명, 점수, 제출 시간 |
| 참가했으나 미제출 | 해당 팀은 "미제출" 라벨 표시, 순위 없음 (순위 X) |
| 아무 제출 없음 | "아직 리더보드가 없습니다" 빈 상태 UI |

**점수 표시 방식** (해커톤 설정에 따라 다름):
- 점수 기반: score 숫자 표시
- 투표 기반: 총점 + scoreBreakdown (참가자 점수 / 심사위원 점수) 펼쳐보기

**artifacts가 있는 경우**:
- 웹 URL, PDF URL, 기획서 제목 링크 표시

### 4.4 랭킹 (`/rankings`)

**레이아웃**: 필터 바 + 랭킹 테이블

**랭킹 테이블 컬럼**:
| 컬럼 | 설명 |
|------|------|
| 순위 (rank) | 1, 2, 3위는 메달 아이콘 |
| 닉네임/팀명 | 팀 또는 유저 이름 |
| 포인트 (points) | 해커톤 전체 참여/순위 기록 기반 누적 점수 |

**필터 기능** (옵션):
| 필터 | 옵션 |
|------|------|
| 기간 | 최근 1일 / 30일 / 전체 |
| 해커톤별 | 특정 해커톤 선택 |

### 4.5 팀 모집 (`/camp`)

**레이아웃**: 해커톤 선택 드롭다운 + AI 검색창 + 팀 카드 리스트 + 팀 생성 버튼

**핵심 규칙**:
- 해커톤과 연결되어 있지 않아도 팀 생성 가능 (hackathonSlug는 optional)
- 해커톤 상세 페이지의 Teams 탭에서도 팀 생성 가능 (이 경우 hackathonSlug 자동 연결)
- `/camp?hackathonSlug=xxx`로 접근 시 해당 해커톤 팀만 필터링

**팀 카드 표시 정보**:
- 팀명 (`name`)
- 모집 상태 배지 (`isOpen`: 모집중=초록 / 마감=회색)
- 현재 인원 (`memberCount`) / 최대 인원
- 찾는 역할 (`lookingFor`): 칩/배지 형태
- 한줄 소개 (`intro`)
- 연락하기 버튼 (`contact.url` → 외부 링크로 이동)
- 등록일 (`createdAt`)

**팀 생성 폼** (모달 또는 페이지):
| 필드 | 필수 여부 | 입력 타입 |
|------|-----------|-----------|
| 팀명 | 필수 | 텍스트 입력 |
| 소개 | 필수 | 텍스트 영역 |
| 해커톤 연결 | 선택 | 해커톤 드롭다운 (연결 안 해도 생성 가능) |
| 모집중 여부 | 필수 | 토글 (기본값: true) |
| 모집 포지션 | 선택 | 다중 선택 칩 (Frontend, Backend, Designer, PM, ML Engineer 등) |
| 연락 링크 | 필수 | URL 입력 (오픈카톡, 구글폼 등) |

**팀 수정/마감 처리** (옵션):
- 팀 카드에 "수정" 버튼 → 폼 다시 열기
- "모집 마감" 버튼 → isOpen을 false로 변경
- localStorage에서 teamCode로 식별하여 업데이트

**채팅/쪽지 보내기** (옵션 — 있으면 Best):
- 팀 카드에 "쪽지 보내기" 버튼
- 간단한 메시지 입력 모달 → localStorage에 저장
- 받은 쪽지 목록 확인 기능 (알림 배지)
- 실제 전송은 불가 (localStorage 한계), 데모용 체험 기능

### 4.6 훈수 피드 (`/feed`) — 확장 기능

**레이아웃**: 인스타그램 스타일 세로 피드

**피드 카드 구성**:
| 요소 | 설명 |
|------|------|
| 작성자 | 프로필 이미지 (아바타) + 이름 |
| 프로젝트명 | 개발 중인 프로젝트 제목 |
| 팀원 | 함께 하는 팀원 이름 목록 |
| 코드 스니펫 | syntax highlighting 적용된 코드 블록 |
| 설명 | 프로젝트/코드 설명 텍스트 |
| 좋아요 수 | 하트 아이콘 + 숫자 |
| 등록일 | 상대 시간 (예: "2시간 전") |

**훈수 (댓글) 영역**:
- 댓글 리스트 (작성자, 내용, 작성 시간)
- 피드 작성자가 누른 좋아요 표시 (하트 강조)
- 댓글 입력 폼

**훈수 자랑**:
- 좋아요 받은 훈수를 모아보는 섹션/배지
- 더미 데이터로 데모 구현

---

## 5. 데이터 스키마 (localStorage)

### 5.1 hackathons (키: `daker_hackathons`)
```json
[
  {
    "slug": "string (고유 식별자, URL용)",
    "title": "string",
    "status": "ended | ongoing | upcoming",
    "tags": ["string"],
    "thumbnailUrl": "string",
    "period": {
      "timezone": "string (예: Asia/Seoul)",
      "submissionDeadlineAt": "ISO8601",
      "endAt": "ISO8601"
    },
    "links": {
      "detail": "string (/hackathons/:slug)",
      "rules": "string (외부 URL)",
      "faq": "string (외부 URL)"
    }
  }
]
```

### 5.2 hackathon_details (키: `daker_hackathon_details`)
```json
[
  {
    "slug": "string",
    "title": "string",
    "sections": {
      "overview": {
        "summary": "string",
        "teamPolicy": {
          "allowSolo": "boolean",
          "maxTeamSize": "number"
        }
      },
      "info": {
        "notice": ["string"],
        "links": {
          "rules": "string",
          "faq": "string"
        }
      },
      "eval": {
        "metricName": "string",
        "description": "string",
        "limits": {
          "maxRuntimeSec": "number (optional)",
          "maxSubmissionsPerDay": "number (optional)"
        },
        "scoreSource": "string (optional, 'vote'이면 투표 기반)",
        "scoreDisplay": {
          "label": "string (optional)",
          "breakdown": [
            {
              "key": "string",
              "label": "string",
              "weightPercent": "number"
            }
          ]
        }
      },
      "schedule": {
        "timezone": "string",
        "milestones": [
          {
            "name": "string",
            "at": "ISO8601"
          }
        ]
      },
      "prize": {
        "items": [
          {
            "place": "string (1st, 2nd, 3rd 등)",
            "amountKRW": "number"
          }
        ]
      },
      "teams": {
        "campEnabled": "boolean",
        "listUrl": "string (/camp?hackathon=:slug)"
      },
      "submit": {
        "allowedArtifactTypes": ["string (zip, pdf, csv, url, text, text_or_url, pdf_url)"],
        "submissionUrl": "string",
        "guide": ["string"],
        "submissionItems": [
          {
            "key": "string (optional)",
            "title": "string (optional)",
            "format": "string (optional)"
          }
        ]
      },
      "leaderboard": {
        "publicLeaderboardUrl": "string",
        "note": "string"
      }
    }
  }
]
```

### 5.3 teams (키: `daker_teams`)
```json
[
  {
    "teamCode": "string (고유 코드, 예: T-ALPHA)",
    "hackathonSlug": "string | null (해커톤 미연결 시 null)",
    "name": "string",
    "isOpen": "boolean",
    "memberCount": "number",
    "lookingFor": ["string (Frontend, Backend, Designer, PM, ML Engineer 등)"],
    "intro": "string",
    "contact": {
      "type": "string (link)",
      "url": "string (오픈카톡, 구글폼 등)"
    },
    "createdAt": "ISO8601"
  }
]
```

### 5.4 leaderboards (키: `daker_leaderboards`)
```json
[
  {
    "hackathonSlug": "string",
    "updatedAt": "ISO8601",
    "entries": [
      {
        "rank": "number (미제출 시 null)",
        "teamName": "string",
        "score": "number | null (미제출 시 null)",
        "submittedAt": "ISO8601 | null",
        "status": "string ('submitted' | 'not_submitted')",
        "scoreBreakdown": {
          "participant": "number (optional, 투표 기반)",
          "judge": "number (optional, 투표 기반)"
        },
        "artifacts": {
          "webUrl": "string (optional)",
          "pdfUrl": "string (optional)",
          "planTitle": "string (optional)"
        }
      }
    ]
  }
]
```

### 5.5 submissions (키: `daker_submissions`)
```json
[
  {
    "id": "string (UUID)",
    "hackathonSlug": "string",
    "teamCode": "string",
    "type": "zip | text | url | pdf | csv | text_or_url | pdf_url",
    "value": "string (파일명 또는 URL 또는 텍스트)",
    "notes": "string | null (optional 메모)",
    "submissionItemKey": "string | null (단계별 제출 시 key, 예: plan, web, pdf)",
    "submittedAt": "ISO8601"
  }
]
```

### 5.6 feeds (키: `daker_feeds`) — 확장 기능
```json
[
  {
    "id": "string (UUID)",
    "authorName": "string",
    "authorAvatar": "string (아바타 URL 또는 이니셜)",
    "projectName": "string",
    "teamMembers": ["string"],
    "codeSnippet": "string",
    "codeLanguage": "string (syntax highlighting용, 예: javascript, python)",
    "description": "string",
    "likes": "number",
    "createdAt": "ISO8601",
    "comments": [
      {
        "id": "string (UUID)",
        "authorName": "string",
        "content": "string",
        "likesFromAuthor": "boolean (피드 작성자가 좋아요 눌렀는지)",
        "createdAt": "ISO8601"
      }
    ]
  }
]
```

---

## 6. 확장 기능 상세

### 6.1 Track 1: AI 팀매칭 - 검색형 (필수)

**위치**: `/camp` 페이지 상단 검색창

**흐름**:
1. 사용자가 자연어 입력 (예: "Python BE인데 기획자 있는 팀 찾아줘")
2. 프론트엔드가 입력 + 현재 팀 목록을 `/api/match`로 POST
3. API Route에서 Gemini에 프롬프트 전송 (팀 데이터 + 사용자 쿼리)
4. Gemini 응답 파싱 → 추천 팀 + 매칭 근거 반환
5. UI에 추천 결과 카드 표시 (매칭률 + 근거 설명)

**API Route**: `POST /api/match`
```
Request:  { query: string, teams: Team[] }
Response: { recommendations: [{ teamCode: string, matchScore: number, reason: string }] }
```

**UI**:
- 검색창 (placeholder: "어떤 팀을 찾고 있나요?")
- 검색 중 로딩 스피너
- 추천 결과 카드: 팀 정보 + 매칭 점수 + AI가 설명하는 추천 근거
- 결과 없으면: "조건에 맞는 팀을 찾지 못했습니다" 메시지

### 6.2 Track 2: AI 팀매칭 - 대화형 (Track 1 완료 후 시간 되면)

**위치**: `/camp` 페이지, "AI와 대화로 찾기" 버튼

**흐름**:
1. 버튼 클릭 → 챗봇 패널 열림 (사이드바 또는 모달)
2. AI가 첫 질문: "어떤 역할을 하시나요?"
3. 사용자 답변 → AI가 추가 질문으로 조건 좁히기
4. 충분한 정보 수집 → 추천 결과 카드 표시

**API Route**: `POST /api/chat`
```
Request:  { messages: [{ role: 'user'|'assistant', content: string }], teams: Team[] }
Response: { reply: string, recommendations?: [{ teamCode, matchScore, reason }] }
```

### 6.3 훈수 피드

**위치**: `/feed` 페이지 (네비게이션에 추가)

**흐름**:
- 더미 피드 데이터가 localStorage에 미리 로드
- 피드 카드에 코드 스니펫 표시 (syntax highlighting)
- 훈수(댓글) 작성 가능 → localStorage에 저장
- 피드 작성자가 훈수에 좋아요 가능 → likesFromAuthor 토글
- 좋아요 받은 훈수는 작성자 프로필에서 확인 가능

---

## 7. 초기 데이터 로딩

앱 최초 실행 시:
1. localStorage에 `daker_hackathons` 키가 있는지 확인
2. 없으면 예시 JSON 파일들을 fetch:
   - `data/예시자료/public_hackathons.json` → `daker_hackathons`
   - `data/예시자료/public_hackathon_detail.json` → `daker_hackathon_details`
   - `data/예시자료/public_teams.json` → `daker_teams`
   - `data/예시자료/public_leaderboard.json` → `daker_leaderboards`
   - 더미 피드 데이터 → `daker_feeds`
3. localStorage에 저장
4. 이후에는 localStorage에서 읽기/쓰기

---

## 8. 구현 우선순위

| 순서 | 항목 | 이유 |
|------|------|------|
| 1 | 프로젝트 세팅 (Next.js + shadcn + Tailwind + next-themes) | 기반 |
| 2 | 공통 레이아웃 (네비게이션 바, 다크 모드, 3종 상태 UI) | 모든 페이지에 필요 |
| 3 | localStorage 데이터 레이어 + 초기 데이터 로딩 | 모든 페이지에 필요 |
| 4 | 해커톤 목록 페이지 (필터 포함) | 기본 구현 (30점) |
| 5 | 해커톤 상세 페이지 (7개 탭 전체) | 기본 구현 핵심 (30점) |
| 6 | 팀 모집 페이지 (생성/수정/마감 포함) | 기본 구현 (30점) |
| 7 | 랭킹 페이지 (필터 포함) | 기본 구현 (30점) |
| 8 | 메인페이지 (카드 버튼 3개) | 기본 구현 (30점) |
| 9 | AI 팀매칭 - 검색형 (Track 1) | 확장 기능 핵심 (30점) |
| 10 | 훈수 피드 | 확장 기능 서브 (30점) |
| 11 | AI 팀매칭 - 대화형 (Track 2) | 확장 기능 보너스 |
| 12 | 완성도 다듬기 (에러 처리, 반응형, 애니메이션, 접근성) | 완성도 (25점) |
