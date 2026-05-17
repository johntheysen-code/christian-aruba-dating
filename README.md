# Christian Aruba Dating

A Christ-centered dating platform for the Aruba community. Next.js landing page with Facebook OAuth login, ready to deploy on Vercel and back with Supabase.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **NextAuth.js** with Facebook provider for OAuth login
- **Supabase** (optional) for persisting user records
- **Vercel** for hosting

## Local setup

```bash
npm install
cp .env.example .env.local
# fill in NEXTAUTH_SECRET, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET
npm run dev
```

Open http://localhost:3000.

### Generating `NEXTAUTH_SECRET`

```bash
openssl rand -base64 32
```

## Facebook app setup

1. Go to https://developers.facebook.com/apps and create an app (type: **Consumer**).
2. Add the **Facebook Login** product.
3. Under *Facebook Login → Settings*, add this OAuth redirect URI:
   - `http://localhost:3000/api/auth/callback/facebook` (dev)
   - `https://YOUR-DOMAIN.com/api/auth/callback/facebook` (prod)
4. Copy the **App ID** → `FACEBOOK_CLIENT_ID` and **App Secret** → `FACEBOOK_CLIENT_SECRET`.
5. While testing, add yourself as a test user under *App Roles*.

## Supabase setup (optional)

1. Create a project at https://supabase.com.
2. Open the SQL editor and run [`supabase/schema.sql`](./supabase/schema.sql).
3. From *Project Settings → API*, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (server-side only — never expose)

If the Supabase env vars are blank the app still runs; sign-ins just aren't persisted.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at https://vercel.com/new.
3. Add the env vars from `.env.example` in the Vercel project settings.
4. Set `NEXTAUTH_URL` to your production URL (e.g. `https://christianarubadating.com`).
5. Add that production callback URL to your Facebook app's OAuth settings.

## Project structure

```
app/
  api/auth/[...nextauth]/route.ts  # NextAuth + Facebook provider
  components/AuthButton.tsx        # Sign in / sign out button
  layout.tsx, page.tsx             # Landing page
  globals.css                      # Styling
lib/supabase.ts                    # Admin client + user upsert
supabase/schema.sql                # Database schema
```

## Roadmap

This is the v0 landing page. Next steps when you're ready:

- Profile creation flow (denomination, church, bio, photos)
- Browse / discover screen
- Likes & matches
- In-app messaging
- Aruba-specific touches: language toggle (English / Papiamento / Dutch)
