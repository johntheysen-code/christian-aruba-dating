import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { removeProfilePhoto, setPrimaryPhoto } from "@/lib/supabase";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const action = body?.action;
  const url = typeof body?.url === "string" ? body.url : null;
  if (!url) return NextResponse.json({ error: "missing url" }, { status: 400 });

  if (action === "delete") {
    const photos = await removeProfilePhoto(session.user.id, url);
    return NextResponse.json({ photos });
  }
  if (action === "primary") {
    const photos = await setPrimaryPhoto(session.user.id, url);
    return NextResponse.json({ photos });
  }
  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
