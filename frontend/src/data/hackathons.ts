import type { Hackathon } from "@/lib/types";

export const hackathons: Hackathon[] = [
  {
    slug: "aimers-8-model-lite",
    title: "Aimers 8기 : 모델 경량화 온라인 해커톤",
    status: "ended",
    tags: ["LLM", "Compression", "vLLM"],
    thumbnailUrl: "https://example.com/public/img/aimers8.png",
    period: {
      timezone: "Asia/Seoul",
      submissionDeadlineAt: "2026-02-25T10:00:00+09:00",
      endAt: "2026-02-26T10:00:00+09:00",
    },
    links: {
      detail: "/hackathons/aimers-8-model-lite",
      rules: "https://example.com/public/rules/aimers8",
      faq: "https://example.com/public/faq/aimers8",
    },
  },
  {
    slug: "monthly-vibe-coding-2026-02",
    title: "월간 해커톤 : 바이브 코딩 개선 AI 아이디어 공모전 (2026.02)",
    status: "ongoing",
    tags: ["Idea", "GenAI", "Workflow"],
    thumbnailUrl: "https://example.com/public/img/vibe202602.png",
    period: {
      timezone: "Asia/Seoul",
      submissionDeadlineAt: "2026-03-03T10:00:00+09:00",
      endAt: "2026-03-09T10:00:00+09:00",
    },
    links: {
      detail: "/hackathons/monthly-vibe-coding-2026-02",
      rules: "https://example.com/public/rules/vibe202602",
      faq: "https://example.com/public/faq/vibe202602",
    },
  },
  {
    slug: "daker-handover-2026-03",
    title: "긴급 인수인계 해커톤: 명세서만 보고 구현하라",
    status: "upcoming",
    tags: ["VibeCoding", "Web", "Vercel", "Handover"],
    thumbnailUrl: "https://example.com/public/img/daker-handover-202603.png",
    period: {
      timezone: "Asia/Seoul",
      submissionDeadlineAt: "2026-03-30T10:00:00+09:00",
      endAt: "2026-04-27T10:00:00+09:00",
    },
    links: {
      detail: "/hackathons/daker-handover-2026-03",
      rules: "https://example.com/public/rules/daker-handover-202603",
      faq: "https://example.com/public/faq/daker-handover-202603",
    },
  },
  {
    slug: "cv-object-detection-2026",
    title: "CV 객체 인식 챌린지 2026",
    status: "ongoing",
    tags: ["ComputerVision", "ObjectDetection", "YOLO"],
    thumbnailUrl: "https://example.com/public/img/cv-objdet-2026.png",
    period: {
      timezone: "Asia/Seoul",
      submissionDeadlineAt: "2026-04-10T10:00:00+09:00",
      endAt: "2026-04-15T10:00:00+09:00",
    },
    links: {
      detail: "/hackathons/cv-object-detection-2026",
      rules: "https://example.com/public/rules/cv-objdet-2026",
      faq: "https://example.com/public/faq/cv-objdet-2026",
    },
  },
  {
    slug: "fintech-fraud-detection",
    title: "핀테크 이상거래 탐지 AI 해커톤",
    status: "ongoing",
    tags: ["Fintech", "AnomalyDetection", "Tabular"],
    thumbnailUrl: "https://example.com/public/img/fintech-fraud.png",
    period: {
      timezone: "Asia/Seoul",
      submissionDeadlineAt: "2026-04-05T10:00:00+09:00",
      endAt: "2026-04-12T10:00:00+09:00",
    },
    links: {
      detail: "/hackathons/fintech-fraud-detection",
      rules: "https://example.com/public/rules/fintech-fraud",
      faq: "https://example.com/public/faq/fintech-fraud",
    },
  },
  {
    slug: "nlp-sentiment-2025",
    title: "NLP 감성 분석 경진대회 2025",
    status: "ended",
    tags: ["NLP", "SentimentAnalysis", "BERT"],
    thumbnailUrl: "https://example.com/public/img/nlp-sentiment-2025.png",
    period: {
      timezone: "Asia/Seoul",
      submissionDeadlineAt: "2025-12-20T10:00:00+09:00",
      endAt: "2025-12-25T10:00:00+09:00",
    },
    links: {
      detail: "/hackathons/nlp-sentiment-2025",
      rules: "https://example.com/public/rules/nlp-sentiment-2025",
      faq: "https://example.com/public/faq/nlp-sentiment-2025",
    },
  },
  {
    slug: "open-data-visualization",
    title: "공공데이터 시각화 공모전",
    status: "ended",
    tags: ["DataViz", "OpenData", "Dashboard"],
    thumbnailUrl: "https://example.com/public/img/open-data-viz.png",
    period: {
      timezone: "Asia/Seoul",
      submissionDeadlineAt: "2026-01-15T10:00:00+09:00",
      endAt: "2026-01-20T10:00:00+09:00",
    },
    links: {
      detail: "/hackathons/open-data-visualization",
      rules: "https://example.com/public/rules/open-data-viz",
      faq: "https://example.com/public/faq/open-data-viz",
    },
  },
  {
    slug: "rag-chatbot-challenge",
    title: "RAG 기반 도메인 챗봇 구축 챌린지",
    status: "upcoming",
    tags: ["RAG", "LLM", "Chatbot", "VectorDB"],
    thumbnailUrl: "https://example.com/public/img/rag-chatbot.png",
    period: {
      timezone: "Asia/Seoul",
      submissionDeadlineAt: "2026-05-10T10:00:00+09:00",
      endAt: "2026-05-20T10:00:00+09:00",
    },
    links: {
      detail: "/hackathons/rag-chatbot-challenge",
      rules: "https://example.com/public/rules/rag-chatbot",
      faq: "https://example.com/public/faq/rag-chatbot",
    },
  },
  {
    slug: "sustainable-energy-ai",
    title: "지속가능 에너지 AI 예측 해커톤",
    status: "upcoming",
    tags: ["TimeSeries", "Energy", "Sustainability"],
    thumbnailUrl: "https://example.com/public/img/sustainable-energy.png",
    period: {
      timezone: "Asia/Seoul",
      submissionDeadlineAt: "2026-06-01T10:00:00+09:00",
      endAt: "2026-06-10T10:00:00+09:00",
    },
    links: {
      detail: "/hackathons/sustainable-energy-ai",
      rules: "https://example.com/public/rules/sustainable-energy",
      faq: "https://example.com/public/faq/sustainable-energy",
    },
  },
];
