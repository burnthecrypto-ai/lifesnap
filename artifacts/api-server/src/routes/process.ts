import { Router } from "express";
import { ProcessInputBody } from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

router.post("/process", async (req, res) => {
  const parsed = ProcessInputBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { text, mode } = parsed.data;

  const modeLabels: Record<string, string> = {
    ai_recommended: "AI Recommended",
    life_admin: "Life Admin",
    health: "Health Appointment Prep",
    legal: "Legal / Incident Timeline",
    business: "Business Build",
    legacy: "Legacy / Final Admin",
    diary: "Diary / Daily Reflection",
  };

  const modeLabel = modeLabels[mode] ?? mode;

  const systemPrompt = `You are LifeSnap, a compassionate and organised AI life assistant. 
Your role is to help people make sense of messy, stressful, or complex life situations.
You operate in "${modeLabel}" mode.

IMPORTANT SAFETY BOUNDARIES:
- You are NOT a medical professional, legal advisor, financial advisor, therapist, or emergency service.
- Always signpost to professionals for serious matters.
- Never diagnose, prescribe, or give legal/financial advice.
- If there is any mention of immediate danger or emergency, always recommend calling emergency services first.

When given a life situation, you produce two outputs:
1. A short, warm personal diary entry (2-4 sentences, first person, present tense, empathetic tone)
2. A structured LifeSnap Snapshot with all required fields

Return ONLY valid JSON with this exact structure:
{
  "diaryEntry": {
    "content": "string - warm personal diary entry",
    "createdAt": "ISO 8601 timestamp"
  },
  "snapshot": {
    "situationSummary": "string - clear 2-3 sentence summary",
    "keyFacts": ["array of key facts as strings"],
    "timeline": [{"date": "string", "event": "string"}],
    "peopleInvolved": ["names or roles of people involved"],
    "missingInformation": ["things that are unclear or need clarifying"],
    "risksAndDeadlines": ["any risks, deadlines, or urgent items"],
    "nextThreeActions": ["action 1", "action 2", "action 3"],
    "tags": ["relevant tags like Health, Legal, Urgent, etc."],
    "shareableSummary": "string - a clear 1-2 sentence summary suitable for sharing with a professional"
  }
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 2048,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Mode: ${modeLabel}\n\nSituation:\n${text}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let parsed: { diaryEntry?: unknown; snapshot?: unknown };
    try {
      parsed = JSON.parse(raw);
    } catch {
      req.log.error({ raw }, "Failed to parse OpenAI JSON response");
      res.status(500).json({ error: "Failed to parse AI response" });
      return;
    }

    res.json({
      diaryEntry: parsed.diaryEntry,
      snapshot: parsed.snapshot,
      mode,
    });
  } catch (err) {
    req.log.error({ err }, "OpenAI processing error");
    res.status(500).json({ error: "AI processing failed" });
  }
});

export default router;
