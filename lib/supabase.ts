import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  if (!cached) {
    cached = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  }
  return cached;
}

export type UserUpsert = {
  facebook_id: string;
  email: string;
  name: string | null;
  image: string | null;
};

export type UserRow = {
  id: string;
  facebook_id: string;
  email: string;
  name: string | null;
  image: string | null;
};

export async function upsertUser(user: UserUpsert): Promise<UserRow | null> {
  const client = getAdminClient();
  if (!client) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[supabase] skipping upsert — env not configured", user.email);
    }
    return null;
  }
  const { data, error } = await client
    .from("users")
    .upsert(
      {
        facebook_id: user.facebook_id,
        email: user.email,
        name: user.name,
        image: user.image,
        last_login_at: new Date().toISOString(),
      },
      { onConflict: "facebook_id" }
    )
    .select("id, facebook_id, email, name, image")
    .single();
  if (error) {
    console.error("[supabase] upsert failed", error);
    return null;
  }
  return data as UserRow;
}

export type Profile = {
  user_id: string;
  display_name: string;
  age: number | null;
  gender: "male" | "female" | null;
  looking_for: "male" | "female" | "both" | null;
  denomination: string | null;
  church_name: string | null;
  location: string | null;
  bio: string | null;
  photo_url: string | null;
};

export async function getProfile(userId: string): Promise<Profile | null> {
  const client = getAdminClient();
  if (!client) return null;
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("[supabase] getProfile failed", error);
    return null;
  }
  return (data as Profile) ?? null;
}

export async function upsertProfile(profile: Profile): Promise<Profile | null> {
  const client = getAdminClient();
  if (!client) return null;
  const { data, error } = await client
    .from("profiles")
    .upsert(
      { ...profile, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    )
    .select("*")
    .single();
  if (error) {
    console.error("[supabase] upsertProfile failed", error);
    return null;
  }
  return data as Profile;
}

export async function listMatchableProfiles(
  excludeUserId: string,
  viewer: Profile
): Promise<Profile[]> {
  const client = getAdminClient();
  if (!client) return [];

  let query = client
    .from("profiles")
    .select("*")
    .neq("user_id", excludeUserId)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (viewer.looking_for === "male" || viewer.looking_for === "female") {
    query = query.eq("gender", viewer.looking_for);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[supabase] listMatchableProfiles failed", error);
    return [];
  }
  return (data ?? []) as Profile[];
}
