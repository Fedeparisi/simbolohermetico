import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MD_PATH = path.join(__dirname, '../temas.md');
const OUT_PATH = path.join(__dirname, '../src/symbolsData.ts');
const PROGRESS_FILE = path.join(__dirname, 'progress.json');

// Get API Key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY no encontrada en .env");
  process.exit(1);
}
const ai = new GoogleGenAI({ apiKey });

// Helper para esperar
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log("Iniciando generación profunda y lenta...");
  
  // 1. Parsear el archivo original de temas
  const mdContent = fs.readFileSync(MD_PATH, 'utf-8');
  const sections = [];
  const lines = mdContent.split('\n');
  let currentSection = null;

  for (let line of lines) {
    const matchHeader = line.match(/^## \d+\.\s+(.*)$/);
    if (matchHeader) {
      if (currentSection) sections.push(currentSection);
      currentSection = { name: matchHeader[1].trim(), desc: '', bullets: [] };
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

  const emojis = ['🌀', '🔥', '💧', '🌿', '🔮', '✨', '👁️', '📜', '🗝️', '🌙', '☀️', '⭐', '🪐', '🌌'];
  const allCategories = [];
  const allSymbols = [];
  let symbolIdCounter = 1;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (!section.name || section.bullets.length === 0) continue;

    const catId = section.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 20) + '_' + i;
    allCategories.push({
      id: catId,
      name: section.name,
      emoji: emojis[i % emojis.length],
      desc: section.desc || section.name
    });

    for (let j = 0; j < section.bullets.length; j++) {
      const bullet = section.bullets[j];
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
           name = bullet.split(' ').slice(0, 4).join(' ').replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '') + '...';
        }
      }

      allSymbols.push({
        id: `symbol_new_${i}_${symbolIdCounter++}`,
        category: catId,
        name: name,
        emoji: emojis[(i + j) % emojis.length],
        association: "Concepto Esotérico",
        _rawContext: content // Guardamos esto para que la IA se base en él
      });
    }
  }

  console.log(`Se encontraron ${allSymbols.length} símbolos a procesar.`);

  // 2. Cargar progreso si existe
  let progressData = {};
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      progressData = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
      console.log(`Progreso cargado. ${Object.keys(progressData).length} símbolos ya procesados.`);
    } catch (e) {
      console.log("No se pudo cargar el progreso previo.");
    }
  }

  // 3. Procesar con Gemini respetando 15 RPM (1 req cada 4 segs -> usamos 5 segs por seguridad)
  for (let i = 0; i < allSymbols.length; i++) {
    const symbol = allSymbols[i];
    if (progressData[symbol.id]) {
      // Ya procesado
      symbol.beginner = progressData[symbol.id].beginner;
      symbol.intermediate = progressData[symbol.id].intermediate;
      symbol.advanced = progressData[symbol.id].advanced;
      continue;
    }

    console.log(`[${i+1}/${allSymbols.length}] Generando para: ${symbol.name}...`);
    
    const prompt = `Eres un sabio hermético.
El usuario quiere aprender sobre el siguiente tema:
Nombre: "${symbol.name}"
Contexto o Resumen original: "${symbol._rawContext}"

Escribe 3 textos independientes y completos en español:
1. "beginner": Una explicación completa pero amigable y básica para un neófito. (Unos 2 párrafos).
2. "intermediate": Una explicación más profunda, conectando con cábala, tarot, alquimia, o psicología analítica de Jung. (Unos 2 párrafos).
3. "advanced": Una exploración teúrgica, esotérica densa o ceremonial. Secretos arcanos. (Unos 2 párrafos).

Formato de respuesta EXACTO:
---BEGINNER---
[texto aquí]
---INTERMEDIATE---
[texto aquí]
---ADVANCED---
[texto aquí]`;

    let success = false;
    let attempts = 0;
    
    while (!success && attempts < 5) {
      try {
        const result = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
        const text = result.text || "";
        
        let beginnerMatch = text.match(/---BEGINNER---\s*([\s\S]*?)\s*---INTERMEDIATE---/i);
        let intermediateMatch = text.match(/---INTERMEDIATE---\s*([\s\S]*?)\s*---ADVANCED---/i);
        let advancedMatch = text.match(/---ADVANCED---\s*([\s\S]*?)$/i);
        
        const beginner = beginnerMatch ? beginnerMatch[1].trim() : symbol._rawContext;
        const intermediate = intermediateMatch ? intermediateMatch[1].trim() : `Análisis esotérico de: ${symbol._rawContext}`;
        const advanced = advancedMatch ? advancedMatch[1].trim() : `Práctica teúrgica de: ${symbol._rawContext}`;
        
        symbol.beginner = beginner;
        symbol.intermediate = intermediate;
        symbol.advanced = advanced;
        
        // Guardar progreso
        progressData[symbol.id] = { beginner, intermediate, advanced };
        fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progressData, null, 2));
        
        success = true;
        // Esperar 6 segundos entre peticiones exitosas para respetar el límite estricto
        await sleep(6000); 

      } catch (error) {
        attempts++;
        console.error(`  Error en intento ${attempts}:`, error.message);
        if (error.message.includes('429') || error.message.includes('Quota')) {
          console.log(`  Sobrecarga de cuota. Esperando 60 segundos...`);
          await sleep(60000);
        } else {
          console.log(`  Esperando 10 segundos antes de reintentar...`);
          await sleep(10000);
        }
      }
    }
    
    if (!success) {
      console.log(`  Saltando ${symbol.name} debido a múltiples errores.`);
      symbol.beginner = symbol._rawContext;
      symbol.intermediate = symbol._rawContext;
      symbol.advanced = symbol._rawContext;
    }
  }

  console.log("¡Generación completa! Escribiendo archivo symbolsData.ts...");

  // 4. Leer el symbolsData.ts original y reemplazar todo con la versión profunda.
  // Wait, no. We read the current file and just replace the CATEGORIES and SYMBOLS_DATABASE sections.
  
  let originalFile = fs.readFileSync(OUT_PATH, 'utf-8');

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
    newSymbolsStr += `    beginner: ${JSON.stringify(s.beginner || s._rawContext)},\n`;
    newSymbolsStr += `    intermediate: ${JSON.stringify(s.intermediate || s._rawContext)},\n`;
    newSymbolsStr += `    advanced: ${JSON.stringify(s.advanced || s._rawContext)}\n`;
    newSymbolsStr += `  },\n`;
  });

  originalFile = originalFile.replace('export const CATEGORIES = [', 'export const CATEGORIES = [\n' + newCatsStr);
  originalFile = originalFile.replace('export const SYMBOLS_DATABASE: EsotericSymbol[] = [', 'export const SYMBOLS_DATABASE: EsotericSymbol[] = [\n' + newSymbolsStr);

  fs.writeFileSync(OUT_PATH, originalFile);
  console.log("¡Hecho! Archivo symbolsData.ts actualizado con contenido profundo.");
}

main().catch(console.error);
