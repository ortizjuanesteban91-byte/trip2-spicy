# Website Build Guide — the Trip2 Spicy / Sonia Realtors method

How we build a full custom website from content packs, start to finish. Written 2026-10-01 from the real Trip2 Spicy build (Next.js, 41 tours, 12 posts) and the earlier Sonia Realtors build. Follow it in order for the next site.

Live examples: https://trip2-spicy.vercel.app · https://sonia-web-preview.vercel.app (branch `content` = newest).

---

## 0. Rules that never change

1. **Never touch a live production site.** Trip2 (trip2puntacana.com) and Sonia (soniarealtors.com, WordPress) stay untouched. We build on a separate preview URL.
2. **Go live only on an explicit "yes / make it live".** Search engines stay blocked until then (`SITE_LIVE` env var).
3. **The content zip is the source of truth** for copy, SEO, schema and prices. A demo or the old live site is only a layout reference. When the user says "ignore the demo", the zip wins.
4. **No secrets in chat.** API keys (Supabase, etc.) are pasted by the owner straight into Vercel. Never ask for or accept them in a message.
5. **Corrections are locked everywhere, immediately.** If the owner fixes one fact (e.g. "speedboat family = 2 adults + 1 child"), change it in the data, the copy, the booking box, the FAQ and the schema in the same pass.
6. **Confirm before building when asked to.** If the owner says "tell me if you get it before doing anything", answer with the plan and wait for the yes. (We broke this once on 2026-10-01 and the owner stopped it.)
7. **Short answers, one step at a time.** The owner works from a phone with voice-to-text (expect typos). Lead with the result and the link.
8. **Save a handoff doc at the end of every session** (repo + Project doc) so the next session starts instantly.

---

## 1. The tools and stack

| Piece | What we use |
|---|---|
| Framework | Next.js 15 App Router, React 19, plain JS with `@/` alias |
| Styling | Tailwind v4, brand colors as CSS vars (`app/globals.css`) |
| Icons | `lucide-react` |
| Motion | AOS (zoom-out-right / zoom-out-left / zoom-in, 2000 ms) |
| Code | GitHub repo, `main` auto-deploys |
| Hosting | Vercel (team `sonia-realtors`), one Vercel project per site |
| Leads | `POST /api/leads` → Supabase REST (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY` in Vercel env) |
| Images (Sonia) | Cloudinary galleries, public IDs = display names |
| Content parsing | `pdftotext` + Python (`scripts/build_content.py`), `json-repair` |
| Archives | `unar` (7z produced empty files on the RAR) |

Sandbox facts: the shell cannot reach most external sites (allowlist: npm, pip, GitHub). To read a live site use the **browser pane** (ask for access with `request_access` per site). `WebFetch` only works on URLs the user gives. Git **tag pushes can fail** through the proxy; normal pushes work, so keep checkpoints as commits on `main`.

---

## 2. Phase A — Intake (before any code)

Ask once, in one message, for everything missing:

- The content packs (zip/RAR): per page copy, SEO settings, dev notes, schema.
- Logo (transparent PNG/SVG), real phone, email, WhatsApp number, address.
- Reference layout (demo URL) and the live site (read-only).
- Photos plan (real photos later; preview photos allowed).
- Hosting: GitHub repo + Vercel project, and which team.
- Does the owner want a rebuild or "same layout, better"?

Then **test write access immediately** (push a trivial commit, confirm Vercel builds). A wrong-team token returns 403 at push time (this is what stopped the first Sonia attempt).

Attachments: if a Gmail attachment or another chat's share link will not download, ask the owner to attach the file directly in this chat.

---

## 3. Phase B — Repo and deploy

1. Create the repo (`trip2-spicy`), scaffold Next.js, connect it to a Vercel project, confirm `main` auto-deploys.
2. Block search engines from day one: robots disallow + `noindex` unless `SITE_LIVE=1`.
3. Sonia only: keep all new work on branch `content` (its own preview URL); `main` stays the old state until "make it live".
4. Env vars for forms (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`) are set by the owner in Vercel. Until then forms do not save. Decide shared vs separate Supabase per site.

---

## 4. Phase C — Content pipeline (zip → JSON)

1. Extract the packs (`unar` for RAR). Keep the raw files in a scratch folder (`/tmp/.../t2`).
2. Each tour folder has: `1 - Page Copy.pdf`, `2 - SEO Settings.pdf`, `3 - Dev Notes.pdf`. Blog folders have blog copy + SEO.
3. `scripts/build_content.py` reads them with `pdftotext` and writes `data/tours.json` and `data/posts.json`:
   - SEO sheet gives slug, title, meta, H1, H2 order, keyword, alts, breadcrumb, canonical, schema prices, JSON-LD.
   - Page copy is split into sections using the **H2 order from the SEO sheet** (types: list, steps, inc, pc, faq, links, text).
   - Category / destination come from the breadcrumb (`Miches` in breadcrumb = Miches destination).
4. Always re-run the script after any parser change and **diff the new JSON against the old one** (a bug fix once also repaired a swallowed "Why" section: check the diff, do not assume).

### Parser lessons (pitfalls we hit)

| Problem | Fix |
|---|---|
| First 2 characters of SEO fields clipped | Label column width 29 (not 31) |
| H2 list parsed as ". You Might Also Like" | Strip leading digits/dot with regex |
| Wrapped H2 split into two items ("…Horseback" / "Combo") | Merge the second part back |
| "From" price took the first number (Single) | Explicit `FROM` map per the booking rule |
| Option labels truncated / missing letters | Label patch + `MULTI` name mapping |
| JSON-LD broken by PDF page breaks | Regex repairs, then `json_repair`; rebuild the FAQ node from the page FAQ when invalid |
| Schema URL typo from the zip | Replace in code, keep everything else verbatim |

### Corrupt PDFs

Some PDFs contain only a browser error ("This site can't be reached"). Check each with `pdftotext` after extraction. If a file is empty of content:

- Ask the owner to re-export it (best).
- Otherwise build from what the pack still has: `scripts/manual/<num>.txt` (page copy written only from the SEO sheet + Dev Notes facts) or `scripts/manual/<num>.json` (SEO, tickets, tables). Mark these **DRAFT** in the handoff doc and replace them when real text arrives.

---

## 5. Phase D — Business rules in data (decide once, lock)

Write the pricing and booking rules down before building the booking box. Trip2 rules:

- **"From" price = Double ÷ 2** (per person). Checkout charges the option actually selected (Solo / Double / Child / etc.).
- **Minimum 2 people** on Montaña Redonda tours, Speedboat and Parasailing (blocks checkout and shows a message).
- **Family options** are capped: Speedboat family = 2 adults + 1 child (up to 3); Buggy/Polaris family up to 4.
- **Day-based pricing** (Coco Bongo): weekday vs Fri–Sat price per ticket, Mondays blocked in the date picker.
- **Miches**: two destinations (Punta Cana / Miches). All Miches tours show only the 6 Miches hotels and the 7 AM / 1 PM times.
- **Categories**: Water Adventures, Adventure & Safari, Family Experiences, Eco & Nature, Culture & City, Shows & Nightlife, Things to Do in Miches. A tour can sit in two (Monkey Land + Zipline is in Adventure and Family).
- No `AggregateRating` / `Review` schema. Use the zip's JSON-LD verbatim.
- Hotel lists were copied from the live Trip2 booking form (read-only, via the browser pane).

---

## 6. Phase E — Layout and components

Layout reference = the demo; content = the zip. Build these pieces:

- **Header/Footer**: real logo (color in header, white in footer, favicon), phone, email, WhatsApp.
- **Home**: hero, category cards (photo, link to the category page), popular tours, Saona and Miches feature sections (photo background), itinerary and blog cards, CTA. "Explore Excursions" → `/tours`.
- **`/tours`**: destination toggle (Punta Cana, Miches, All; Punta Cana listed first and sorted first), category chips (one swipeable row on mobile), search, tour cards.
- **`/tours/<category>`**: one page per category with its own title, intro, canonical and sitemap entry.
- **`/tour/<slug>`**: breadcrumb bar, gallery, fact card, sections, sticky booking box, mobile Book Now bar.
- **Sections renderer** (`components/Sections.jsx`): lists as cards, steps as timeline, Included/Not Included, Pros/Cons, FAQ accordion, tickets cards and compare table (Coco Bongo), "You Might Also Like" as photo cards with price.
- **Booking box**: date (with a visible "Select date" label for iPhone), Solo/Double/Child dropdowns up to 20, time of day, hotel list, fee lines, total, Reserve Now, Enquiry (WhatsApp).
- **Icons**: keyword rules (`components/Icon.jsx`) so each list item gets a matching lucide icon.

### Design rules the owner set

- Not Included and Cons use the **same green circle with an X** (never red).
- "What to expect" = the steps; "Why travelers choose" = the benefit cards; emojis/icons must match the actual text.
- Copy must not carry prices in descriptions (prices live in the booking box and schema).
- Cards are **fully clickable** (photo too). Motion: photo and text both animate on cards; a **tour page animates once per visit, then stays still** (`once` set by path in `AosInit`).
- On phones the **booking box sits right after Highlights**, "You Might Also Like" stays last. On desktop the box is the sticky side column.
- No sideways page shifting on mobile (see gotchas).

### Gotchas that cost us time

- **Stretched links inside AOS elements**: an animated (`transform`) parent becomes the containing block, so `after:inset-0` only covers that parent and the photo is not clickable. Keep the stretched `<Link>` outside any `data-aos` wrapper (animate a child instead).
- **Mobile sideways shift**: `html, body { overflow-x: hidden }` plus a `.page-clip` wrapper in `layout.jsx`, and `min-w-0` on grid children.
- **iPhone date input** renders empty: overlay a "Select date*" label and a calendar icon.
- **Unmatched "You Might Also Like" items** need a fallback (category link or plain card).
- **Browser cache on phones**: after a deploy the owner may see the old page; ask them to reopen or use a private tab. Verify the live HTML yourself through the browser pane before saying "it's updated".

---

## 7. Phase F — Photos

1. First pass: gradients as placeholders.
2. Preview pass (when the owner wants to "see the look"): hotlink photos from the live site, mapped by slug in `data/photos.js` (`photo(slug)` returns a URL or null; gradient stays as fallback). To collect URLs: open the live "all tours" pages in the browser pane, run a small script that logs each card link + image, and read it with `read_console_messages`. Mark them **temporary**.
3. Real pass: owner supplies original photos (or Cloudinary links); replace the map, add one unique alt per image describing what is in it and where. Do not use photos the owner has no permission for (Dev Notes can flag these, e.g. Coco Bongo show photos).

---

## 8. Phase G — SEO and schema

- Slug, canonical, title, meta, H1, H2 order, keyword and alts come from the SEO sheet. Canonical stays the production domain URL (self-canonical).
- JSON-LD from the zip, verbatim; rebuild only the FAQ node when the PDF broke it; add the BreadcrumbList.
- Blog posts: the zip has no schema, so Article schema is generated.
- `sitemap.js` lists home, tours, category pages, blog, tour pages and posts. Search stays blocked until `SITE_LIVE=1`.
- When a tour's URL changes vs the old site, list the 301 redirects (the SEO sheet has "301 redirect from").

---

## 9. Phase H — Forms and leads

- `/api/leads` posts to Supabase; booking, enquiry and contact forms share it. Honeypot field `website`.
- Until the owner saves the two env vars in Vercel, forms show success but do not store anything. Tell the owner that plainly.
- Enquiry button currently opens WhatsApp (decision pending).

---

## 10. Phase I — QA before showing the owner

1. Run `npx next build`; fix errors.
2. Check pages locally (`next start`, curl the routes) for status 200 and key text.
3. After pushing, open the real preview URL in the browser pane and verify the specific change (links, counts, text).
4. Test the booking box: min people, day pricing, closed Monday, hotel list for Miches vs Punta Cana.
5. Ask the owner to look on their phone (they send screenshots); fix from the screenshots.

---

## 11. Phase J — Go live (only on "yes")

1. Real photos in; reviews/placeholder claims removed (demo reviews and the "4.9 / 5" line are placeholders, they must go before launch).
2. Supabase env vars set and a test lead received.
3. Replace DRAFT copy (`scripts/manual/*`) with the real zip text if available.
4. Merge `content` → `main` (Sonia) / set `SITE_LIVE=1`.
5. Add the domain in Vercel, owner changes DNS, add the 301 redirects, submit the sitemap.
6. Verify the live domain: forms submit, WhatsApp number and email are right, schema validates.

---

## 12. Sonia Realtors differences

- Branch `content` holds all new work; `main` stays old until "make it live".
- Content: SEO pack, Buy/Rent/Sell guide pages, owner form (sale/rent, 5% agreement), blog (9 posts at the old WordPress URLs), contact page, WhatsApp floating icon, galleries from Cloudinary.
- Open: DAOS unit prices (need the updated Morada availability file), price conflicts (City Place, Breeze), TikTok URL, Supabase, admin and photo upload for the owner form, extra languages as separate URLs, real domain + Vercel Pro.

---

## 13. Repo map (Trip2 Spicy)

```
app/                 pages (home, tours, tours/[cat], tour/[slug], blog, contact, api/leads, sitemap)
components/          Header, Footer, TourGrid, Sections, BookingBox, Icon, AosInit, LeadForm
data/                tours.json, posts.json (generated), site.js, hotels.js, photos.js
lib/                 content.js (categories, helpers), site.js (phone, schema)
scripts/             build_content.py, manual/ (draft copy for corrupt PDFs)
docs/                this guide
HANDOFF-2026-10-01.md  status, open items
```

---

## 14. Start-a-new-site checklist (copy this)

1. Rules in section 0 agreed; production site off-limits.
2. Intake message sent (section 2); write access tested.
3. Repo + Vercel project + noindex.
4. Extract packs; check every PDF reads; list corrupt ones.
5. Write the business rules (section 5) and get the owner's yes.
6. Run the parser; review the JSON diff and warnings.
7. Build layout from the reference; deploy and send the link.
8. Fix from the owner's phone screenshots; lock every correction everywhere.
9. Photos (preview, then real).
10. Forms + Supabase (owner pastes keys in Vercel).
11. SEO, schema, sitemap, redirects.
12. QA on the live preview, then go-live only on "yes".
13. Handoff doc saved (repo + Project) and this guide updated with anything new.
