import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MD_PATH = path.join(__dirname, '../temas.md');
const OUT_PATH = path.join(__dirname, '../src/symbolsData.ts');

const mdContent = fs.readFileSync(MD_PATH, 'utf-8');

const sections = [];
const lines = mdContent.split('\n');
let currentSection = null;

for (let line of lines) {
  const matchHeader = line.match(/^## \d+\.\s+(.*)$/);
  if (matchHeader) {
    if (currentSection) sections.push(currentSection);
    currentSection = {
      name: matchHeader[1].trim(),
      desc: '',
      bullets: []
    };
    continue;
  }
  if (!currentSection) continue;

  if (line.startsWith('**Descripción:**')) {
    currentSection.desc = line.replace('**Descripción:**', '').replace(/\[\d+(?:-\d+)?\]/g, '').trim();
  } else if (line.trim().startsWith('*')) {
    let bulletText = line.trim().substring(1).trim();
    bulletText = bulletText.replace(/\[\d+(?:-\d+)?\]/g, '').trim(); 
    if (bulletText) {
      currentSection.bullets.push(bulletText);
    }
  } else if (line.trim().length > 0 && currentSection.bullets.length > 0 && !line.startsWith('#')) {
    currentSection.bullets[currentSection.bullets.length - 1] += ' ' + line.trim().replace(/\[\d+(?:-\d+)?\]/g, '').trim();
  }
}
if (currentSection) sections.push(currentSection);

console.log(`Parsed ${sections.length} sections.`);

const emojis = ['🌀', '🔥', '💧', '🌿', '🔮', '✨', '👁️', '📜', '🗝️', '🌙', '☀️', '⭐', '🪐', '🌌'];

const allCategories = [];
const allSymbols = [];

let symbolIdCounter = 1;

for (let i = 0; i < sections.length; i++) {
  const section = sections[i];
  if (!section.name || section.bullets.length === 0) continue;

  const catId = section.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 20) + '_' + i;
  const catEmoji = emojis[i % emojis.length];

  allCategories.push({
    id: catId,
    name: section.name,
    emoji: catEmoji,
    desc: section.desc || section.name
  });

  for (let j = 0; j < section.bullets.length; j++) {
    const bullet = section.bullets[j];
    
    // Extract title if exists: "**Title:** content"
    let name = `Tema ${j+1}`;
    let content = bullet;
    const titleMatch = bullet.match(/^\*\*(.*?):\*\*(.*)$/);
    if (titleMatch) {
      name = titleMatch[1].trim();
      content = titleMatch[2].trim();
    } else {
      const altMatch = bullet.match(/^\* \*(.*?):\*(.*)$/);
      if (altMatch) {
         name = altMatch[1].trim();
         content = altMatch[2].trim();
      } else {
         // just take first 3 words
         name = bullet.split(' ').slice(0, 4).join(' ').replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '') + '...';
      }
    }

    const itemEmoji = emojis[(i + j) % emojis.length];

    allSymbols.push({
      id: `symbol_new_${i}_${symbolIdCounter++}`,
      category: catId,
      name: name,
      emoji: itemEmoji,
      association: "Concepto Esotérico",
      beginner: content,
      intermediate: "Profundizando en: " + content,
      advanced: "Análisis hermético avanzado: " + content
    });
  }
}

// Merge with existing file content via string manipulation
let originalFile = fs.readFileSync(OUT_PATH, 'utf-8');

// We need to inject the categories inside `export const CATEGORIES = [` array
// and symbols inside `export const esotericSymbols: EsotericSymbol[] = [` array

let newCatsStr = '';
allCategories.forEach(c => {
  newCatsStr += `  { id: "${c.id}", name: ${JSON.stringify(c.name)}, emoji: "${c.emoji}", desc: ${JSON.stringify(c.desc)} },\n`;
});

let newSymbolsStr = '';
allSymbols.forEach(s => {
  newSymbolsStr += `  {\n`;
  newSymbolsStr += `    id: "${s.id}",\n`;
  newSymbolsStr += `    category: "${s.category}",\n`;
  newSymbolsStr += `    name: ${JSON.stringify(s.name)},\n`;
  newSymbolsStr += `    emoji: "${s.emoji}",\n`;
  newSymbolsStr += `    association: "${s.association}",\n`;
  newSymbolsStr += `    beginner: ${JSON.stringify(s.beginner)},\n`;
  newSymbolsStr += `    intermediate: ${JSON.stringify(s.intermediate)},\n`;
  newSymbolsStr += `    advanced: ${JSON.stringify(s.advanced)}\n`;
  newSymbolsStr += `  },\n`;
});

originalFile = originalFile.replace('export const CATEGORIES = [', 'export const CATEGORIES = [\n' + newCatsStr);
originalFile = originalFile.replace('export const SYMBOLS_DATABASE: EsotericSymbol[] = [', 'export const SYMBOLS_DATABASE: EsotericSymbol[] = [\n' + newSymbolsStr);

fs.writeFileSync(OUT_PATH, originalFile);
console.log("Symbols generated successfully and merged!");
