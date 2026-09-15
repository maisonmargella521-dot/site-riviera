import { readFileSync, existsSync } from 'node:fs';
const files = ['index.html','admin.html','src/style.css','src/main.js','src/admin.js'];
for (const file of files) {
  if (!existsSync(file) || !readFileSync(file, 'utf8').trim()) throw new Error(`Missing file: ${file}`);
}
const html = readFileSync('index.html', 'utf8');
for (const id of ['rooms','gallery','booking','contacts','bookingForm']) {
  if (!html.includes(`id="${id}"`)) throw new Error(`Missing required section: ${id}`);
}
console.log('Static build check passed.');
