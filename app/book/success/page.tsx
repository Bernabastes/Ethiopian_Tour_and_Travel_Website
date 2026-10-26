import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Booking Confirmation",
  robots: { index: false },
};

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; paid?: string }>;
}) {
  const { ref, paid } = await searchParams;
  const isPaid = paid === "1";

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 pt-[var(--header-h)]">
      <div className="card max-w-lg p-8 text-center">
        {isPaid ? (
          <>
            <CheckCircle2 size={56} className="mx-auto text-brand-green" />
            <h1 className="mt-4 text-2xl font-bold">Payment successful 🎉</h1>
            <p className="mt-2 text-ink/70">
              Thank you! Your deposit has been received{ref ? <> for booking <strong>#{ref}</strong></> : ""}.
              Your tour is now confirmed and we&apos;ve emailed your receipt.
            </p>
          </>
        ) : (
          <>
            <Clock size={56} className="mx-auto text-brand-gold-dark" />
            <h1 className="mt-4 text-2xl font-bold">Payment not completed</h1>
            <p className="mt-2 text-ink/70">
              No problem{ref ? <> — your booking <strong>#{ref}</strong> is still held</> : ""}. You can
              pay later by bank transfer, or contact us and we&apos;ll help.
            </p>
          </>
        )}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-green">Back to home</Link>
          <Link href="/contact" prefetch={false} className="btn-ghost">Contact us</Link>
        </div>
      </div>
    </div>
  );
}
