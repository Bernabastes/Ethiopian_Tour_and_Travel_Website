import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client using the service-role key — used for uploading
// images to Storage from admin API routes. Never import this into client code.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const STORAGE_BUCKET = "media";

export const supabaseAdmin =
  url && serviceKey
    ? createClient(url, serviceKey, { auth: { persistSession: false } })
    : null;

export const storageEnabled = !!(url && serviceKey);
