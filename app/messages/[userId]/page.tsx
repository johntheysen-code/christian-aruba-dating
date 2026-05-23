import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getProfile,
  getQuizAnswers,
  isMatched,
  listThread,
  markThreadRead,
} from "@/lib/supabase";
import { MessageForm } from "./MessageForm";

export const dynamic = "force-dynamic";

export default async function ThreadPage({
  params,
}: {
  params: { userId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const me = await getProfile(session.user.id);
  if (!me) redirect("/profile/edit");

  const quizCheck = await getQuizAnswers(session.user.id);
  if (quizCheck.length === 0) redirect("/quiz");

  const partner = await getProfile(params.userId);
  if (!partner) redirect("/messages");

  const matched = await isMatched(session.user.id, params.userId);
  if (!matched) redirect("/matches");

  await markThreadRead(session.user.id, params.userId);
  const messages = await listThread(session.user.id, params.userId);

  return (
    <main className="container thread-page">
      <header className="thread-header">
        <Link href="/messages" className="back-link">
          ← Messages
        </Link>
        <div className="thread-partner">
          {partner.photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={partner.photo_url} alt="" className="thread-avatar" />
          )}
          <div>
            <h1>{partner.display_name}</h1>
            {partner.location && (
              <p className="muted small">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/divi.png" alt="" className="tag-divi" />
                {partner.location}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="thread-body">
        {messages.length === 0 ? (
          <div className="thread-empty">
            <p className="muted">
              No messages yet. Say hi to {partner.display_name} 👋
            </p>
          </div>
        ) : (
          <ul className="message-list">
            {messages.map((m) => (
              <li
                key={m.id}
                className={`bubble ${
                  m.sender_id === session.user.id ? "mine" : "theirs"
                }`}
              >
                <p>{m.body}</p>
                <span className="bubble-time">
                  {new Date(m.created_at).toLocaleString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <MessageForm recipientId={params.userId} partnerName={partner.display_name} />
    </main>
  );
}
