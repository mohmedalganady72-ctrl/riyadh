# Villa renovation contractor, Riyadh (Astro): four native experiences

> Content adapted for a villa renovation / annex / expansion contractor in Riyadh. Contact details live in `CONTACT` at the top of `src/data/site.js`. Sample project cards (`PJ`) and the brand name are placeholders to replace. Set the real domain in `astro.config.mjs` and `public/robots.txt` (search for `YOUR-DOMAIN.com`).

Arabic + Light · Arabic + Dark · English + Light · English + Dark. One identity taken from the logo (brand navy `#042654` + brand gold `#D29A2D`), each language and theme designed natively rather than translated or recoloured.

## Run
```bash
npm install
npm run dev      # http://localhost:4321  (/ redirects to /en/ or /ar/ by browser language)
npm run build    # static site in dist/
```
Set the real origin in `astro.config.mjs` (`site`) and in `public/robots.txt`: canonical, hreflang and sitemap depend on it.

## Structure
```
src/data/site.js        ALL copy, as L('English','العربية') pairs + page data. Edit text here.
src/lib/views.js        build-time HTML for home + 13 pages (language-aware, RTL-aware arrows, number isolation)
src/pages/[lang]/[...slug].astro   /en/, /ar/, /en/about/, /ar/about/ ... (real static routes, SEO-friendly)
src/pages/index.astro   language entry   ·  404.astro (bilingual, noindex)  ·  sitemap.xml.js (with hreflang)  ·  public/robots.txt
scripts/generate-og.mjs  builds the 1200x630 share images into public/og/<lang>/  (npm run og)
src/layouts/Layout.astro   lang/dir, canonical, hreflang, OG, JSON-LD, per-language font, no-flash theme script
src/components/         Header (logo, nav, language link, theme toggle) · Footer
src/data/logo.js        vector logo geometry (AR + EN lockups, R mark) → inline SVG sprite built in Layout.astro
public/brand/           standalone logo files: logo-ar / logo-en (+ -light for dark backgrounds), mark / mark-light, PNG exports, favicon-512
src/scripts/app.js      theme, nav, reveals, count-up, signature scroll, forms
src/scripts/hero.js     hero behaviour (scene texts arrive via data-hero, rendered per language)
src/styles/global.css   tokens → layout → motion → hero → THEMES → i18n (Arabic/RTL)
```

## How the four experiences work
- **Language** = real URLs (`/ar/…`, `/en/…`), `<html lang dir>`, same slugs in both. The header link switches to the same page in the other language.
- **Theme** = `data-theme="light|dark"` on `<html>`. Order: saved choice → system preference; set before first paint (no flash). Tokens: `:root` (light) and `:root[data-theme=dark]`; `--acc` / `--num` carry the per-theme accent.
- **RTL** uses logical properties (`inset-inline-*`, `margin-inline-*`, `border-inline-*`); arrow glyphs, hover motion (`--x`), progress bars, link underlines and the hero overlay mirror in RTL.
- **Arabic typography**: IBM Plex Sans Arabic, no letter-spacing or uppercase, taller line-height, own hero scale. Numbers stay Latin digits (isolated with `<bdi dir=ltr>` where needed).

## Brand logo
One vector logo per language: Arabic `مقاول الرياض` and English `Riyadh Contractor`, each with the R mark (navy bars, gold building and arc) and the thin gold divider. The mark sits at the inline-start edge (right in Arabic, left in English).
- Ink uses `currentColor` and follows `--logo-ink`: navy on light surfaces, white on dark surfaces, over the home hero and in the footer. Gold follows `--logo-gold`.
- Colours: `--brand-navy` / `--brand-gold` in `:root` (global.css). `--navy`, `--gold`, `--or` and `--acc` all point at them. Text-sized gold on white uses `--or-t` (`#8A5F0A`, 5.6:1 on white); on dark it is `#E3B04B`.
- Favicon (`public/favicon.svg`, `apple-touch-icon.png`) is the R mark on a navy tile. JSON-LD `logo` points at `/brand/mark-512.png`.

## Motion hooks (markup → CSS)
`.rv` fade-up block · `.rv-seq` group whose `.sq` children enter top → bottom (`style="--k:N"`) · `.rv-mask` image unveiled top → bottom. See `docs/PROJECT_PLAN.md` → Revision 2.
App-bar colour: `data-hero / data-light / data-dark` on `<meta name="theme-color">` in `src/layouts/Layout.astro`.

## Social links, legal pages, project pages, share images
- **Social links**: `SOCIAL` at the top of `src/data/site.js`. Paste the real profile URL; entries left as `''` are hidden. Filled ones appear in the footer and in JSON-LD `sameAs`.
- **Legal pages**: `/ar|en/privacy/` and `/ar|en/terms/` (footer bottom bar, sitemap). Text is in `PAGES.privacy` / `PAGES.terms`; it describes what the site really does (no cookies or analytics, form opens WhatsApp, theme in localStorage, Google Fonts). Have a legal adviser review it, and change `LEGAL_UPDATED` when the text changes.
- **404**: `src/pages/404.astro` becomes `/404.html` (set it as the host's not-found page). Both languages are in the file; a small script shows the one matching the address. `noindex`.
- **Project pages**: `/ar|en/projects/<slug>/`. A project = one row in `PJ` (slug is the 6th item) + one entry in `PJD` (brief and three "what we did" points). Cards on home and Our work link to them; sitemap and breadcrumb JSON-LD include them. Current text is SAMPLE copy.
- **Share images**: `npm run og` writes `public/og/ar|en/<page>.jpg` (and `projects-<slug>.jpg`) from the page titles and photos. Re-run after changing titles, projects or photos, then commit the files. `Layout.astro` adds `og:image`, `twitter:image` (summary_large_image).

## Still to do
See `docs/PROJECT_PLAN.md` → "Status / remaining".
