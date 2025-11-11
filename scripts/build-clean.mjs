import fs from 'fs/promises';
import path from 'path';

const DIR_MOABT = './moabt';
const DIR_CLEAN = './articles';
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

let count = 0;
for (const f of await fs.readdir(DIR_MOABT)) {
  // Only process HTML files
  if (!f.endsWith('.html')) continue;

  let html = await fs.readFile(path.join(DIR_MOABT, f), 'utf8');
  for (const [from, to] of MAP) {
    const pattern = new RegExp(`\\b${from}\\b`, 'gi');
    html = html.replace(pattern, match => {
      if (match === match.toUpperCase()) {
        return to.toUpperCase();
      }
      if (match[0] === match[0].toUpperCase()) {
        return to[0].toUpperCase() + to.slice(1);
      }
      return to;
    });
  }
  await fs.writeFile(path.join(DIR_CLEAN, f), html);
  count++;
}
console.log(`✅ Clean variants built: ${count} file${count !== 1 ? 's' : ''} processed.`);
