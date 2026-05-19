import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfile, uploadAvatar, upsertProfile } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no file" }, { status: 400 });
  }

  const upload = await uploadAvatar(session.user.id, file);
  if (!upload.ok) {
    return NextResponse.json({ error: upload.error }, { status: 400 });
  }

  const existing = await getProfile(session.user.id);
  if (existing) {
    await upsertProfile({ ...existing, photo_url: upload.url });
  }

  return NextResponse.json({ url: upload.url });
}
