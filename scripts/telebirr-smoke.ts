/**
 * telebirr connectivity smoke test — no database, no public key required.
 *
 *   npx tsx scripts/telebirr-smoke.ts
 *
 * Loads .env, then runs token → preOrder → checkout-URL against the real
 * telebirr API. Proves your Fabric key, app secret, short code, base URL and
 * private-key signature are all accepted. Prints the H5 checkout URL you can
 * open on a phone to complete a real (small) payment.
 */
import "dotenv/config";
import { telebirrEnabled, createCheckoutUrl, usdToEtb } from "../lib/telebirr";

async function main() {
  console.log("telebirrEnabled:", telebirrEnabled);
  if (!telebirrEnabled) {
    console.error("Missing required env (see lib/telebirr.ts telebirrEnabled).");
    process.exit(1);
  }

  console.log("usdToEtb(1) =", usdToEtb(1));

  const url = await createCheckoutUrl({
    merchOrderId: `SMOKE-${Math.floor(Date.now() / 1000)}`,
    amountEtb: usdToEtb(1), // ~1 USD; use the smallest amount you're willing to pay
    title: "telebirr smoke test",
    notifyUrl: "https://example.com/api/payment/telebirr/notify",
    redirectUrl: "https://example.com/done",
  });

  console.log("\n✅ checkout URL:\n" + url);
}

main().catch((err) => {
  console.error("\n❌ telebirr smoke test failed:\n", err);
  process.exit(1);
});
