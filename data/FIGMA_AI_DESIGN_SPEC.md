# Hackathon Platform — Figma AI Design Specification
Version 1.0 | Style: Corporate & Professional | Target: Figma AI (file attachment)

---

## SECTION 1. Design System

### Brand Direction
Design a professional, enterprise-grade hackathon platform.
The visual language should feel trustworthy, clean, and structured — similar to enterprise SaaS products like Notion, Linear, or Atlassian.
Avoid playful or loud aesthetics. Prioritize clarity, hierarchy, and consistency.

### Color Tokens

| Token | Hex | Usage |
|---|---|---|
| color-bg-base | #F8F9FA | Page background |
| color-bg-surface | #FFFFFF | Card, panel background |
| color-bg-subtle | #F1F3F5 | Sidebar, table row alt |
| color-border | #E2E8F0 | Dividers, card borders |
| color-primary | #1D4ED8 | Primary buttons, active states, links |
| color-primary-hover | #1E40AF | Button hover |
| color-primary-subtle | #EFF6FF | Badge background, highlight row |
| color-text-primary | #0F172A | Headings, important content |
| color-text-secondary | #475569 | Body text, descriptions |
| color-text-muted | #94A3B8 | Captions, placeholders |
| color-success | #16A34A | Active/진행중 status |
| color-warning | #D97706 | Upcoming/예정 status |
| color-neutral | #94A3B8 | Closed/마감 status |
| color-gold | #B45309 | 1st place rank |
| color-silver | #64748B | 2nd place rank |
| color-bronze | #92400E | 3rd place rank |

### Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display | Inter | 700 | 36–48px |
| H1 | Inter | 700 | 28px |
| H2 | Inter | 600 | 22px |
| H3 | Inter | 600 | 18px |
| Body | Inter | 400 | 15px |
| Caption | Inter | 400 | 13px |
| Label | Inter | 500 | 13px |
| Mono (scores, numbers) | JetBrains Mono | 600 | 14–20px |

### Spacing Scale
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80px

### Component Styles

**Card**
- Background: color-bg-surface
- Border: 1px solid color-border
- Border radius: 8px
- Shadow: 0 1px 3px rgba(0,0,0,0.06)
- Padding: 24px

**Primary Button**
- Background: color-primary
- Text: white, 14px, weight 500
- Border radius: 6px
- Padding: 10px 20px
- Hover: color-primary-hover

**Secondary Button**
- Background: transparent
- Border: 1px solid color-border
- Text: color-text-primary
- Border radius: 6px

**Badge / Status Tag**
- Border radius: 4px
- Padding: 3px 8px
- Font: 12px, weight 500
- 진행중: green text on light green bg
- 예정: amber text on light amber bg
- 마감: gray text on gray bg

**Input Field**
- Border: 1px solid color-border
- Border radius: 6px
- Padding: 10px 14px
- Focus: border color-primary with subtle blue glow
- Placeholder: color-text-muted

**Tab Navigation**
- Inactive: color-text-secondary, no underline
- Active: color-primary, 2px solid bottom border
- Padding: 12px 16px

**Data Table**
- Header row: color-bg-subtle, label font, uppercase 11px, letter-spacing 0.5px
- Body row: 48px height, bottom border color-border
- Alternating rows: white / color-bg-subtle
- Hover row: color-primary-subtle

---

## SECTION 2. Page Designs

### PAGE 1 — Main `/`

**Purpose:** Entry point. Navigate users to hackathon list or rankings.

**Layout:**
- Top navigation bar: logo left, links right ("해커톤 목록", "랭킹"), white background, bottom border
- Hero section below nav: left-aligned text, max-width 640px, centered vertically in 480px height area
  - Eyebrow label: small uppercase label "HACKATHON PLATFORM"
  - H1 headline: "아이디어를 현실로. 함께 만드는 혁신"
  - Body text: 1–2 lines of description, color-text-secondary
  - Button row: Primary "해커톤 둘러보기" + Secondary "랭킹 보기" side by side
- Background: color-bg-base, subtle dot grid pattern overlay (very low opacity)
- Below hero: Section titled "진행 중인 해커톤" with a horizontal row of 3 hackathon preview cards

---

### PAGE 2 — Hackathon List `/hackathons`

**Purpose:** Browse all hackathons.

**Layout:**
- Page header: H1 "해커톤 목록", subtext showing total count (e.g. "총 12개")
- Filter bar: Status filter tabs ("전체 | 진행중 | 예정 | 마감") on left, Sort dropdown ("최신순") on right
- Card grid: 2 columns, gap 20px

**Hackathon Card contents:**
- Status badge top-left (진행중 / 예정 / 마감)
- Card title: H3, color-text-primary
- Description: 2 lines max, color-text-secondary, 14px
- Divider line
- Bottom info row with icons:
  - 🏆 Prize: monospace font, color-primary
  - 📅 Deadline date
  - 👥 Participant count
- Hover state: subtle box-shadow lift, primary border color

---

### PAGE 3 — Hackathon Detail `/hackathons/:slug` ⭐ CORE PAGE

**Purpose:** Central hub. All hackathon information in one page via tabs.

**Layout — Top area (above tabs):**
- Breadcrumb: 해커톤 목록 > [Hackathon Title]
- H1 hackathon title + status badge inline
- Stats row (3 items, horizontal): 
  - 총 상금: large monospace value (e.g. "₩10,000,000")
  - 참가팀: number
  - 마감까지: D-day countdown
  - Each stat: small gray label above, large value below
- Action buttons top-right: "팀 구성하기" (primary) + "공유" (secondary icon button)

**Tab Navigation (8 tabs):**
개요 | 팀(캠프) | 평가 | 상금 | 안내 | 일정 | 제출 | 리더보드

---

**[개요 탭] Overview**
- Long-form text content area (like a document)
- Use clear section headings (H3), paragraphs
- Sidebar right (desktop): key info summary card (dates, organizer, category tags)

---

**[팀(캠프) 탭] Teams**
- Top bar: team count label + "새 팀 만들기" button (primary, top right)
- Team card grid (2 columns):
  - Team name (H3)
  - Hackathon tag badge
  - Member slot indicator: "3 / 5명" with avatar circle stack
  - Role tags needed: small badges ("백엔드", "프론트엔드", "기획")
  - Short description (2 lines)
  - "합류 신청" button (secondary)

---

**[평가 탭] Evaluation Criteria**
- List of criteria items. Each item:
  - Criterion name (H3) + weight percentage badge (e.g. "30%")
  - Progress bar showing weight (color-primary fill)
  - Description paragraph below

---

**[상금 탭] Prizes**
- Top 3 prize cards in a row:
  - 1st place: large card, gold-accented border, trophy icon, prize amount in large monospace
  - 2nd place: silver-accented
  - 3rd place: bronze-accented
- Below: simple table listing additional prizes (4th place and below)

---

**[안내 탭] Guidelines**
- Accordion-style FAQ list
  - Each row: question text + expand chevron icon
  - Expanded: answer text in indented area
  - Bottom border between items

---

**[일정 탭] Schedule**
- Vertical timeline layout:
  - Left column (80px): date in "MM.DD" format, color-primary, mono font
  - Vertical connecting line between events (color-border)
  - Right column: event title (weight 600) + description (color-text-secondary)
  - Current/upcoming event: highlighted dot on timeline

---

**[제출 탭] Submit**
- Centered form card (max-width 600px):
  - Field: 프로젝트 제목 (text input)
  - Field: GitHub 링크 (URL input)
  - Field: 데모 링크 (URL input, optional)
  - Field: 프로젝트 소개 (textarea, 4 rows)
  - Field: 파일 첨부 (drag-and-drop upload zone — dashed border, upload icon, instruction text)
  - Submit button: full width, primary, "제출하기"
  - Caption below: "제출 후 리더보드에 자동 반영됩니다"

---

**[리더보드 탭] Leaderboard**
- Top 3 highlight cards (horizontal row):
  - Same gold/silver/bronze treatment as prize tab
  - Shows rank number, team name, score
- Full ranking table below:
  - Columns: 순위 | 팀 이름 | 점수 | 제출 시각
  - Rank 1–3 rows: color-primary-subtle background
  - Score: monospace font, color-primary
  - "Last updated" timestamp at bottom right, caption size

---

### PAGE 4 — Rankings `/rankings`

**Purpose:** Global leaderboard across all hackathons.

**Layout:**
- H1 "랭킹" + subtitle "전체 해커톤 종합 순위"
- Podium graphic (top section):
  - Three columns: 2nd (left, slightly lower), 1st (center, elevated), 3rd (right)
  - Each column: medal icon, team name, total score (monospace)
  - 1st column has larger card with gold border accent
- Full table below:
  - Columns: 순위 | 팀 이름 | 참가 해커톤 | 총점 | 제출일
  - Rows 1–3: colored left border (gold/silver/bronze)
  - Clickable rows (hover state) → navigates to /hackathons/:slug

---

### PAGE 5 — Team Recruitment `/camp`

**Purpose:** Browse and create teams.

**Layout:**
- Page header: H1 "팀원 모집", subtext (e.g. "현재 해커톤: AI Challenge 2025")
- Top bar: search input left + "새 팀 만들기" button right (primary)
- Team card grid (2 columns):
  - Team name (H3)
  - Hackathon badge tag (which event they belong to)
  - Member slot: "3 / 5명" — visual slot dots (filled = member, empty = open)
  - Needed roles: small colored badge chips
  - Description: 2 lines
  - "합류 신청" button (secondary, full width at bottom)

**"새 팀 만들기" Modal:**
- Modal card, centered, 480px wide
- Title: "새 팀 만들기" (H2)
- Fields:
  - 팀 이름 (text input)
  - 최대 인원 (number select: 2–8)
  - 모집 역할 (multi-select tag input)
  - 팀 소개 (textarea)
- Footer: Cancel (secondary) + "팀 생성하기" (primary)
- Backdrop: semi-transparent dark overlay

---

## SECTION 3. Responsive Behavior Notes

| Breakpoint | Layout Change |
|---|---|
| Desktop (≥1280px) | 2-column card grids, sidebar on detail page |
| Tablet (768–1279px) | 2-column grids, no sidebar (stats move inline) |
| Mobile (<768px) | 1-column cards, tab nav scrolls horizontally, stats stack vertically |

---

## SECTION 4. Figma File Structure (Recommended)

```
📁 Design System
  └── Colors / Typography / Spacing / Components

📁 Pages
  ├── 01_Main (/)
  ├── 02_Hackathon List (/hackathons)
  ├── 03_Hackathon Detail (/hackathons/:slug)
  │     ├── Tab: 개요
  │     ├── Tab: 팀(캠프)
  │     ├── Tab: 평가
  │     ├── Tab: 상금
  │     ├── Tab: 안내
  │     ├── Tab: 일정
  │     ├── Tab: 제출
  │     └── Tab: 리더보드
  ├── 04_Rankings (/rankings)
  └── 05_Camp (/camp)

📁 Components
  └── Card / Button / Badge / Table / Modal / Tab / Timeline / Form
```

---

## SECTION 5. Design Priority Order

1. **Design System** — tokens and components first, everything builds on this
2. **Page 3: Hackathon Detail** — most complex, establishes all patterns
3. **Page 2: Hackathon List** — reuses cards from detail page
4. **Page 5: Camp** — reuses team card pattern
5. **Page 4: Rankings** — reuses table pattern
6. **Page 1: Main** — reuses cards, simplest to finish last
