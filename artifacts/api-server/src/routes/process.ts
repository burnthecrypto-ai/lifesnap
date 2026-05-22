import { Router } from "express";
import { ProcessInputBody } from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

const DEFAULT_MODEL = "gpt-4o-mini";
const MAX_COMPLETION_TOKENS = 1200;
const DISCLAIMER =
  "LifeSnap is an organisation tool. It is not medical, legal, financial, therapy, or emergency support, and it does not diagnose, treat, prescribe, or replace qualified professionals.";

const SAFETY_TERMS = [
  "suicide",
  "self-harm",
  "self harm",
  "kill myself",
  "hurt myself",
  "harm myself",
  "end my life",
  "take my life",
  "not safe",
  "unsafe",
  "immediate danger",
  "can't keep myself safe",
  "cant keep myself safe",
  "i have a plan",
  "emergency",
];

function hasSafetyTrigger(text: string) {
  const normalized = text.toLowerCase();
  return SAFETY_TERMS.some((term) => normalized.includes(term));
}

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

  if (hasSafetyTrigger(text)) {
    const createdAt = new Date().toISOString();
    res.json({
      diaryEntry: {
        content:
          "I need immediate support and should not try to handle this alone. My next step is to contact emergency help, crisis support, or a trusted person right now.",
        createdAt,
      },
      snapshot: {
        situationSummary:
          "The input included language that may indicate immediate danger or self-harm risk. LifeSnap has stopped normal processing and is returning safety-focused next steps only.",
        keyFacts: [
          "Safety language was detected before AI processing.",
          "No OpenAI request was made for this input.",
          "LifeSnap is not an emergency, medical, or therapy service.",
        ],
        timeline: [{ date: createdAt, event: "Safety mode triggered" }],
        peopleInvolved: ["User", "Trusted person or emergency support"],
        missingInformation: [
          "Whether the user is safe right now",
          "Whether a trusted person can be contacted immediately",
          "Local emergency or crisis support options",
        ],
        risksAndDeadlines: [
          "Potential immediate safety risk",
          "Contact emergency services or crisis support now if there is immediate danger",
        ],
        nextThreeActions: [
          "If there is immediate danger, call local emergency services now.",
          "Contact a trusted person and tell them you need support right now.",
          "Use local crisis support or urgent professional help rather than continuing in the app.",
        ],
        tags: ["Safety", "Urgent", "Support"],
        shareableSummary:
          "I may not be safe right now and need immediate support from emergency services, crisis support, or a trusted person.",
      },
      mode,
      safetyMode: true,
      disclaimer: DISCLAIMER,
    });
    return;
  }

  const systemPrompt = `You are LifeSnap, a compassionate and organised AI life assistant. 
Your role is to help people make sense of messy, stressful, or complex life situations.
You operate in "${modeLabel}" mode.

IMPORTANT SAFETY BOUNDARIES:
- You are NOT a medical professional, legal advisor, financial advisor, therapist, or emergency service.
- Always signpost to professionals for serious matters.
- Never diagnose, prescribe, or give legal/financial advice.
- If there is any mention of immediate danger or emergency, always recommend calling emergency services first.
- Do not provide medical diagnosis, treatment instructions, medication changes, legal strategy, financial advice, therapy, or emergency handling.
- Do not ask for or store raw passwords, private keys, card numbers, banking logins, or secret credentials.
- Do not imply raw audio or video is stored.

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
      model: process.env["AI_OPENAI_MODEL"] || DEFAULT_MODEL,
      max_completion_tokens: MAX_COMPLETION_TOKENS,
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
      safetyMode: false,
      disclaimer: DISCLAIMER,
    });
  } catch (err) {
    req.log.error({ err }, "OpenAI processing error");
    res.status(500).json({ error: "AI processing failed" });
  }
});

export default router;
