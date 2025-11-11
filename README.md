# Telepathic Transmission Study Archive (1972)

Static site for a casual social mentalism effect. The first article opened per tab uses a constrained vocabulary suitable for a Mother Of All Book Tests (MOABT) reveal; all further views load clean pages.

## Structure
- `/index.html` homepage with study summary + article grid
- `/moabt/` first-open variants
- `/clean/` auto-generated clean variants
- `/assets/archive.css` minimal styling
- `/scripts/logic.js` session-based routing
- `/scripts/lint-big-words.mjs` validator for `/moabt/*`
- `/scripts/build-clean.mjs` clean builder

## Mother Of All Book Tests (MOABT) allowed long words
Numerous · Occasions · Throughout · Effectively · Constantly · Advantages · Recommended · Different · Suggested

## How to use
- Serve statically (GitHub Pages, Netlify, Vercel).
- Optional: run `node scripts/lint-big-words.mjs` then `node scripts/build-clean.mjs` during edits.

Telepathic Transmission Study Archive (1972) — Software Requirements Specification (SRS)

0. Overview

A static website that simulates a 1970s research archive. The first article opened in a browser tab must present a MOABT-constrained version (uses a fixed set of 9 allowed ≥6-letter words). All subsequent article views in that tab must present clean (normal) versions. No server, no analytics, no network backchannel.
	•	Pages: Home + 12 article pages.
	•	State: Client-side only (via sessionStorage with fallback to URL param and cookie).
	•	Build tools: Optional Node scripts to lint MOABT pages and auto-generate clean variants.

⸻

1. Functional Requirements

1.1 Homepage
	•	Renders archive title, two short paragraphs summarizing the study, and a neutral instruction line:
	•	“Choose any article below and skim the first paragraph. If a big word stands out, keep it in mind.”
	•	Displays a 12-item article grid. Each tile is an anchor with data-slug="aN" for N=1..12.
Do not hardcode href; a script sets it at runtime.

1.2 Article Pages
	•	12 articles total (slugs a1..a12).
	•	Each article consists of:
	•	<h1> title (see §4.1)
	•	2–4 paragraphs (≈180–600 words)
	•	No images required (optional)
	•	MOABT constraint applies to exactly one MOABT page (recommend a1):
	•	Every token of length ≥6 must be exactly one of the 9 allowed words (case-insensitive compare; output in Title Case).
	•	Shorter words (≤5) are unrestricted.
	•	No typographic emphasis (no bold/italic) on the allowed words.
	•	Clean pages must not include any of the 9 allowed words.

1.3 First-Open Rule (Routing & State)
	•	On a fresh tab (state not set):
	•	Article links on the home page must point to /moabt/aN.html.
	•	When a MOABT article loads for the first time, set the session flag.
	•	After session flag is set in that tab:
	•	Home page must point all article links to /clean/aN.html.
	•	Any direct request to /moabt/aN.html must auto-redirect to /clean/aN.html (same slug) via location.replace.
	•	Multiple tabs/windows are independent (state is per-tab).
	•	Refresh: If refreshed on a MOABT page after state set, the redirect must send the user to /clean/aN.html.

1.4 No-JS / Storage Fallbacks
	•	If JavaScript is disabled:
	•	Show a <noscript> block on / telling the visitor to enable JS.
	•	Minimal graceful fallback is acceptable (links won’t function without JS).
	•	If sessionStorage is unavailable:
	•	Use a fallback cookie moabtUsed=1 (path /, max-age 2 hours).
	•	Use a URL param ?v=clean as a last resort for redirect and link writing.

1.5 Build-Time Utilities (Optional but recommended)
	•	Linter (lint-big-words.mjs): Ensures /moabt/a1.html contains no ≥6-letter tokens outside the allowed set.
	•	Builder (build-clean.mjs): Produces /clean/a1.html by mapping the allowed words to synonyms.

⸻

2. Non-Functional Requirements
	•	Hosting: Any static host (GitHub Pages, Netlify, Vercel). No SSR/Node required at runtime.
	•	Performance: Each HTML page < 50KB uncompressed. CSS < 10KB. No external fonts.
	•	Privacy/Security: No analytics, no trackers, no 3rd-party scripts. Provide a CSP suggestion (§7.6).
	•	Accessibility: Semantic headings, adequate contrast, focusable links, language set (lang="en").
	•	Browser Support: Latest Chrome, Safari, Firefox, Edge; and last two major versions.
Validate on iOS Safari and Android Chrome.

Note: You may author a2..a12 under /moabt/ as normal prose that does not contain any of the 9 allowed words so the builder copies them into /clean/ unchanged. Or author them directly in /clean/.

⸻

4. Content Specification

4.1 Article Titles (fixed)
	1.	a1 — Preliminary Reading Response Trials (MOABT)
	2.	a2 — Group Synchronization in Isolated Chambers
	3.	a3 — Dream Transference Under Controlled Conditions
	4.	a4 — Emotional Resonance and Prose Cadence
	5.	a5 — Subject 47: The Anomaly Case
	6.	a6 — The Role of Expectation in Thought Projection
	7.	a7 — Failed Replications, 1974–75
	8.	a8 — Textural Symmetry and Linguistic Noise
	9.	a9 — Archived Correspondence: Dr. Rhine to Dr. Taft
	10.	a10 — Environmental Factors in Reading-Based ESP
	11.	a11 — Statistical Deviations in Card Selection Tests
	12.	a12 — Concluding Notes and Closure of the Program

4.2 MOABT Allowed ≥6-Letter Words (exact strings; Title Case)
	•	Numerous
	•	Occasions
	•	Throughout
	•	Effectively
	•	Constantly
	•	Advantages
	•	Recommended
	•	Different
	•	Suggested

4.3 Clean Builder Substitution Map (for a1 only)
	•	Numerous → many
	•	Occasions → times
	•	Throughout → across
	•	Effectively → well
	•	Constantly → often
	•	Advantages → benefits
	•	Recommended → advised
	•	Different → varied
	•	Suggested → proposed

// scripts/logic.js
function supportsSessionStorage(){ try{ sessionStorage.setItem('_t','1'); sessionStorage.removeItem('_t'); return true; }catch(e){ return false; } }
function setCookie(name,val,secs){ document.cookie = name + "=" + val + "; path=/; max-age=" + (secs||7200); }
function getCookie(name){ return document.cookie.split('; ').find(r=>r.startsWith(name+'='))?.split('=')[1]; }

(function init(){
  const path = location.pathname;
  const isIndex = path === "/" || path.endsWith("/index.html");
  const isMoabt = path.includes("/moabt/");
  const ssOK = supportsSessionStorage();
  const usedSS = ssOK && sessionStorage.getItem("moabtUsed")==="1";
  const usedCookie = !ssOK && getCookie("moabtUsed")==="1";
  const used = usedSS || usedCookie || location.search.includes("v=clean");

  if (isIndex){
    const anchors = document.querySelectorAll('a[data-slug]');
    anchors.forEach(a => {
      const slug = a.getAttribute('data-slug');
      const target = (used ? "/clean/" : "/moabt/") + slug + ".html";
      a.setAttribute("href", target);
    });
    return;
  }

  if (isMoabt){
    // First-time MOABT visit sets state; otherwise redirect to clean
    if (!used){
      if (ssOK){ sessionStorage.setItem("moabtUsed","1"); }
      else { setCookie("moabtUsed","1", 7200); }
      return; // allow viewing MOABT once
    } else {
      const slug = path.split('/').pop(); // aN.html
      const cleanURL = "/clean/" + slug + (ssOK ? "" : "?v=clean");
      location.replace(cleanURL);
      return;
    }
  }
})();

No-JS behavior: Provide a <noscript> block on / with a message.

⸻

6. Build-Time Tools

6.1 Linter (/scripts/lint-big-words.mjs)
	•	Input: All HTML files under /moabt/ that are meant to be MOABT constrained (at minimum a1.html).
	•	Logic:
	•	Extract tokens (/[A-Za-z]+/g).
	•	If token.length >= 6, normalize to Title Case and ensure membership in allowed set (§4.2).
	•	If any fail, exit non-zero and list offending tokens with filenames.

6.2 Clean Builder (/scripts/build-clean.mjs)
	•	Transforms /moabt/a1.html into /clean/a1.html applying the substitution map (§4.3).
	•	For a2..a12:
	•	If you authored under /moabt/ and confirmed none of the 9 words appear, copy as-is to /clean/.
	•	If you authored directly under /clean/, skip copying.

6.3 Node & Commands
	•	Node: v18+ recommended.
	•	Commands:
	•	node scripts/lint-big-words.mjs
	•	node scripts/build-clean.mjs

⸻

7. Implementation Details

7.1 HTML Skeleton Requirements
	•	All pages:
	•	<!doctype html>, <html lang="en">, <meta charset="utf-8">, <meta name="viewport"...>.
	•	<link rel="stylesheet" href="/assets/archive.css">
	•	<script src="/scripts/logic.js"></script> as the last element in <body> on all pages.
	•	Homepage:
	•	12 anchors with data-slug="a1" … "a12" and inner <h2> titles.
	•	Articles:
	•	article.wrap container, <h1>, then paragraphs.

7.2 CSS (minimum)
	•	Serif stack, grid for the home tiles, hover state, readable paragraph size (18–20px), good line height.
(Example CSS in §9.)

7.3 Edge Cases & Handling
	•	Back button after redirect: Use location.replace so history doesn’t keep /moabt/* entries.
	•	Direct deep-link to /moabt/a1.html after state set: Must redirect to /clean/a1.html.
	•	Multi-tab: Each tab’s sessionStorage is isolated; cookie fallback keeps behavior consistent when storage is blocked.
	•	Incognito/private mode: Cookie fallback covers Safari ITP/blocked storage cases.
	•	Base path: If deploying under a subpath (e.g., /archive/), convert all absolute links to relative (e.g., href="assets/archive.css", href="../clean/a1.html") or configure host base path. Decide before implementation.

7.4 Accessibility
	•	Headings in logical order (h1 per page).
	•	Minimum contrast ratio 4.5:1.
	•	Focus styles visible for anchors.
	•	lang="en" on <html>.

7.5 SEO/Robots
	•	Add /robots.txt to allow by default.
	•	If you want the site hidden, add:
User-agent: *
Disallow: /
7.6 Security Headers (host-level, recommended)
	•	CSP (adjust paths if using subpath):

    Content-Security-Policy:
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
base-uri 'self';
form-action 'none';
frame-ancestors 'none';



	•	Referrer-Policy: no-referrer
	•	X-Content-Type-Options: nosniff
	•	X-Frame-Options: DENY

⸻

8. QA / Test Plan

8.1 Manual Tests
	1.	Fresh tab, first click
	•	Open /. Click any tile. URL must be /moabt/aN.html. Page loads.
	•	sessionStorage.moabtUsed set to "1" (or cookie set if storage blocked).
	2.	Return to home
	•	Click back to /. All tiles now point to /clean/aN.html.
	3.	Force MOABT after set
	•	Manually enter /moabt/a1.html. Must redirect to /clean/a1.html.
	4.	Refresh behavior
	•	Refresh on /moabt/a1.html after state set. Must stay on /clean/a1.html.
	5.	Multiple tabs
	•	Open a second tab to /. First click there should again serve /moabt/* (independent state).
	6.	Incognito / storage blocked
	•	Verify cookie fallback works (links flip to clean after first MOABT load).
	7.	No-JS
	•	Temporarily disable JS and verify <noscript> message appears on /.

8.2 Automated Checks
	•	Run node scripts/lint-big-words.mjs → exit code 0.
	•	Spot check that /clean/a1.html contains none of the 9 allowed words.

8.3 Acceptance Criteria (DoD)
	•	AC1–AC7 from the earlier spec all pass (rendering, routing, linter, builder, no trackers).

⸻

9. Reference Implementations (Copy-Ready)

9.1 /assets/archive.css
body { font-family: ui-serif, Georgia, Cambria, "Times New Roman", serif; color:#1b1b1b; background:#fff; }
.wrap { max-width: 820px; margin: 40px auto; padding: 0 16px; }
h1 { font-size: 2rem; margin: 0 0 12px; }
h2 { font-size: 1.05rem; font-weight: 600; }
p { font-size: 1.05rem; line-height: 1.7; margin: 1rem 0; }
.grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap: 16px; }
.grid a { display: block; padding: 14px; border: 1px solid #ddd; text-decoration: none; color: inherit; background: #fafafa; }
.grid a:hover { background: #f2f2f2; }
.note { font-style: italic; color: #444; }

9.2 /scripts/logic.js
<script>
function supportsSessionStorage(){ try{ sessionStorage.setItem('_t','1'); sessionStorage.removeItem('_t'); return true; }catch(e){ return false; } }
function setCookie(name,val,secs){ document.cookie = name + "=" + val + "; path=/; max-age=" + (secs||7200); }
function getCookie(name){ return document.cookie.split('; ').find(r=>r.startsWith(name+'='))?.split('=')[1]; }

(function init(){
  const path = location.pathname;
  const isIndex = path === "/" || path.endsWith("/index.html");
  const isMoabt = path.includes("/moabt/");
  const ssOK = supportsSessionStorage();
  const usedSS = ssOK && sessionStorage.getItem("moabtUsed")==="1";
  const usedCookie = !ssOK && getCookie("moabtUsed")==="1";
  const used = usedSS || usedCookie || location.search.includes("v=clean");

  if (isIndex){
    const anchors = document.querySelectorAll('a[data-slug]');
    anchors.forEach(a => {
      const slug = a.getAttribute('data-slug');
      const target = (used ? "/clean/" : "/moabt/") + slug + ".html";
      a.setAttribute("href", target);
    });
    return;
  }

  if (isMoabt){
    if (!used){
      if (ssOK){ sessionStorage.setItem("moabtUsed","1"); }
      else { setCookie("moabtUsed","1", 7200); }
      return;
    } else {
      const slug = path.split('/').pop();
      const cleanURL = "/clean/" + slug + (ssOK ? "" : "?v=clean");
      location.replace(cleanURL);
      return;
    }
  }
})();
</script>



9.3 /scripts/lint-big-words.mjs
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const ALLOWED = [
  "Numerous","Occasions","Throughout","Effectively",
  "Constantly","Advantages","Recommended","Different","Suggested"
];

const SRC = "./moabt";
let bad = [];

for (const f of readdirSync(SRC)) {
  if (!f.endsWith(".html")) continue;
  const txt = readFileSync(join(SRC, f), "utf8");
  const tokens = txt.match(/[A-Za-z]+/g) || [];
  tokens.forEach(t => {
    const word = t[0].toUpperCase() + t.slice(1).toLowerCase();
    if (word.length >= 6 && !ALLOWED.includes(word)) {
      bad.push(`${f}: ${t}`);
    }
  });
}

if (bad.length) {
  console.error("❌ Non-allowed long words found:\n" + bad.join("\n"));
  process.exit(1);
} else {
  console.log("✅ All long words conform to MOABT rule.");
}



9.4 /scripts/build-clean.mjs
import fs from 'fs/promises';
import path from 'path';

const DIR_MOABT = './moabt';
const DIR_CLEAN = './clean';
await fs.mkdir(DIR_CLEAN, { recursive: true });

const MAP = new Map(Object.entries({
  "Numerous":"many",
  "Occasions":"times",
  "Throughout":"across",
  "Effectively":"well",
  "Constantly":"often",
  "Advantages":"benefits",
  "Recommended":"advised",
  "Different":"varied",
  "Suggested":"proposed"
}));

for (const f of await fs.readdir(DIR_MOABT)) {
  if (!f.endsWith(".html")) continue;
  let html = await fs.readFile(path.join(DIR_MOABT, f), 'utf8');

  // If file contains allowed words, map them; else copy as-is
  for (const [from,to] of MAP) {
    html = html.replace(new RegExp(`\\b${from}\\b`, 'g'), to);
  }
  await fs.writeFile(path.join(DIR_CLEAN, f), html);
}
console.log("✅ Clean variants built.");


9.5 /index.html (skeleton)
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Rhine–Taft Telepathic Reading Study (1972)</title>
  <link rel="stylesheet" href="/assets/archive.css" />
  <meta name="robots" content="noindex,nofollow" />
</head>
<body>
  <header class="wrap">
    <h1>Rhine–Taft Telepathic Reading Study (1972)</h1>
    <p>
      A field archive of summaries, correspondences, and sample materials from an experiment
      conducted between 1972–1975, exploring whether brief exposure to written passages could
      facilitate information transfer between minds. Reports describe sporadic, unpredictable
      outcomes in which participants shared details after reading only the first paragraph of selected texts.
    </p>
    <p>
      Sessions took place in quiet rooms with single readers. The task was to skim a short passage,
      take note of any strong impression, and write a brief line about it.
    </p>
    <p class="note">
      Choose any article below and skim the <strong>first paragraph</strong>.
      If a <em>big</em> word stands out, keep it in mind.
    </p>
    <noscript><p class="note">JavaScript is required to view the archive.</p></noscript>
  </header>

  <main class="wrap grid">
    <a data-slug="a1"><h2>Preliminary Reading Response Trials</h2></a>
    <a data-slug="a2"><h2>Group Synchronization in Isolated Chambers</h2></a>
    <a data-slug="a3"><h2>Dream Transference Under Controlled Conditions</h2></a>
    <a data-slug="a4"><h2>Emotional Resonance and Prose Cadence</h2></a>
    <a data-slug="a5"><h2>Subject 47: The Anomaly Case</h2></a>
    <a data-slug="a6"><h2>The Role of Expectation in Thought Projection</h2></a>
    <a data-slug="a7"><h2>Failed Replications, 1974–75</h2></a>
    <a data-slug="a8"><h2>Textural Symmetry and Linguistic Noise</h2></a>
    <a data-slug="a9"><h2>Archived Correspondence: Dr. Rhine to Dr. Taft</h2></a>
    <a data-slug="a10"><h2>Environmental Factors in Reading-Based ESP</h2></a>
    <a data-slug="a11"><h2>Statistical Deviations in Card Selection Tests</h2></a>
    <a data-slug="a12"><h2>Concluding Notes and Closure of the Program</h2></a>
  </main>

  <script src="/scripts/logic.js"></script>
</body>
</html>
9.3 /scripts/lint-big-words.mjs
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const ALLOWED = [
  "Numerous","Occasions","Throughout","Effectively",
  "Constantly","Advantages","Recommended","Different","Suggested"
];

const SRC = "./moabt";
let bad = [];

for (const f of readdirSync(SRC)) {
  if (!f.endsWith(".html")) continue;
  const txt = readFileSync(join(SRC, f), "utf8");
  const tokens = txt.match(/[A-Za-z]+/g) || [];
  tokens.forEach(t => {
    const word = t[0].toUpperCase() + t.slice(1).toLowerCase();
    if (word.length >= 6 && !ALLOWED.includes(word)) {
      bad.push(`${f}: ${t}`);
    }
  });
}

if (bad.length) {
  console.error("❌ Non-allowed long words found:\n" + bad.join("\n"));
  process.exit(1);
} else {
  console.log("✅ All long words conform to MOABT rule.");
}


10. Article Generation (prompts for code-gen)

10.1 /moabt/a1.html (MOABT)
	•	Constraints:
	•	Title: Preliminary Reading Response Trials
	•	2–4 paragraphs, 200–600 words.
	•	Every token with length ≥6 must be exactly one of the 9 allowed words (§4.2).
	•	Use Title Case for those words; no emphasis.
	•	Standard HTML skeleton + link to /assets/archive.css + script include /scripts/logic.js.

10.2 /moabt/a2.html … /moabt/a12.html (Clean-friendly prose)
	•	Constraints:
	•	Titles per §4.1
	•	2–4 paragraphs, 180–600 words.
	•	Do not use any of the 9 allowed words (in any casing).
	•	Standard HTML skeleton + link to /assets/archive.css + script include /scripts/logic.js.

⸻

11. Developer Tasks Checklist
	1.	Create directory structure (§3).
	2.	Implement CSS (§9.1).
	3.	Implement logic.js per §5 (include on all pages).
	4.	Build index.html per §9.5.
	5.	Author /moabt/a1.html (MOABT constraints); run linter (§6.1) → must pass.
	6.	Author /moabt/a2..a12.html (clean-friendly prose; exclude 9 words).
	7.	Run builder (§6.2) → populate /clean/*.
	8.	Local test plan (§8.1) across Chrome, Safari, Firefox, Edge.
	9.	Deploy to static host. If deploying under a subpath, adjust paths or configure base.
	10.	(Optional) Add security headers (§7.6) at host level.

⸻

12. Go/No-Go Criteria
	•	All acceptance criteria pass (§8.3).
	•	Linter clean, builder outputs correct /clean/a1.html.
	•	First-open rule consistently enforced across supported browsers and in private browsing.
	•	No network requests other than to static assets.
	•	Pages validate visually and accessibly.