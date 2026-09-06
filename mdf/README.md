# Maryland Deathfest XXII companion

Offline-capable web app for MDF XXII (May 27–30 2027, Baltimore). Vanilla HTML, CSS and JS —
no build step, no framework, no runtime CDN. Everything it needs ships in this folder.

Lives at `/mdf/` so it sits alongside the Kinetic Chain Tracker at the site root and the Solo
Touch Trainer in `/touch/` without colliding with either. Its service worker is scoped to
`/mdf/` for the same reason.

## What it does

- All 82 announced bands, each with a **Paige score** (1–10) and the reasoning behind it.
- **Paige's own verdict** from her notes — want to see (with her stars), maybe, or pass —
  and her own words where she wrote any. Where her verdict and my predicted score disagreed
  by two or more, the score moved to match her; the card says so.
- The **Drew & Ryan rec** list, filterable on its own.
- **Paige's own score** per band, so the point of the thing is the side-by-side.
- **Biggest disagreements** sort — where my prediction and her rating diverge most.
- Search, filters (8+, 6+, special sets, moved in v2, not yet rated) and sorts
  (my score, disagreement, band, country, year formed).
- A seen-it toggle and free-text notes per band, for use during the festival.
- Export/import of all your state as a JSON file, to move it between two phones.

Her scores, seen-it ticks and notes live in `localStorage` on each device. They are never
written back into `bands.json` and never leave the phone unless you export them.

## Local preview

```bash
cd mdf
python3 -m http.server 8000
```

Then open `http://localhost:8000/` — or `http://<your-computer's-LAN-IP>:8000/` from a phone on
the same network.

A plain double-click on `index.html` will **not** work: browsers block `fetch()` of a local file
over `file://`, so `bands.json` never loads. The app detects this and says so. Use the server.

## Updating the lineup

1. Edit `bands.json`. Keep the key names exactly as they are — `app.js` reads them directly.
   Every band needs `name`, `country`, `formed`, `genre`, `paige`, `paigePrev`, `delta`,
   `paigeNote`, `why`, `pedigree`, `usFrequency`, `specialSet` and `deepDive`, plus the v3
   fields from Paige's notes: `verdict` (`"want"`, `"maybe"`, `"pass"` or `null`), `stars`
   (0–3, want list only), `rec` (on Drew and Ryan's shortlist), `recBy` (attribution where
   the notes give one), `paigeQuote` (her own words), and `v3Prev`/`v3Note` recording a
   score the notes moved.
   `formed`, `paigeNote`, `specialSet`, `verdict`, `recBy`, `paigeQuote`, `v3Prev` and
   `v3Note` may be `null`.
   Band `name` is the key user state is stored under, so renaming a band orphans its ratings.
2. **Bump `CACHE` in `sw.js`** — `mdf-v1` → `mdf-v2`, and so on.
3. Commit and push.

`bands.json` is fetched network-first, so a data-only change reaches installed phones on the
next launch with signal even without the cache bump. Any change to `index.html`, `app.css`,
`app.js` or the fonts **does** need the bump, or installed phones keep serving the old shell
for weeks.

## Installing on an iPhone

Open the live URL **in Safari** — Chrome on iOS cannot install to the Home Screen. Share →
Add to Home Screen. It launches without the address bar, and works with no signal after the
first load.

## Notes for whoever edits this next

- Paths are all relative (`./bands.json`, not `/bands.json`) because this is served from a
  project subpath, not a domain root. Absolute paths are the usual way this kind of deploy breaks.
- Fonts are self-hosted woff2 in `./fonts` — Archivo (variable, 100–900) and Instrument Serif
  italic, latin subsets. Do not swap these for a Google Fonts link; the app has to work in a
  venue with no signal.
- Icons are generated PNGs with **no alpha channel**. If you regenerate them, keep them fully
  opaque — a transparent `apple-touch-icon` is why iOS sometimes shows a screenshot thumbnail
  on the Home Screen instead of the real icon.
- The service worker at the repo root (`../sw.js`, the tracker's) deletes every cache that is
  not its own when it activates. If you ever bump that one's version, this app's offline cache
  is cleared with it and rebuilds on the next launch with signal.
