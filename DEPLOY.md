# Telepathic Archive - Deployment Guide

A static website for a casual social mentalism effect using the Mother Of All Book Tests (MOABT) technique.

## Quick Start

### Local Development

1. Clone the repository
2. Serve the directory with any static server:
   ```bash
   # Python 3
   python3 -m http.server 8000

   # Node.js (http-server)
   npx http-server -p 8000

   # PHP
   php -S localhost:8000
   ```
3. Visit `http://localhost:8000`

### Validation & Build

```bash
# Validate MOABT compliance
npm run lint

# Build clean variants from MOABT sources
npm run build

# Run both
npm run validate
```

## Deployment

### GitHub Pages

1. Push to GitHub
2. Settings → Pages → Source: Deploy from branch
3. Select `main` branch, `/` (root)
4. Save

### Netlify

1. Connect GitHub repository
2. Build settings: None (pure static)
3. Publish directory: `/` (root)
4. Deploy

Security headers are automatically applied via `_headers` file.

### Vercel

1. Import GitHub repository
2. Framework Preset: Other
3. Build Command: (leave empty)
4. Output Directory: `./`
5. Deploy

## Project Structure

```
telepathic-archive/
├── index.html           # Homepage with article grid
├── moabt/              # First-view articles (MOABT constrained)
│   ├── a1.html         # Uses only 9 allowed long words
│   └── a2-a12.html     # Standard prose (no MOABT words)
├── articles/           # Auto-generated standard variants
│   └── a1-a12.html     # MOABT words replaced
├── scripts/
│   ├── logic.js        # Session-based routing
│   ├── lint-big-words.mjs  # MOABT validator
│   └── build-clean.mjs     # Clean variant generator
├── assets/
│   └── archive.css     # Minimal styling
├── robots.txt          # Search engine control
└── _headers            # Security headers (Netlify/similar)
```

## How It Works

1. **First visit**: User sees MOABT version (moabt/a1.html) with constrained vocabulary
2. **Session set**: JavaScript sets sessionStorage flag
3. **Subsequent views**: All article links point to standard versions
4. **Redirect protection**: Direct access to MOABT URLs after session set → redirects to articles

### Mother Of All Book Tests (MOABT) - Allowed Words (9 total)

Numerous, Occasions, Throughout, Effectively, Constantly, Advantages, Recommended, Different, Suggested

## Editing Content

### Modifying MOABT Article (a1)

1. Edit `moabt/a1.html`
2. Only use 5-letter words OR the 9 allowed words for 6+ letter words
3. Run `npm run lint` to validate
4. Run `npm run build` to regenerate `articles/a1.html`

### Modifying Other Articles (a2-a12)

1. Edit `moabt/aN.html` (where N = 2-12)
2. Avoid using the 9 MOABT words
3. Run `npm run lint` to validate
4. Run `npm run build` to regenerate article versions

## Browser Compatibility

- Modern browsers (Chrome, Safari, Firefox, Edge)
- Last 2 major versions
- Requires JavaScript enabled
- Fallback: Cookie support if sessionStorage blocked

## Privacy & Security

- No analytics or tracking
- No external dependencies
- No network requests (except static assets)
- CSP headers via `_headers` file
- No data collection

## Testing Checklist

- [ ] Fresh tab → click article → lands on `/moabt/aN.html`
- [ ] Session set → all links point to `/articles/`
- [ ] Direct moabt URL after session → redirects to articles
- [ ] Multiple tabs → independent sessions
- [ ] Incognito mode → cookie fallback works
- [ ] No JS → noscript message shows
- [ ] `npm run lint` → passes
- [ ] `npm run build` → succeeds

## Troubleshooting

**Links not working**: Check JavaScript console for errors. Ensure `logic.js` is loading.

**Session not persisting**: Check browser privacy settings. Cookie fallback should activate if sessionStorage blocked.

**Linter fails**: Check that moabt/a1.html only uses 5-letter words or the 9 allowed words. Other articles must not use MOABT words.

**Redirect loop**: Clear sessionStorage (`sessionStorage.clear()` in console) and cookies.

## License

MIT
