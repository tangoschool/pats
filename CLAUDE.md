# PATS website — notes for Claude

## Editing event teasers: update every copy

The same teaser text often lives in several places, and each one renders independently:

- **Home page** — `website/data/content.json` → `homeTeasers` (rendered by `js/main.js`). Also holds `sliderImages`.
- **Detail pages** (e.g. `big-events.html`, `live-music-*.html`, `milongas-practicas.html`) — each page's own `data-teasers` attribute (rendered by `js/detail-page.js`).

When changing any teaser wording, dates, or prices:

1. Search all of `website/` (HTML **and** `data/content.json`) for a distinctive phrase from the teaser.
2. Update every match.
3. After pushing and the GitHub Pages deploy finishes, confirm the new text on the live site (`https://www.philadelphiatangoschool.com/`), including the home page.
