# nightcode.pl – Landing (deployment ready)

This package is a clean, static landing page for the on‑premise ANPR/ALPR "Intelligent Camera" system.

## Files
- `index.html` (PL)
- `index-en.html` (EN)
- `index-es.html` (ES)
- `index-ru.html` (RU)
- `privacy.html` (PL)
- `style.css`
- `scripts.js`
- `assets/` (logo, video, poster, OG image, favicon)

## Local preview
Open `index.html` directly in a browser, or run a local server:

```bash
python -m http.server 8080
```

Then visit: `http://localhost:8080/index.html`.

## Deployment
Any static hosting works (Vercel, Netlify, GitHub Pages, nginx, etc.).

### Vercel (static)
- Create a new project from the folder.
- Framework preset: **Other**
- Build command: **(none)**
- Output directory: **.**

## Form
The contact form is a demo (no network request). The logic is in `scripts.js`.
To connect it, replace the demo handler with a fetch() to your endpoint or a mail service.

## Update your domain
If you deploy under a different URL, update:
- `<link rel="canonical">`
- `hreflang` URLs
- JSON‑LD `url` fields

