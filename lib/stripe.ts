import Stripe from "stripe";

// Single Stripe client. Null when no secret key is configured, so the app still
// builds/runs and the UI simply hides online-payment buttons.
const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key ? new Stripe(key) : null;

export const stripeEnabled = !!key;
