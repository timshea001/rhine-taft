import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const ALLOWED = [
  "Numerous","Occasions","Throughout","Effectively",
  "Constantly","Advantages","Recommended","Different","Suggested"
];

const SRC = "./moabt";
let bad = [];

for (const f of readdirSync(SRC)) {
  // Only check HTML files
  if (!f.endsWith(".html")) continue;

  const html = readFileSync(join(SRC, f), "utf8");

  // Remove title and h1 tags (titles are fixed per spec)
  const withoutTitles = html
    .replace(/<title[^>]*>.*?<\/title>/gi, '')
    .replace(/<h1[^>]*>.*?<\/h1>/gi, '');

  // Extract text content only (strip remaining HTML tags)
  const textOnly = withoutTitles.replace(/<[^>]*>/g, ' ');
  const tokens = textOnly.match(/[A-Za-z]+/g) || [];

  if (f === "a1.html") {
    // a1.html: every word ≥6 letters must be in ALLOWED list (MOABT constraint)
    tokens.forEach(t => {
      const word = t[0].toUpperCase() + t.slice(1).toLowerCase();
      if (word.length >= 6 && !ALLOWED.includes(word)) {
        bad.push(`${f}: ${t} (not in MOABT allowed list)`);
      }
    });
  } else {
    // a2-a12: must NOT contain any of the 9 allowed words
    tokens.forEach(t => {
      const word = t[0].toUpperCase() + t.slice(1).toLowerCase();
      if (ALLOWED.includes(word)) {
        bad.push(`${f}: ${t} (MOABT word should not appear in clean-friendly files)`);
      }
    });
  }
}

if (bad.length) {
  console.error("❌ Validation failed:\n" + bad.join("\n"));
  process.exit(1);
} else {
  console.log("✅ All files pass validation.");
  console.log("  - a1.html: All long words are MOABT-compliant");
  console.log("  - a2-a12: No MOABT words found");
}
