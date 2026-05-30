import fs from 'fs';
import path from 'path';

function walk(dir, exts) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory() && !['node_modules', '.next', 'dist'].includes(f)) {
      files = files.concat(walk(full, exts));
    } else if (exts.some(e => f.endsWith(e))) {
      files.push(full);
    }
  }
  return files;
}

// Mojibake: UTF-8 bytes interpreted as Windows-1252
// Each pair: [corrupted string, correct unicode char]
const replacements = [
  ['\u00e2\u0080\u0093', '\u2013'],  // en dash –
  ['\u00e2\u0080\u0094', '\u2014'],  // em dash —
  ['\u00e2\u0080\u0099', '\u2019'],  // right single quote '
  ['\u00e2\u0080\u009c', '\u201c'],  // left double quote "
  ['\u00e2\u0080\u009d', '\u201d'],  // right double quote "
  ['\u00e2\u0080\u00a2', '\u2022'],  // bullet •
  ['\u00c3\u00a0', '\u00e0'],        // à
  ['\u00c3\u00a9', '\u00e9'],        // é
  ['\u00c2\u00b7', '\u00b7'],        // middle dot ·
  ['\u00c2\u00a0', '\u00a0'],        // non-breaking space
];

const files = walk('src', ['.tsx', '.ts', '.json'])
  .concat(walk('scripts', ['.ts', '.js', '.mjs', '.json']))
  .concat(walk('supabase', ['.sql', '.ts']));
let changed = 0;
for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content;
  for (const [from, to] of replacements) {
    while (newContent.includes(from)) {
      newContent = newContent.split(from).join(to);
    }
  }
  if (newContent !== content) {
    fs.writeFileSync(f, newContent, 'utf8');
    console.log('FIXED:', path.relative('src', f));
    changed++;
  }
}
console.log('\nTotal files fixed:', changed);
