import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  const { query, teams, hackathonSlug, role, skills, interests } = await request.json();

  // GEMINI_API_KEY 없으면 에러
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  // hackathonSlug로 teams 필터 (있으면)
  const filteredTeams = hackathonSlug
    ? teams.filter(
        (t: { hackathonSlug: string }) => t.hackathonSlug === hackathonSlug
      )
    : teams;

  // Gemini API 호출
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
5. 매칭되는 팀이 없으면 빈 배열을 반환해.

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

사용자 요청: "${query}"
${userProfileInfo}
팀 목록:
${JSON.stringify(filteredTeams, null, 2)}

## 매칭 규칙
1. **사용자 요청이 최우선 기준이다.** 요청에 언급된 기술/역할/분야와 관련된 팀을 추천해.
2. 팀의 intro, lookingFor, name을 분석해서 사용자 요청과 관련성이 높은 팀을 찾아.
3. 사용자 프로필은 보조 참고용이다. 요청과 충돌하면 요청을 따라.
4. 추천 이유(reason)는 반드시 사용자 요청에 언급된 키워드와의 관련성을 설명해야 한다. 사용자가 요청하지 않은 기술(예: 프로필에만 있는 기술)을 주요 이유로 들지 마.
5. 모집이 마감된 팀(isOpen: false)은 절대 추천하지 마.
6. 매칭되는 팀이 없으면 빈 배열을 반환해.

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
    // JSON 파싱 (```json ... ``` 감싸져있을 수 있음)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response");
    const parsed = JSON.parse(jsonMatch[0]);
    return Response.json(parsed);
  } catch {
    return Response.json(
      { error: "AI 검색에 실패했습니다." },
      { status: 500 }
    );
  }
}
