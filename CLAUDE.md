# PATS website — notes for Claude

## Editing event teasers: update every copy

The same teaser text often lives in several places, and each one renders independently:

- **Home page** — `website/data/content.json` → `homeTeasers` (rendered by `js/main.js`). Also holds `sliderImages`.
- **Detail pages** (e.g. `big-events.html`, `live-music-*.html`, `milongas-practicas.html`, `workshops.html`) — each page's own `data-teasers` attribute (rendered by `js/detail-page.js`).
- **Home page slider** — an event often also has a slide in `sliderImages` (e.g. `/newsletter-images/<EVENT>_head.png`).

When changing any teaser wording, dates, or prices:

1. Search all of `website/` (HTML **and** `data/content.json`) for a distinctive phrase from the teaser **and** its image filename.
2. Update every match.
3. After pushing and the GitHub Pages deploy finishes, confirm the new text on the live site (`https://www.philadelphiatangoschool.com/`), including the home page.

When removing a past event, remove its teaser from every page above **and** its slide from `sliderImages`.

## Teaser layout rules

- **Every teaser's image column stays the standard width** (CSS `.teaser__image`: max 500px). Never make one teaser's image column narrower or wider than the others — the text must start in the same place on every teaser.
- **Tall images (like the logo):** add `"imageMaxWidth": 260` to that teaser in `content.json` (or in the page's `data-teasers`). This shrinks only the picture, centered inside the standard-width column; the column itself is unchanged.
- **Divider lines:** a light gray line (`#c4c4c4`) separates teasers site-wide, plus a line above the first teaser when there is text before the teaser list. Phones use tighter spacing. All in `css/main.css` + `renderTeasers` in `js/utils.js`.

## Registration links

All registration links point to `https://register.philadelphiatangoschool.com/` (the REGISTER button on every page, plus links in text). The old Cowtinker system (`philadelphiatangoschool.cowtinker.com`) is retired — never link to it.

## Hosting and deploys

- The site is hosted on **GitHub Pages** (workflow: `.github/workflows/static.yml`, publishes `website/`), behind Cloudflare.
- GitHub Pages only serves static files. The old Netlify Stripe function in `website/netlify/functions/` does **not** run, so the payment button on `checkout.html` likely doesn't work.
- If a deploy fails with "No artifacts named github-pages were found", it's a temporary GitHub glitch: re-run it (`gh run rerun <id>`).
