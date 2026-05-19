import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createReport, block } from "@/lib/supabase";

const REASONS = new Set([
  "fake_profile",
  "inappropriate",
  "harassment",
  "spam",
  "underage",
  "other",
]);

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const reportedId = typeof body?.reported_id === "string" ? body.reported_id : null;
  const reason = typeof body?.reason === "string" ? body.reason : null;
  const details = typeof body?.details === "string" ? body.details.slice(0, 1000) : null;

  if (!reportedId || !reason || !REASONS.has(reason)) {
    return NextResponse.json({ error: "invalid report" }, { status: 400 });
  }
  if (reportedId === session.user.id) {
    return NextResponse.json({ error: "cannot report self" }, { status: 400 });
  }

  const ok = await createReport(session.user.id, reportedId, reason, details);
  if (!ok) {
    return NextResponse.json({ error: "report failed" }, { status: 500 });
  }
  await block(session.user.id, reportedId);
  return NextResponse.json({ ok: true });
}
