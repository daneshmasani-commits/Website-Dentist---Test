# G K Ooi & Associates — Dental Clinic Website

A single-page, static website for **G K Ooi & Associates**, a family-run dental practice in Rotherhithe, London (NHS & private treatment), established 1998.

> ⚠️ **This is a pitch template.** Some content is placeholder and clearly flagged with `[TO CONFIRM]` both on the page (highlighted) and in code comments. See the checklist at the bottom.

## Tech

- Plain **HTML + CSS + vanilla JavaScript** — no framework, no build step, no jQuery.
- Mobile-first, responsive (tested at 360 / 768 / 1024 / 1440px).
- Semantic, accessible HTML (landmarks, ARIA, alt text, full keyboard navigation).
- Deployable to any static host (Netlify, Vercel, GitHub Pages).

## File structure

```
/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── logo.png          # client-supplied logo (cropped square, transparent background) — used in header & footer
│   ├── logo.svg          # earlier generated wordmark (kept as fallback, no longer referenced)
│   └── favicon.svg
└── README.md
```

> Stock images are referenced via hosted **Unsplash URLs** in the HTML (no API key, nothing to download). Swap these for the client's real photography when available.

## How to view locally

It's a static site, so any of these work:

**Option 1 — open the file directly**
Double-click `index.html`, or open it in your browser.

**Option 2 — run a tiny local server (recommended; avoids any file:// quirks)**
```bash
# Python 3
python3 -m http.server 8000
# then visit http://localhost:8000
```
or
```bash
# Node
npx serve .
```

## Features implemented (per brief)

- Sticky top nav with smooth-scroll anchors and **active-section highlighting**.
- Mobile hamburger menu.
- Persistent **Book Now** button — floating bottom-right on desktop, sticky bottom bar on mobile.
- Hero, About, Services (expandable items), Reviews (auto-rotating carousel), Team grid, FAQ accordion (one open at a time), Booking form, Find us (map), Footer.
- Reviews carousel: ~6s auto-advance, pause on hover/focus, prev/next, dot indicators, keyboard arrows, respects `prefers-reduced-motion`.
- Booking form: HTML5 + JS validation, silent submit to **Formspree** (placeholder endpoint), inline success/error messages, no external app opens.
- **Cookie consent banner** on first visit; the Google Map iframe only loads **after** consent (UK GDPR).
- GDC compliance placeholder line in the footer.

## ✅ Placeholders to confirm with the client

These are flagged on-page (highlighted) and as `[TO CONFIRM]` comments in `index.html` / `js/main.js`:

- [ ] **Real bios and photos** for every team member.
- [ ] **GDC registration numbers** for each clinician (footer compliance line).
- [ ] Confirmation that **all listed services are offered** (and any to add/remove).
- [ ] **Real pricing** (currently indicative private prices + standard NHS bands).
- [ ] **Booking form submission endpoint** — currently posts to a **placeholder Formspree endpoint** (`https://formspree.io/f/xnjrkaeo`); replace with the client's real Formspree form ID.
- [ ] **Privacy policy** and **cookie policy** content (footer + cookie banner links).
- [ ] **Complaints procedure** wording.
- [ ] Whether they are **currently accepting new patients** (FAQ 6).
- [ ] **Real email address** (currently `contact@GKOOIAssociates.com` placeholder).
- [ ] **Full names** for Dr Roberta, Jackie, John, and Aya.

## Notes for developers

- Colour palette and type scale live as CSS custom properties at the top of `css/styles.css` — change them in one place.
- The map embed URL is stored in `data-map-src` on `#mapEmbed` and injected by JS only after consent.
- To reset the cookie choice while testing: clear `localStorage` key `gkooi_cookie_consent` (DevTools → Application → Local Storage).
