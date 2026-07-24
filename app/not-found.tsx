import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-[var(--header-h)] text-center">
      <Compass size={56} className="text-brand-green" />
      <h1 className="mt-4 font-heading text-4xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-ink/70">
        Looks like this trail leads nowhere. Let&apos;s get you back to exploring Ethiopia.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-green">Back to Home</Link>
        <Link href="/tours" className="btn-ghost">Browse Tours</Link>
      </div>
    </div>
  );
}
