import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteUserAccount } from "@/lib/supabase";

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ok = await deleteUserAccount(session.user.id);
  if (!ok) {
    return NextResponse.json({ error: "delete failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
