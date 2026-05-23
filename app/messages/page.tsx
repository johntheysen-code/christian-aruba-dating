import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfile, getQuizAnswers, listConversations } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const me = await getProfile(session.user.id);
  if (!me) redirect("/profile/edit");

  const quizCheck = await getQuizAnswers(session.user.id);
  if (quizCheck.length === 0) redirect("/quiz");

  const conversations = await listConversations(session.user.id);

  return (
    <main className="container browse-page">
      <header className="browse-header">
        <h1>Messages</h1>
        <p className="muted">Conversations with your matches.</p>
      </header>

      {conversations.length === 0 ? (
        <div className="empty-state">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/owl-empty.png" alt="" className="empty-illustration" />
          <h2>No conversations yet</h2>
          <p className="muted">
            Match with someone on the{" "}
            <Link href="/browse">Discover</Link> page first. Once you both
            like each other, you can start a conversation here or from your{" "}
            <Link href="/matches">matches</Link>.
          </p>
        </div>
      ) : (
        <ul className="conversation-list">
          {conversations.map((c) => (
            <li key={c.partner.user_id}>
              <Link
                href={`/messages/${c.partner.user_id}`}
                className="conversation-row"
              >
                <div className="conv-photo">
                  {c.partner.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.partner.photo_url} alt="" />
                  ) : (
                    <div className="photo-placeholder small">
                      {c.partner.display_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="conv-body">
                  <div className="conv-top">
                    <strong>{c.partner.display_name}</strong>
                    {c.unread_count > 0 && (
                      <span className="unread-badge">{c.unread_count}</span>
                    )}
                  </div>
                  <p className="conv-preview muted">
                    {c.last_message
                      ? (c.last_message.sender_id === session.user.id ? "You: " : "") +
                        c.last_message.body
                      : "Say hello 👋"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
