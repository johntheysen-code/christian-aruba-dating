import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getLikedIds,
  getProfile,
  isBlocked,
  isMatched,
} from "@/lib/supabase";
import { LikeButton } from "@/app/components/LikeButton";
import { ProfileActions } from "@/app/components/ProfileActions";

export const dynamic = "force-dynamic";

const ATTENDANCE_LABELS: Record<string, string> = {
  weekly: "Every week",
  multiple: "Multiple times a week",
  monthly: "A few times a month",
  occasionally: "Occasionally",
  rarely: "Rarely",
};

const PRAYER_LABELS: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  occasionally: "Occasionally",
};

const MARRIAGE_LABELS: Record<string, string> = {
  ready: "Ready for marriage",
  open: "Open to marriage in time",
  taking_slow: "Taking it slow",
};

const CHILDREN_LABELS: Record<string, string> = {
  want: "Want children",
  have_want_more: "Have children, want more",
  have_done: "Have children, not planning more",
  no_kids: "Don't want children",
  undecided: "Undecided",
};

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

  if (!isSelf) {
    const blocked = await isBlocked(session.user.id, params.userId);
    if (blocked) notFound();
  }

  const [likedIds, matched] = await Promise.all([
    isSelf ? Promise.resolve(new Set<string>()) : getLikedIds(session.user.id),
    isSelf ? Promise.resolve(false) : isMatched(session.user.id, params.userId),
  ]);

  const photos =
    profile.photos && profile.photos.length > 0
      ? profile.photos
      : profile.photo_url
        ? [profile.photo_url]
        : [];

  return (
    <main className="container detail-page">
      <Link href="/browse" className="back-link">
        ← Back to Discover
      </Link>

      <div className="detail-hero">
        {photos.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photos[0]}
            alt={`${profile.display_name}'s photo`}
            className="detail-photo"
          />
        ) : (
          <div className="detail-photo placeholder">
            {profile.display_name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="detail-head">
          <div className="detail-title-row">
            <h1>
              {profile.display_name}
              {profile.age && <span className="age">, {profile.age}</span>}
            </h1>
            {!isSelf && (
              <ProfileActions
                userId={profile.user_id}
                displayName={profile.display_name}
              />
            )}
          </div>
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

      {photos.length > 1 && (
        <section className="detail-section">
          <h2>Photos</h2>
          <div className="photo-gallery">
            {photos.slice(1).map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={url} src={url} alt="" />
            ))}
          </div>
        </section>
      )}

      {profile.bio && (
        <section className="detail-section">
          <h2>About</h2>
          <p className="detail-bio">{profile.bio}</p>
        </section>
      )}

      {(profile.favorite_verse ||
        profile.statement_of_faith ||
        profile.church_attendance ||
        profile.prayer_life) && (
        <section className="detail-section">
          <h2>Faith</h2>
          <dl className="faith-grid">
            {profile.favorite_verse && (
              <>
                <dt>Favorite verse</dt>
                <dd className="verse-quote">{profile.favorite_verse}</dd>
              </>
            )}
            {profile.statement_of_faith && (
              <>
                <dt>Statement of faith</dt>
                <dd>{profile.statement_of_faith}</dd>
              </>
            )}
            {profile.church_attendance && (
              <>
                <dt>Church attendance</dt>
                <dd>
                  {ATTENDANCE_LABELS[profile.church_attendance] ??
                    profile.church_attendance}
                </dd>
              </>
            )}
            {profile.prayer_life && (
              <>
                <dt>Prayer life</dt>
                <dd>
                  {PRAYER_LABELS[profile.prayer_life] ?? profile.prayer_life}
                </dd>
              </>
            )}
          </dl>
        </section>
      )}

      {(profile.marriage_intention || profile.children_plans) && (
        <section className="detail-section">
          <h2>Looking ahead</h2>
          <dl className="faith-grid">
            {profile.marriage_intention && (
              <>
                <dt>Marriage</dt>
                <dd>
                  {MARRIAGE_LABELS[profile.marriage_intention] ??
                    profile.marriage_intention}
                </dd>
              </>
            )}
            {profile.children_plans && (
              <>
                <dt>Children</dt>
                <dd>
                  {CHILDREN_LABELS[profile.children_plans] ??
                    profile.children_plans}
                </dd>
              </>
            )}
          </dl>
        </section>
      )}
    </main>
  );
}
