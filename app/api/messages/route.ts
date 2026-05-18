import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isMatched, sendMessage } from "@/lib/supabase";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const recipientId = typeof body?.recipient_id === "string" ? body.recipient_id : null;
  const text = typeof body?.body === "string" ? body.body.trim() : "";

  if (!recipientId) {
    return NextResponse.json({ error: "missing recipient_id" }, { status: 400 });
  }
  if (text.length === 0 || text.length > 2000) {
    return NextResponse.json(
      { error: "Message must be 1-2000 characters" },
      { status: 400 }
    );
  }
  if (recipientId === session.user.id) {
    return NextResponse.json({ error: "cannot message yourself" }, { status: 400 });
  }

  const matched = await isMatched(session.user.id, recipientId);
  if (!matched) {
    return NextResponse.json(
      { error: "You can only message people you've matched with" },
      { status: 403 }
    );
  }

  const message = await sendMessage(session.user.id, recipientId, text);
  if (!message) {
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
  return NextResponse.json({ message });
}
