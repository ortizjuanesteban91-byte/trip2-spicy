// michestour.com is served by this same app (same tours, bookings, Stripe). Its home page is the Miches landing at /m.
export const MICHES_URL = "https://michestour.com";
export const isMichesHost = (h = "") => /^(www\.)?michestour\.com$/i.test(String(h).split(":")[0]);
// Search engines stay blocked on michestour.com until MICHES_LIVE=1 is set in Vercel.
export const michesLive = process.env.MICHES_LIVE === "1";
