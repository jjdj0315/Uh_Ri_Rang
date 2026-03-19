import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  const { query, teams, hackathonSlug, role } = await request.json();

  // GEMINI_API_KEY 없으면 에러
  const apiKey = process.env.GEMINI_API_KEY;
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

  const systemRole = isTeamMember
    ? "너는 해커톤 팀원 매칭 전문가야. 사용자의 팀에 적합한 팀원(무소속 유저)을 추천해줘. 사용자의 요청과 팀 목록을 보고 가장 적합한 팀원을 찾아줘."
    : "너는 해커톤 팀 매칭 전문가야. 사용자의 요청과 팀 목록을 보고 가장 적합한 팀을 추천해줘.";

  const prompt = `${systemRole}

사용자 요청: "${query}"

팀 목록:
${JSON.stringify(filteredTeams, null, 2)}

반드시 아래 JSON 형식으로만 응답해:
{
  "matches": [
    {
      "teamCode": "팀코드",
      "teamName": "팀이름",
      "reason": "추천 이유 (한국어, 2-3문장)",
      "score": 0.85
    }
  ]
}

모집이 마감된 팀(isOpen: false)은 추천하지 마. 매칭되는 팀이 없으면 빈 배열을 반환해.`;

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
