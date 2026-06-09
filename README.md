# Sophia Roth — website

A single-page site offering Sophia's three services — **English (TEFL)**, **11+ & SATs
tutoring**, and **babysitting / childcare** — with **real booking** (Cal.com) and **real card
payment** (Stripe) for the £15 trials. Plain static files, hosted **free** on GitHub Pages.

🔗 **Live:** https://freddiesystems.github.io/sophia-website/

```
index.html      all the page content
styles.css      the design (palette pulled from Sophia's photo)
script.js       behaviour + the CONFIG block you edit (top of the file)
assets/         Sophia's photo + favicon
server.js       tiny local preview server (optional; not needed to deploy)
```

---

## Run it locally

```bash
npm run dev      # → http://localhost:4324
```

No build step, no dependencies.

---

## Switching it fully on (two free accounts)

Open **`script.js`** and edit the `CONFIG` block at the very top. Until you do, every button
gracefully falls back to a WhatsApp / email / phone card, so the site already works.

### 1) Booking — Cal.com (free plan, unlimited event types)

1. Sign up at **cal.com** (free). Pick a username, e.g. `sophia-roth`.
2. Connect your Google/Outlook calendar and set your availability.
3. Create **four event types**, using exactly these URL slugs:

   | Event | Slug | Length | Price |
   |-------|------|--------|-------|
   | Free intro call | `intro-call` | 15 min | Free |
   | English (TEFL) trial | `english-trial` | 60 min | £15 *(see payment options)* |
   | 11+ / SATs trial | `sats-trial` | 60 min | £15 *(see payment options)* |
   | Babysitting meet | `babysitting-call` | 15–20 min | Free |

4. Put your username in `script.js`:
   ```js
   cal: { user: "sophia-roth", ... }
   ```
   Now the buttons open your live calendar, and a calendar embeds in the booking section.

### 2) Payment — Stripe (UK cards 1.5% + 20p, no monthly/hidden fees)

You only charge for the two **£15 trials** (intro & babysitting calls are free). Pick one:

**Option A — Stripe Payment Links (recommended, lowest possible fees):**
1. Sign up at **stripe.com** (free) and add your bank for payouts.
2. **Payment links → New** — create two £15 links: *"English (TEFL) trial — 1 hour"* and
   *"11+/SATs trial — 1 hour"*.
3. On each link, set **After payment → Redirect** to the matching Cal.com page
   (e.g. `https://cal.com/sophia-roth/english-trial`) so parents pay, then pick their time.
4. Paste the links into `script.js`:
   ```js
   payments: {
     english: "https://buy.stripe.com/xxxx",
     sats:    "https://buy.stripe.com/yyyy",
   }
   ```

**Option B — collect inside Cal.com (one combined screen):**
Install the **Stripe app** in Cal.com, connect your account, and set the £15 price on the
`english-trial` and `sats-trial` events. Leave `payments` blank. The money still lands in
**your** Stripe (you only pay Stripe's standard fee).

### What it costs
| Piece | Cost |
|-------|------|
| Booking (Cal.com free plan) | **£0** |
| Hosting (GitHub Pages) | **£0** |
| Free intro / babysitting calls | **£0** |
| £15 trial payment (Stripe, UK card) | ~**42p** (1.5% + 20p) |
| £20 lesson, if you take payment online | ~**50p** (1.5% + 20p) |

Stripe has **no** setup fee, monthly fee, or hidden fees.

---

## Hosting & updates

Already live on **GitHub Pages** at the link above. To change anything:

```bash
# edit files, then:
git add -A && git commit -m "update" && git push
```

Pages redeploys automatically in ~1 minute.

**Custom domain** (e.g. `sophiaroth.co.uk`): repo **Settings → Pages → Custom domain**, then
point your domain's DNS at GitHub. Prefer a different host? The same files drag-and-drop onto
[Netlify Drop](https://app.netlify.com/drop), Vercel or Cloudflare Pages.

---

## Notes
- Fully responsive, keyboard accessible, reduced-motion friendly.
- No secrets live in the code — Cal.com usernames and Stripe Payment Links are public URLs.
- "Price rises every 5 students" is shown as an honest note, not a fake live counter.
- To swap the photo, replace `assets/sophia.jpg` (portrait orientation works best).
