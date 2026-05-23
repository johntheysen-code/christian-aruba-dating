import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getLikedIds,
  getProfile,
  getQuizAnswers,
  isBlocked,
  isMatched,
} from "@/lib/supabase";
import {
  CATEGORY_LABELS,
  computeCompatibility,
  toAnswerMap,
  type QuizCategory,
} from "@/lib/quiz";
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

  const myQuizCheck = await getQuizAnswers(session.user.id);
  if (myQuizCheck.length === 0 && params.userId !== session.user.id) {
    redirect("/quiz");
  }

  const profile = await getProfile(params.userId);
  if (!profile) notFound();

  const isSelf = profile.user_id === session.user.id;

  if (!isSelf) {
    const blocked = await isBlocked(session.user.id, params.userId);
    if (blocked) notFound();
  }

  const [likedIds, matched, myAnswers, theirAnswers] = await Promise.all([
    isSelf ? Promise.resolve(new Set<string>()) : getLikedIds(session.user.id),
    isSelf ? Promise.resolve(false) : isMatched(session.user.id, params.userId),
    isSelf ? Promise.resolve([]) : getQuizAnswers(session.user.id),
    isSelf ? Promise.resolve([]) : getQuizAnswers(params.userId),
  ]);

  const compatibility =
    !isSelf && myAnswers.length > 0 && theirAnswers.length > 0
      ? computeCompatibility(toAnswerMap(myAnswers), toAnswerMap(theirAnswers))
      : null;

  const allPhotos =
    profile.photos && profile.photos.length > 0
      ? profile.photos
      : profile.photo_url
        ? [profile.photo_url]
        : [];

  const canSeeFullProfile = isSelf || matched;
  const photos = canSeeFullProfile ? allPhotos : allPhotos.slice(0, 2);
  const hasMorePhotosBehindMatch = !canSeeFullProfile && allPhotos.length > 2;
  const bioPreview =
    profile.bio && !canSeeFullProfile
      ? profile.bio.length > 160
        ? profile.bio.slice(0, 160).trimEnd() + "…"
        : profile.bio
      : null;

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
              <span className="tag">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/divi.png" alt="" className="tag-divi" />
                {profile.location}
              </span>
            )}
          </div>
          {profile.church_name && (
            <p className="muted">{profile.church_name}</p>
          )}

          <div className="detail-actions">
            {isSelf ? (
              <Link href="/profile/edit" className="btn btn-coral">
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
                    className="btn btn-coral"
                  >
                    Send message
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {compatibility && compatibility.answeredBoth > 0 && (
        <section className="detail-section compat-section">
          <div className="compat-headline">
            <h2>Compatibility</h2>
            <span className={`compat-score ${compatScoreClass(compatibility.overall)}`}>
              {compatibility.overall}%
            </span>
          </div>
          <p className="muted small">
            Based on {compatibility.answeredBoth} of {compatibility.totalQuestions}{" "}
            questions you both answered.
          </p>
          <div className="compat-bars">
            {(Object.keys(CATEGORY_LABELS) as QuizCategory[]).map((cat) => {
              const pct = compatibility.byCategory[cat];
              if (pct === undefined) return null;
              return (
                <div key={cat} className="compat-bar-row">
                  <span className="compat-bar-label">{CATEGORY_LABELS[cat]}</span>
                  <div className="compat-bar-track">
                    <div
                      className={`compat-bar-fill ${compatScoreClass(pct)}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="compat-bar-pct">{pct}%</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {!isSelf && (myAnswers.length === 0 || theirAnswers.length === 0) && (
        <section className="detail-section compat-prompt">
          <h2>Compatibility quiz</h2>
          <p className="muted">
            {myAnswers.length === 0
              ? "Take the quiz to see how well you align with other members."
              : `${profile.display_name} hasn't taken the compatibility quiz yet.`}
          </p>
          {myAnswers.length === 0 && (
            <Link href="/quiz" className="btn btn-coral">
              Take the quiz
            </Link>
          )}
        </section>
      )}

      {photos.length > 1 && (
        <section className="detail-section">
          <h2>Photos</h2>
          <div className="photo-gallery">
            {photos.slice(1).map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={url} src={url} alt="" />
            ))}
          </div>
          {hasMorePhotosBehindMatch && (
            <p className="muted small reveal-hint">
              🔒 More photos unlock when you both like each other.
            </p>
          )}
        </section>
      )}

      {!canSeeFullProfile && photos.length <= 1 && hasMorePhotosBehindMatch && (
        <section className="detail-section">
          <p className="muted small reveal-hint">
            🔒 More photos unlock when you both like each other.
          </p>
        </section>
      )}

      {canSeeFullProfile && profile.bio && (
        <section className="detail-section">
          <h2>About</h2>
          <p className="detail-bio">{profile.bio}</p>
        </section>
      )}

      {!canSeeFullProfile && bioPreview && (
        <section className="detail-section">
          <h2>About</h2>
          <p className="detail-bio">{bioPreview}</p>
          <p className="muted small reveal-hint">
            🔒 Full bio, additional photos, and faith details unlock when you
            both like each other.
          </p>
        </section>
      )}

      {canSeeFullProfile &&
        (profile.favorite_verse ||
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

      {canSeeFullProfile &&
        (profile.marriage_intention || profile.children_plans) && (
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

function compatScoreClass(score: number): string {
  if (score >= 85) return "great";
  if (score >= 70) return "good";
  if (score >= 50) return "ok";
  return "low";
}
