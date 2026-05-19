import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getLikedIds,
  getProfile,
  isMatched,
} from "@/lib/supabase";
import { LikeButton } from "@/app/components/LikeButton";

export const dynamic = "force-dynamic";

export default async function ProfileDetailPage({
  params,
}: {
  params: { userId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const me = await getProfile(session.user.id);
  if (!me) redirect("/profile/edit");

  const profile = await getProfile(params.userId);
  if (!profile) notFound();

  const isSelf = profile.user_id === session.user.id;
  const [likedIds, matched] = await Promise.all([
    isSelf ? Promise.resolve(new Set<string>()) : getLikedIds(session.user.id),
    isSelf ? Promise.resolve(false) : isMatched(session.user.id, params.userId),
  ]);

  return (
    <main className="container detail-page">
      <Link href="/browse" className="back-link">
        ← Back to Discover
      </Link>

      <div className="detail-hero">
        {profile.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.photo_url}
            alt={`${profile.display_name}'s photo`}
            className="detail-photo"
          />
        ) : (
          <div className="detail-photo placeholder">
            {profile.display_name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="detail-head">
          <h1>
            {profile.display_name}
            {profile.age && <span className="age">, {profile.age}</span>}
          </h1>
          <div className="card-meta">
            {profile.denomination && (
              <span className="tag">⛪ {profile.denomination}</span>
            )}
            {profile.location && (
              <span className="tag">🏝️ {profile.location}</span>
            )}
          </div>
          {profile.church_name && (
            <p className="muted">{profile.church_name}</p>
          )}

          <div className="detail-actions">
            {isSelf ? (
              <Link href="/profile/edit" className="btn btn-facebook">
                Edit profile
              </Link>
            ) : (
              <>
                <LikeButton
                  likedId={profile.user_id}
                  initialLiked={likedIds.has(profile.user_id)}
                  displayName={profile.display_name}
                />
                {matched && (
                  <Link
                    href={`/messages/${profile.user_id}`}
                    className="btn btn-facebook"
                  >
                    Send message
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {profile.bio && (
        <section className="detail-section">
          <h2>About</h2>
          <p className="detail-bio">{profile.bio}</p>
        </section>
      )}
    </main>
  );
}
