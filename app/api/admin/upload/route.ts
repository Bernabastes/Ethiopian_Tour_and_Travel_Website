import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";

// POST (multipart/form-data, field "file") → uploads an image to Supabase Storage
// and returns its public URL. Admin-only.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  if (!supabaseAdmin) {
    return NextResponse.json(
      { ok: false, error: "Storage not configured (set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)" },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided" }, { status: 422 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ ok: false, error: "Only image files are allowed" }, { status: 422 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "Image must be under 8MB" }, { status: 422 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const folder = (form.get("folder") as string | null)?.replace(/[^a-z0-9-]/gi, "") || "uploads";
  // Unique-ish name without Math.random: timestamp + size + sanitized base.
  const base = file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-]/gi, "-").slice(0, 40);
  const path = `${folder}/${Date.now()}-${file.size}-${base}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (error) {
    console.error("[UPLOAD] failed:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data.publicUrl });
}
