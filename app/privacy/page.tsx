import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Christian Aruba Dating",
};

export default function PrivacyPage() {
  return (
    <main className="container legal-page">
      <Link href="/" className="back-link">
        ← Home
      </Link>
      <h1>Privacy Policy</h1>
      <p className="muted">Last updated: today</p>

      <p>
        Christian Aruba Dating (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
        &ldquo;our&rdquo;) operates the website at
        christian-aruba-dating.vercel.app. This Privacy Policy explains what
        information we collect, how we use it, and the choices you have.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Facebook profile data</strong> you authorize us to access
          when you sign in: your name, email address, and public profile
          photo.
        </li>
        <li>
          <strong>Profile information you provide</strong>: display name, age,
          gender, location, denomination, church, bio, photos, faith
          information, and matching preferences.
        </li>
        <li>
          <strong>Activity within the app</strong>: profiles you view, like,
          pass on, or block; messages you send and receive; reports you
          submit.
        </li>
        <li>
          <strong>Technical data</strong>: IP address, browser type, and
          timestamps for security and abuse prevention.
        </li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To provide the service: showing your profile to other members and showing other members&apos; profiles to you.</li>
        <li>To match you with other members based on your preferences.</li>
        <li>To deliver messages between matched users.</li>
        <li>To enforce our community guidelines and prevent abuse.</li>
      </ul>

      <h2>What we share</h2>
      <p>
        Your profile (display name, photos, age, denomination, church,
        location, bio, faith details, marriage and children preferences) is
        visible to other signed-in members of the service. We do not sell your
        personal information to third parties.
      </p>
      <p>
        We use Supabase for database and file storage, and Vercel for
        hosting. Both providers process your data on our behalf under their
        own privacy and security policies.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>
          <strong>Edit your profile</strong> at any time from the Profile
          page.
        </li>
        <li>
          <strong>Block users</strong> to stop seeing them and prevent them
          from seeing you.
        </li>
        <li>
          <strong>Report users</strong> who violate community guidelines.
        </li>
        <li>
          <strong>Delete your account</strong> by emailing us — your profile,
          photos, likes, matches, and messages will be permanently deleted.
        </li>
      </ul>

      <h2>Children</h2>
      <p>
        Our service is for adults aged 18 and older. We do not knowingly
        collect data from anyone under 18. If you believe a minor has signed
        up, please report the profile.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or requests: <a href="mailto:johntheysen@gmail.com">johntheysen@gmail.com</a>
      </p>
    </main>
  );
}
