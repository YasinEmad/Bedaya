const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (/\.(ts|tsx)$/.test(full)) {
      results.push(full);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '..', 'src'));
// Match the final @version part in module specifiers like:
//   "package@1.2.3" or "@scope/package@1.2.3"
const re = /(["'])([^"']+?)@(\d[\d\.\-a-zA-Z]*?)(["'])/g;
let changed = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const newContent = content.replace(re, '$1$2$4');
  if (newContent !== content) {
    fs.writeFileSync(f, newContent, 'utf8');
    changed++;
  }
});
console.log('Processed', files.length, 'files, changed', changed, 'files.');
