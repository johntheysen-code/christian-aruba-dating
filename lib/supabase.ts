import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

function getAdminClient(): SupabaseClient | null {
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

export async function upsertUser(user: UserUpsert): Promise<void> {
  const client = getAdminClient();
  if (!client) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[supabase] skipping upsert — env not configured", user.email);
    }
    return;
  }
  const { error } = await client
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
    );
  if (error) {
    console.error("[supabase] upsert failed", error);
  }
}
