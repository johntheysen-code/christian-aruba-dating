import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfile, upsertProfile, type Profile } from "@/lib/supabase";

const GENDERS = ["male", "female"] as const;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const profile = await getProfile(session.user.id);
  return NextResponse.json({ profile });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const displayName = String(body.display_name ?? "").trim();
  if (displayName.length < 2 || displayName.length > 60) {
    return NextResponse.json(
      { error: "Display name must be 2-60 characters" },
      { status: 400 }
    );
  }

  const ageNum = Number(body.age);
  if (!Number.isInteger(ageNum) || ageNum < 18 || ageNum > 100) {
    return NextResponse.json(
      { error: "Age must be a whole number between 18 and 100" },
      { status: 400 }
    );
  }

  const gender = String(body.gender ?? "");
  if (!GENDERS.includes(gender as (typeof GENDERS)[number])) {
    return NextResponse.json({ error: "Pick a gender" }, { status: 400 });
  }
  const lookingFor: "male" | "female" = gender === "male" ? "female" : "male";

  const existing = await getProfile(session.user.id);

  const existingPhotoCount = existing?.photos?.length ?? (existing?.photo_url ? 1 : 0);
  if (existingPhotoCount < 2) {
    return NextResponse.json(
      {
        error:
          "Please add at least 2 photos before saving your profile. Members with 2+ photos get significantly more matches.",
      },
      { status: 400 }
    );
  }

  const profile: Profile = {
    user_id: session.user.id,
    display_name: displayName,
    age: ageNum,
    gender: gender as "male" | "female",
    looking_for: lookingFor,
    denomination: optionalStr(body.denomination, 80),
    church_name: optionalStr(body.church_name, 120),
    location: optionalStr(body.location, 80),
    bio: optionalStr(body.bio, 1000),
    photo_url:
      existing?.photo_url ??
      optionalStr(body.photo_url, 500) ??
      session.user.image ??
      null,
    photos: existing?.photos ?? null,
    favorite_verse: optionalStr(body.favorite_verse, 500),
    statement_of_faith: optionalStr(body.statement_of_faith, 800),
    church_attendance: optionalStr(body.church_attendance, 40),
    prayer_life: optionalStr(body.prayer_life, 40),
    marriage_intention: optionalStr(body.marriage_intention, 40),
    children_plans: optionalStr(body.children_plans, 40),
  };

  const saved = await upsertProfile(profile);
  if (!saved) {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
  return NextResponse.json({ profile: saved });
}

function optionalStr(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}
