# 해커톤 웹 UI Flow 및 아키텍처 명세

## 1. 전역 상태 관리 (Data Store)
- **저장소**: `localStorage`
- **관리되는 상태(State) 목록**:
  - `hackathons` (해커톤 정보)
  - `teams(camp)` (팀 모집 및 구성 정보)
  - `submissions` (제출물 정보)
  - `leaderboards` (순위표 정보)

## 2. 페이지 라우팅 및 이동 흐름 (Pages & Routing)
- **`/` (메인페이지)**
  - 하위 이동: `/hackathons`, `/rankings`, `/camp`
- **`/hackathons` (해커톤 목록)**
  - 데이터 연동: `localStorage`에서 데이터 Read
  - 이벤트: 특정 해커톤 카드 클릭 시 `/hackathons/:slug` 로 이동
- **`/rankings` (랭킹)**
- **`/camp` (팀원 모집 - 팀 리스트/생성)**
  - 데이터 연동: `localStorage`에서 데이터 Read/Write
  - 이벤트: 특정 팀 클릭 시 `team.hackathonSlug`를 참조하여 해당 `/hackathons/:slug` 로 연결(이동)

## 3. 해커톤 상세 페이지 구조 (`/hackathons/:slug`)
- **데이터 연동**: `localStorage`에서 해당 slug의 데이터 Read
- **포함되는 필수 섹션 (하위 컴포넌트)**:
  1. `개요 (Overview)`
  2. `팀(캠프)`
     - 이벤트: "이 해커톤 팀 보기/생성" 액션 시 `/camp` 로 이동
  3. `평가 (Eval)`
  4. `상금 (Prize)`
  5. `안내 (Info)`
  6. `일정 (Schedule)`
  7. `제출 (Submit)`
     - 이벤트: "저장/제출" 액션 발생 시 `리더보드(Leaderboard)`로 데이터 전달 및 갱신
  8. `리더보드 (Leaderboard)`
     - 데이터 연동: `localStorage`에서 리더보드 데이터 Read
     - 상태 업데이트: `제출(Submit)`에서 저장/제출 발생 시 `leaderboards` 업데이트 처리 반영