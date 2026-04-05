import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  const body = await request.json();
  const { mode } = body;

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

  // 팀장이 팀원을 찾는 모드
  if (mode === "recruit") {
    return handleRecruit(model, body);
  }

  // 기존 팀 매칭 모드
  return handleTeamMatch(model, body);
}

// ─── 팀장 → 팀원 추천 ───
async function handleRecruit(
  model: ReturnType<InstanceType<typeof GoogleGenerativeAI>["getGenerativeModel"]>,
  body: Record<string, unknown>
) {
  const { query, candidates, teamInfo } = body as {
    query: string;
    candidates: { nickname: string; skills: string[]; interests: string[] }[];
    teamInfo: { name: string; hackathonTitle: string; lookingFor: string[]; intro: string };
  };

  const prompt = `너는 해커톤 팀원 추천 전문가야. 팀장이 원하는 조건에 맞는 사람을 후보 목록에서 추천해줘.

팀장 요청: "${query}"

팀 정보:
- 팀명: ${teamInfo.name}
- 해커톤: ${teamInfo.hackathonTitle}
- 모집 분야: ${teamInfo.lookingFor.join(", ") || "미정"}
- 팀 소개: ${teamInfo.intro || "없음"}

후보자 목록:
${JSON.stringify(candidates, null, 2)}

## 매칭 규칙
1. **팀장의 요청이 최우선 기준이다.** 요청에 언급된 기술/역할/조건을 가장 중요하게 반영해.
2. 후보자의 skills와 interests를 분석해서 요청과의 적합도를 판단해.
3. 팀의 lookingFor 분야와도 매칭되면 점수를 높여줘.
4. 추천 이유는 반드시 팀장의 요청 키워드와 후보자의 구체적 스킬을 연결해서 설명해.
5. **요청이 해커톤/개발/IT과 무관하거나, 적합한 후보가 없으면 반드시 빈 배열 \`{"matches": []}\`을 반환해. 억지로 매칭하지 마.**
6. 최대 5명까지 추천해.

## 점수 산정 기준 (score 0.0 ~ 1.0)
- 키워드 일치 (0.3): 요청 키워드가 후보자의 skills/interests에 직접 포함되는가
- 기술스택 매칭 (0.4): 요청한 기술과 후보자의 skills가 일치하는가
- 역할 매칭 (0.3): 팀의 lookingFor와 후보자의 역량이 부합하는가
- 3개 기준의 합산이 score다. **0.5 미만이면 결과에 포함하지 마.**

반드시 아래 JSON 형식으로만 응답해:
{
  "matches": [
    {
      "nickname": "후보자닉네임",
      "reason": "추천 이유 (한국어, 2-3문장)",
      "score": 0.85
    }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");
    const parsed = JSON.parse(jsonMatch[0]);
    if (parsed.matches) {
      parsed.matches = parsed.matches.filter(
        (m: { score?: number }) => (m.score ?? 0) > 0.5
      );
    }
    return Response.json(parsed);
  } catch (err) {
    console.error("[recruit] AI match error:", err);
    return Response.json(
      { error: "AI 검색에 실패했습니다." },
      { status: 500 }
    );
  }
}

// ─── 기존 팀 매칭 ───
async function handleTeamMatch(
  model: ReturnType<InstanceType<typeof GoogleGenerativeAI>["getGenerativeModel"]>,
  body: Record<string, unknown>
) {
  const { query, teams, hackathonSlug, role, skills, interests } = body as {
    query: string;
    teams: { hackathonSlug: string; isOpen: boolean }[];
    hackathonSlug?: string;
    role?: string;
    skills?: string[];
    interests?: string[];
  };

  const filteredTeams = hackathonSlug
    ? teams.filter((t) => t.hackathonSlug === hackathonSlug)
    : teams;

  const isTeamMember = role === "leader" || role === "member";

  const userProfileInfo =
    skills?.length || interests?.length
      ? `\n참고) 사용자 프로필 (보조 정보로만 활용):\n- 기술 스택: ${(skills ?? []).join(", ") || "미설정"}\n- 관심 분야: ${(interests ?? []).join(", ") || "미설정"}\n`
      : "";

  const prompt = isTeamMember
    ? `너는 해커톤 팀원 매칭 전문가야. 사용자의 팀에 적합한 팀원(무소속 유저)을 추천해줘.

사용자 요청: "${query}"
${userProfileInfo}
팀 목록:
${JSON.stringify(filteredTeams, null, 2)}

## 매칭 규칙
1. **사용자 요청이 최우선 기준이다.** 요청에 언급된 기술/역할/조건을 가장 중요하게 반영해.
2. 사용자 프로필은 보조 참고용이다. 요청과 충돌하면 요청을 따라.
3. 추천 이유(reason)는 반드시 사용자 요청과의 관련성을 설명해야 한다.
4. 모집이 마감된 팀(isOpen: false)은 절대 추천하지 마.
5. **요청이 해커톤/개발/IT과 무관하거나, 요청 조건에 맞는 팀이 없으면 반드시 빈 배열 \`{"matches": []}\`을 반환해. 억지로 매칭하지 마.**

## 점수 산정 기준 (score 0.0 ~ 1.0)
- 키워드 일치 (0.3): 사용자 요청의 키워드가 팀의 intro/name에 직접 언급되는가
- 기술스택 매칭 (0.4): 요청한 기술/분야와 팀의 lookingFor/intro가 일치하는가
- 역할 매칭 (0.3): 요청한 역할(프론트/백엔드/기획 등)을 팀이 모집 중인가
- 3개 기준의 합산이 score다. **0.5 미만이면 결과에 포함하지 마.**

반드시 아래 JSON 형식으로만 응답해:
{
  "matches": [
    {
      "teamCode": "팀코드",
      "teamName": "팀이름",
      "reason": "추천 이유 (한국어, 2-3문장, 사용자 요청과의 관련성 중심)",
      "score": 0.85
    }
  ]
}`
    : `너는 해커톤 팀 매칭 전문가야. 사용자가 참여하고 싶은 팀을 찾아줘.

**중요: 요청과 팀 사이에 IT/개발 분야에서의 실질적 관련성이 있어야 매칭이다. "농부→녹색→GreenAI" 같은 단어 유사성만으로 연결하지 마. 단, "파이썬→Python 백엔드 팀"처럼 기술적으로 직결되는 경우는 적극 매칭해.**

사용자 요청: "${query}"
${userProfileInfo}
팀 목록:
${JSON.stringify(filteredTeams, null, 2)}

## 매칭 규칙
1. **사용자 요청이 최우선 기준이다.** 요청에 언급된 기술/역할/분야와 관련된 팀을 추천해.
2. 팀의 intro, lookingFor, name을 분석해서 사용자 요청과 관련성이 높은 팀을 찾아.
3. 사용자 프로필은 보조 참고용이다. 요청과 충돌하면 요청을 따라.
4. 추천 이유(reason)는 반드시 사용자 요청에 언급된 키워드와의 관련성을 설명해야 한다.
5. 모집이 마감된 팀(isOpen: false)은 절대 추천하지 마.
6. **요청이 해커톤/개발/IT과 무관하거나, 요청 조건에 맞는 팀이 없으면 반드시 빈 배열 \`{"matches": []}\`을 반환해. 억지로 매칭하지 마.**

## 점수 산정 기준 (score 0.0 ~ 1.0)
- 키워드 일치 (0.3): 사용자 요청의 키워드가 팀의 intro/name에 직접 언급되는가
- 기술스택 매칭 (0.4): 요청한 기술/분야와 팀의 lookingFor/intro가 일치하는가
- 역할 매칭 (0.3): 요청한 역할(프론트/백엔드/기획 등)을 팀이 모집 중인가
- 3개 기준의 합산이 score다. **0.5 미만이면 결과에 포함하지 마.**

반드시 아래 JSON 형식으로만 응답해:
{
  "matches": [
    {
      "teamCode": "팀코드",
      "teamName": "팀이름",
      "reason": "추천 이유 (한국어, 2-3문장, 사용자 요청과의 관련성 중심)",
      "score": 0.85
    }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");
    const parsed = JSON.parse(jsonMatch[0]);
    if (parsed.matches) {
      parsed.matches = parsed.matches.filter(
        (m: { score?: number }) => (m.score ?? 0) > 0.5
      );
    }
    return Response.json(parsed);
  } catch (err) {
    console.error("[teamMatch] AI match error:", err);
    return Response.json(
      { error: "AI 검색에 실패했습니다." },
      { status: 500 }
    );
  }
}
