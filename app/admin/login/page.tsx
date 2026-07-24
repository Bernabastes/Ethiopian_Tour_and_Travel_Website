"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-green-dark px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-card-hover">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image src="/logo-dark.svg" alt="Habesha Heritage Tours" width={200} height={43} className="h-10 w-auto" />
          <p className="mt-3 flex items-center gap-1.5 text-sm text-ink/60">
            <Lock size={14} /> Admin sign in
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)} className="input" placeholder="admin@…" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button type="submit" disabled={loading} className="btn-green w-full disabled:opacity-60">
            {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in…</> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
