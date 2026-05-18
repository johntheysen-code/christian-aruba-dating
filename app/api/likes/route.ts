import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { like, unlike } from "@/lib/supabase";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const likedId = typeof body?.liked_id === "string" ? body.liked_id : null;
  if (!likedId) {
    return NextResponse.json({ error: "missing liked_id" }, { status: 400 });
  }
  if (likedId === session.user.id) {
    return NextResponse.json({ error: "cannot like yourself" }, { status: 400 });
  }

  const result = await like(session.user.id, likedId);
  return NextResponse.json(result);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const likedId = typeof body?.liked_id === "string" ? body.liked_id : null;
  if (!likedId) {
    return NextResponse.json({ error: "missing liked_id" }, { status: 400 });
  }

  await unlike(session.user.id, likedId);
  return NextResponse.json({ ok: true });
}
