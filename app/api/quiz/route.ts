import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveQuizAnswers } from "@/lib/supabase";
import { QUIZ_QUESTIONS } from "@/lib/quiz";

const QUESTION_LOOKUP = new Map(QUIZ_QUESTIONS.map((q) => [q.id, q]));

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const raw = Array.isArray(body?.answers) ? body.answers : null;
  if (!raw) {
    return NextResponse.json({ error: "missing answers" }, { status: 400 });
  }

  const cleaned: Array<{ question_id: string; answer_index: number }> = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const qid = typeof entry.question_id === "string" ? entry.question_id : null;
    const idx = Number(entry.answer_index);
    if (!qid) continue;
    const q = QUESTION_LOOKUP.get(qid);
    if (!q) continue;
    if (!Number.isInteger(idx) || idx < 0 || idx >= q.options.length) continue;
    cleaned.push({ question_id: qid, answer_index: idx });
  }

  const result = await saveQuizAnswers(session.user.id, cleaned);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "save failed" },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, count: cleaned.length });
}
