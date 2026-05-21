import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pass } from "@/lib/supabase";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const passedId = typeof body?.passed_id === "string" ? body.passed_id : null;
  if (!passedId) {
    return NextResponse.json({ error: "missing passed_id" }, { status: 400 });
  }
  if (passedId === session.user.id) {
    return NextResponse.json({ error: "cannot pass self" }, { status: 400 });
  }
  const result = await pass(session.user.id, passedId);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "pass failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
