# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DAKER는 해커톤 플랫폼 웹서비스다. "긴급 인수인계 해커톤" 과제로, 기능 명세서와 예시 데이터만을 기반으로 구현한다. 백엔드 없이 localStorage로 데이터를 관리하며, Vercel에 배포해야 한다.

## 대회 개요 및 목표

### 대회 목표
- 제공된 자료(명세서 + 예시 데이터)를 기반으로 웹페이지를 완성
- 팀 고유 아이디어로 확장 기능/UX 개선을 추가
- 바이브 코딩(AI 도구) 활용 개발

### 제출물 (3단계)
1. **기획서(1차)**: 서비스 개요, 페이지 구성, 시스템 구성, 핵심 기능 명세, 주요 사용 흐름, 개발/개선 계획
2. **웹 페이지**: Vercel 배포 URL(필수) + GitHub 저장소 링크(필수)
3. **솔루션 PDF**: PPT → PDF 변환, 분량/디자인 제한 없음

### 평가 항목
| 항목 | 배점 | 평가 포인트 |
|------|------|-------------|
| 기본 구현 | 30 | 웹 페이지 구현도, 데이터 기반 렌더링, 필터/정렬 동작, 빈 상태 UI |
| 확장(아이디어) | 30 | 팀 고유 기능/UX 개선의 참신함·실용성, "서비스로서 가치", 일관된 흐름 |
| 완성도 | 25 | 사용성(동선/가독성), 안정성(오류/예외 처리), 성능(로딩/반응성), 접근성/반응형 |
| 문서/설명 | 15 | 기획서의 명확성, PPT 설계/구현 설명력, 재현성 |

### 개발/배포 규칙
- 기술 선택 자유, 바이브 코딩 툴 활용 허용
- Vercel 배포 필수, 심사 기간 동안 외부 접속 가능해야 함
- 예시 자료 외 데이터 미제공 → 더미 데이터/localStorage 활용
- 외부 API/DB 사용 시 심사자가 별도 키 없이 확인 가능해야 함
- 저작권/라이선스 준수 필수
- 심사는 배포 URL 기준, 확인 어려운 기능은 심사 제외 가능

## Architecture

- **프레임워크**: Next.js (App Router)
- **스타일링**: shadcn/ui + Tailwind CSS
- **다크 모드**: next-themes
- **데이터 저장**: localStorage (hackathons, teams/camp, submissions, leaderboards)
- **LLM**: Gemini API (Next.js API Route로 호출, 환경변수로 키 관리)
- **배포**: Vercel (외부 접속 가능한 URL 필수)

## Routes & Pages

| 경로 | 설명 |
|------|------|
| `/` | 메인페이지 - 배너, 해커톤 카드, 팀 모집/랭킹 링크 |
| `/hackathons` | 해커톤 목록 - 카드 리스트, 상태 필터(진행중/종료/예정) |
| `/hackathons/:slug` | 해커톤 상세 - 탭 섹션: 개요, 팀(캠프), 평가, 상금, 안내, 일정, 제출(Submit), 리더보드 |
| `/rankings` | 글로벌 랭킹 - rank/포인트 기반 순위 |
| `/camp` | 팀원 모집 - hackathonSlug로 연결, 팀 리스트/생성 |

## Sample Data

`data/예시자료/` 디렉토리에 API 응답 형태의 JSON 예시 데이터가 있다:
- `public_hackathons.json` - 해커톤 목록 (slug, title, status, tags, period, links)
- `public_hackathon_detail.json` - 해커톤 상세 (sections: overview, info, eval, schedule, prize, teams, submit, leaderboard)
- `public_teams.json` - 팀 목록 (teamCode, hackathonSlug, name, isOpen, memberCount, lookingFor, contact)
- `public_leaderboard.json` - 리더보드 (rank, teamName, score, scoreBreakdown)

## Key Specs from Handwritten Memo (`data/memo.png`)

- 공통: 네비게이션 바 (해커톤 목록/camp/rankings), 다크 모드
- 해커톤 상세의 Teams 섹션에서 해당 해커톤의 팀 목록 확인/생성 가능
- Submit 섹션: 제출 파일/URL 업로드, 메모(notes) optional, 파일은 zip/csv 등(타입에 따라 설정 가능)
- Leaderboard: 제출 기준, 해커톤 설정에 따라 기준 다름 (점수 vs 투표), 제출이 없으면 "아직 리더보드 없음" 표시
- 팀 모집(/camp): 해커톤 연결 필수, 팀 만들기(contact 필수), 모집 분야 설정

## UI Flow Reference

`data/Hackathon-UI-Flow.png` - 전체 페이지 간 네비게이션 흐름도 참고

## 특화기능 초기 아이디어 (원본 보존)
 - llm 접목
 - 인스타 같은 피드로 자랑질
 - 구글시트나 PIGMA 처럼 팀원이 공유/편집/팔로우 가능한 자체 문서 편집기 (기획서나 발표자료를 DACON 내에서 모두 처리)
 - AI 팀원(팀) 매칭 기능 ->
    질의 ("REACT+CSS 기반 프론트엔드 개발자가 필요해", "난 PYTHON 기반 BE인데 기획자가 있는 팀 찾아줘 ") + 사용자 프로필기반 팀원(팀)추천
    > 연결된 팀장-팀원 1:1 채팅기능
    > OR 채용사이트처럼 지원형식

## 확장 기능 (확정)

### Track 1: AI 팀매칭 - 검색형 (필수)
- `/camp` 페이지에 AI 검색창 추가
- 자연어 입력 → Gemini API로 기존 teams 데이터에서 매칭 → 추천 결과 + 근거 표시
- Next.js API Route (`/api/match`)로 Gemini 호출, 키는 환경변수로 숨김

### Track 2: AI 팀매칭 - 대화형 (Track 1 완료 후 시간 되면)
- Track 1에 "AI와 대화로 찾기" 버튼 추가
- 챗봇 UI로 대화하면서 조건을 좁혀가며 추천
- 멀티턴 Gemini 호출 필요

### 서브 기능: 훈수 피드 (프로젝트 쇼케이스)
- 프로젝트 피드: 개발 중인 프로젝트, 팀원, 코드 스니펫 공유
- 훈수: 다른 사람이 코드에 리뷰/조언 달기
- 좋아요: 피드 작성자가 유용한 훈수에 좋아요
- 훈수 자랑: 좋아요 받은 훈수 = 실력 인증 (선순환 구조)
- 구현 방식: 더미 데이터로 체험 가능한 데모 (대회 규칙에 맞게)
 