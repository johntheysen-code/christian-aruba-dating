import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfile } from "@/lib/supabase";
import { ProfileForm } from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfileEditPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  const existing = await getProfile(session.user.id);

  return (
    <main className="container profile-page">
      <header className="profile-header">
        <a href="/" className="back-link">
          ← Back
        </a>
        <h1>{existing ? "Edit your profile" : "Create your profile"}</h1>
        <p className="muted">
          Tell other believers a bit about who you are and what you&apos;re
          looking for.
        </p>
      </header>
      <ProfileForm
        initial={existing}
        fallbackName={session.user.name ?? ""}
        fallbackPhoto={session.user.image ?? ""}
      />
    </main>
  );
}
