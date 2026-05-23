import Link from "next/link";

export const metadata = {
  title: "Not found — Amor y Fe",
};

export default function NotFound() {
  return (
    <main className="container not-found-page">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/owl-404.png" alt="" className="not-found-illustration" />
      <h1>This page wandered off.</h1>
      <p className="muted">
        Even our shoco can&apos;t find what you&apos;re looking for. Let&apos;s
        get you home.
      </p>
      <Link href="/" className="btn btn-coral">
        Take me home
      </Link>
    </main>
  );
}
