import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Christian Aruba Dating",
};

export default function TermsPage() {
  return (
    <main className="container legal-page">
      <Link href="/" className="back-link">
        ← Home
      </Link>
      <h1>Terms of Service</h1>
      <p className="muted">Last updated: today</p>

      <p>
        By signing into Christian Aruba Dating you agree to these terms. If
        you do not agree, please do not use the service.
      </p>

      <h2>Who can use the service</h2>
      <ul>
        <li>You must be at least 18 years old.</li>
        <li>You must use a real Facebook account that represents you.</li>
        <li>One person, one account.</li>
      </ul>

      <h2>Community guidelines</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Pretend to be someone you are not, or post misleading photos or information.</li>
        <li>Harass, threaten, or harm other members.</li>
        <li>Post sexually explicit, hateful, or illegal content.</li>
        <li>Solicit money, promote products or services, or send spam.</li>
        <li>Use the service for any purpose other than meeting other Christian singles for genuine connection.</li>
      </ul>
      <p>
        We may remove content, suspend, or permanently ban accounts that
        violate these guidelines at our sole discretion.
      </p>

      <h2>Your content</h2>
      <p>
        You retain ownership of the photos, bio, and other content you post.
        By posting, you grant us a non-exclusive, royalty-free license to
        display that content within the service to other members.
      </p>

      <h2>Faith-based service</h2>
      <p>
        Christian Aruba Dating is a Christ-centered service. We restrict
        matching to one-man-one-woman pairings consistent with a biblical
        view of marriage. Members of all backgrounds are welcome to sign up,
        but the matching model is fixed.
      </p>

      <h2>No guarantees</h2>
      <p>
        We do not guarantee that you will meet anyone, that the service will
        be uninterrupted, or that other members are who they claim to be.
        Use common sense, meet in public, and tell a friend before meeting
        someone in person.
      </p>

      <h2>Termination</h2>
      <p>
        You may stop using the service at any time. We may suspend or
        terminate your account if you violate these terms or for any other
        reason at our discretion.
      </p>

      <h2>Liability</h2>
      <p>
        The service is provided &ldquo;as is&rdquo;. To the maximum extent
        permitted by law, we disclaim all warranties and are not liable for
        any damages arising from your use of the service.
      </p>

      <h2>Contact</h2>
      <p>
        Questions: <a href="mailto:johntheysen@gmail.com">johntheysen@gmail.com</a>
      </p>
    </main>
  );
}
