import type { UserAccount } from "@/lib/types";

export const users: UserAccount[] = [
  // ── 여러 해커톤 참여 유저 ──
  {
    id: "minsu",
    password: "1234",
    nickname: "김민수",
    skills: ["Python", "PyTorch", "Docker"],
    interests: ["AI/ML", "Backend"],
    teams: [
      { hackathonSlug: "aimers-8-model-lite", teamCode: "T-ALPHA", teamName: "Team Alpha", role: "leader" },
      { hackathonSlug: "cv-object-detection-2026", teamCode: "T-YOLO-TEAM", teamName: "YOLO Warriors", role: "member" },
    ],
  },
  {
    id: "seoyeon",
    password: "1234",
    nickname: "박서연",
    skills: ["React", "Next.js", "Figma"],
    interests: ["Frontend", "Design"],
    teams: [
      { hackathonSlug: "monthly-vibe-coding-2026-02", teamCode: "T-BETA", teamName: "PromptRunners", role: "leader" },
      { hackathonSlug: "daker-handover-2026-03", teamCode: "T-HANDOVER-01", teamName: "404found", role: "member" },
    ],
  },

  // ── 단일 해커톤 팀장들 ──
  {
    id: "jungho",
    password: "1234",
    nickname: "이정호",
    skills: ["Python", "TensorFlow", "AWS"],
    interests: ["AI/ML", "DevOps"],
    teams: [
      { hackathonSlug: "aimers-8-model-lite", teamCode: "T-QUANT", teamName: "QuantSquad", role: "leader" },
    ],
  },
  {
    id: "dohyun",
    password: "1234",
    nickname: "최도현",
    skills: ["Node.js", "TypeScript", "Docker"],
    interests: ["Backend", "DevOps"],
    teams: [
      { hackathonSlug: "monthly-vibe-coding-2026-02", teamCode: "T-VIBE-FLOW", teamName: "VibeFlow", role: "leader" },
    ],
  },
  {
    id: "jiwoo",
    password: "1234",
    nickname: "한지우",
    skills: ["React", "Next.js", "TypeScript"],
    interests: ["Frontend", "Planning"],
    teams: [
      { hackathonSlug: "daker-handover-2026-03", teamCode: "T-HANDOVER-01", teamName: "404found", role: "leader" },
    ],
  },
  {
    id: "woojin",
    password: "1234",
    nickname: "정우진",
    skills: ["Java", "Spring", "AWS"],
    interests: ["Backend", "DevOps"],
    teams: [
      { hackathonSlug: "daker-handover-2026-03", teamCode: "T-HANDOVER-02", teamName: "LGTM", role: "leader" },
    ],
  },
  {
    id: "haneul",
    password: "1234",
    nickname: "송하늘",
    skills: ["Python", "FastAPI", "React"],
    interests: ["Backend", "Frontend"],
    teams: [
      { hackathonSlug: "daker-handover-2026-03", teamCode: "T-HANDOVER-03", teamName: "ShipIt", role: "leader" },
    ],
  },
  {
    id: "taeyoung",
    password: "1234",
    nickname: "강태영",
    skills: ["Python", "PyTorch", "Docker"],
    interests: ["AI/ML", "Data"],
    teams: [
      { hackathonSlug: "cv-object-detection-2026", teamCode: "T-YOLO-TEAM", teamName: "YOLO Warriors", role: "leader" },
    ],
  },
  {
    id: "seungjun",
    password: "1234",
    nickname: "오승준",
    skills: ["Python", "TensorFlow", "Docker"],
    interests: ["AI/ML", "Data"],
    teams: [
      { hackathonSlug: "cv-object-detection-2026", teamCode: "T-CV-LAB", teamName: "CV Research Lab", role: "leader" },
    ],
  },
  {
    id: "yejin",
    password: "1234",
    nickname: "윤예진",
    skills: ["Python", "PyTorch", "AWS"],
    interests: ["AI/ML", "DevOps"],
    teams: [
      { hackathonSlug: "cv-object-detection-2026", teamCode: "T-BBOX", teamName: "BoundingBox", role: "leader" },
    ],
  },
  {
    id: "subin",
    password: "1234",
    nickname: "임수빈",
    skills: ["Python", "Django", "PostgreSQL"],
    interests: ["Backend", "Data"],
    teams: [
      { hackathonSlug: "fintech-fraud-detection", teamCode: "T-FINAI", teamName: "FinAI Guardians", role: "leader" },
    ],
  },
  {
    id: "junhyuk",
    password: "1234",
    nickname: "배준혁",
    skills: ["Python", "XGBoost", "React"],
    interests: ["AI/ML", "Frontend"],
    teams: [
      { hackathonSlug: "fintech-fraud-detection", teamCode: "T-FRAUD-DET", teamName: "FraudBusters", role: "leader" },
    ],
  },
  {
    id: "eunseo",
    password: "1234",
    nickname: "조은서",
    skills: ["Python", "PyTorch", "NLP"],
    interests: ["AI/ML", "Data"],
    teams: [
      { hackathonSlug: "nlp-sentiment-2025", teamCode: "T-SENTIMENT", teamName: "SentiMasters", role: "leader" },
    ],
  },
  {
    id: "donggeon",
    password: "1234",
    nickname: "신동건",
    skills: ["Python", "TensorFlow"],
    interests: ["AI/ML"],
    teams: [
      { hackathonSlug: "nlp-sentiment-2025", teamCode: "T-NLP-CREW", teamName: "NLP Crew", role: "leader" },
    ],
  },
  {
    id: "jimin",
    password: "1234",
    nickname: "양지민",
    skills: ["React", "D3.js", "Next.js"],
    interests: ["Frontend", "Data"],
    teams: [
      { hackathonSlug: "open-data-visualization", teamCode: "T-DATAVIZ", teamName: "DataCanvas", role: "leader" },
    ],
  },
  {
    id: "sihyun",
    password: "1234",
    nickname: "권시현",
    skills: ["Python", "LangChain", "FastAPI"],
    interests: ["AI/ML", "Backend"],
    teams: [
      { hackathonSlug: "rag-chatbot-challenge", teamCode: "T-RAGBOT", teamName: "RAGnarok", role: "leader" },
    ],
  },
  {
    id: "jaewon",
    password: "1234",
    nickname: "문재원",
    skills: ["Python", "Django", "Docker"],
    interests: ["Backend", "Data"],
    teams: [
      { hackathonSlug: "rag-chatbot-challenge", teamCode: "T-VECTOR", teamName: "VectorMinds", role: "leader" },
    ],
  },
  {
    id: "haeun",
    password: "1234",
    nickname: "류하은",
    skills: ["Python", "Pandas", "Scikit-learn"],
    interests: ["Data", "AI/ML"],
    teams: [
      { hackathonSlug: "sustainable-energy-ai", teamCode: "T-GREENAI", teamName: "GreenAI", role: "leader" },
    ],
  },

  // ── 팀원들 ──
  {
    id: "yuna",
    password: "1234",
    nickname: "장유나",
    skills: ["React", "TypeScript"],
    interests: ["Frontend"],
    teams: [
      { hackathonSlug: "monthly-vibe-coding-2026-02", teamCode: "T-BETA", teamName: "PromptRunners", role: "member" },
    ],
  },
  {
    id: "minji",
    password: "1234",
    nickname: "김민지",
    skills: ["Figma", "UI/UX"],
    interests: ["Design", "Frontend"],
    teams: [
      { hackathonSlug: "daker-handover-2026-03", teamCode: "T-HANDOVER-01", teamName: "404found", role: "member" },
    ],
  },

  // ── 무소속 유저들 ──
  {
    id: "hyunwoo",
    password: "1234",
    nickname: "김현우",
    skills: ["React", "Next.js", "TypeScript"],
    interests: ["Frontend"],
    teams: [],
  },
  {
    id: "soojin",
    password: "1234",
    nickname: "이수진",
    skills: ["Python", "FastAPI", "Docker"],
    interests: ["Backend", "DevOps"],
    teams: [],
  },
  {
    id: "jihoon",
    password: "1234",
    nickname: "박지훈",
    skills: ["Figma", "UI/UX", "React"],
    interests: ["Design", "Frontend"],
    teams: [],
  },
];
