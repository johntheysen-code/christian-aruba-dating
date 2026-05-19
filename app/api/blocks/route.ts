import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { block, unblock } from "@/lib/supabase";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const blockedId = typeof body?.blocked_id === "string" ? body.blocked_id : null;
  if (!blockedId) {
    return NextResponse.json({ error: "missing blocked_id" }, { status: 400 });
  }
  if (blockedId === session.user.id) {
    return NextResponse.json({ error: "cannot block self" }, { status: 400 });
  }
  await block(session.user.id, blockedId);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const blockedId = typeof body?.blocked_id === "string" ? body.blocked_id : null;
  if (!blockedId) {
    return NextResponse.json({ error: "missing blocked_id" }, { status: 400 });
  }
  await unblock(session.user.id, blockedId);
  return NextResponse.json({ ok: true });
}
