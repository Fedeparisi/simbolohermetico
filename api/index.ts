import express from "express";
import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30, // Límite de 30 peticiones por IP cada 15 minutos
  message: { error: "Las fuerzas cósmicas necesitan descansar. Has excedido el límite de consultas (30 cada 15 minutos). Por favor, intenta de nuevo más tarde." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(express.json());

// Lazy initialize DeepSeek client via OpenAI SDK
let dsInstance: OpenAI | null = null;
function getAI() {
  const apiKey = process.env.DEEPSEEK_API_KEY || "";
  if (!apiKey) {
    throw new Error("La clave DEEPSEEK_API_KEY no está configurada en los Secretos/Variables de Entorno o archivo .env.");
  }
  if (!dsInstance) {
    dsInstance = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey,
    });
  }
  return dsInstance;
}

// Robust parsing of JSON returned by the LLM
function parseLLMResponse(text: string) {
  let cleaned = text.trim();
  // Strip markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(json)?\s*/i, "").replace(/\s*```$/, "");
  }
  // Remove bad control characters (\x00-\x1F except \t \n \r) that break JSON.parse
  // but keep them inside string values by only sanitizing outside of string context
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
  // Replace literal newlines inside JSON string values with \n escape
  // Strategy: parse with a reviver that sanitizes string values
  try {
    return JSON.parse(cleaned);
  } catch {
    // Fallback: aggressively escape unescaped control chars inside strings
    const sanitized = cleaned.replace(
      /"((?:[^"\\]|\\.)*)"/g,
      (_match: string, inner: string) =>
        '"' + inner
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t') + '"'
    );
    return JSON.parse(sanitized);
  }
}

// API Route: Custom Esoteric Decoding
app.post("/api/decode", async (req, res) => {
  try {
    const { term, context } = req.body;
    if (!term) {
      return res.status(400).json({ error: "Símbolo o término requerido." });
    }

    const ai = getAI();
    const prompt = `Actúa como un Gran Maestro Hermético experto en Cábala (Árbol de la Vida, Sefirot y Qlifot), Tarot, Alquimia Operativa, Astrología Caldea, Gnosticismo y Magia Ceremonial de órdenes de misterios como la Golden Dawn o los Rosacruces.
    
    Analiza y decodifica el siguiente término o símbolo: "${term}" ${context ? `dentro del contexto o pregunta expresados: "${context}"` : ""}.
    
    Proporciona una respuesta estructurada en formato JSON estricto con las siguientes claves:
    - "etimologia": Explicación corta y esclarecedora del origen o significado literal del término.
    - "hermetismo": Principios herméticos aplicados a este símbolo (por ejemplo, correspondencias con las leyes del Kybalion como mentalismo, correspondencia, vibración, polaridad, etc.).
    - "cabala": Conexión directa con el Árbol de la Vida (Sefirot, senderos, letras hebreas, correspondencias numéricas/gematría o Qlifot si aplica).
    - "alquimia": Correspondencia alquímica (fórmula de transmutación y purificación superior, elementos básicos asociados, azufre/mercurio/sal, etapas como Nigredo/Albedo/Rubedo si calza en el simbolismo).
    - "tarot": Arcanos asociados destacados (simbología, significados ocultos que desvela).
    - "practica_mágica": Una práctica real y detallada de meditación, visualización o ritual seguro y venerable (por ejemplo, desterrar con el pilar medio, sintonización de energía, o contemplación meditativa del sigilo) relacionada al símbolo.
    - "paradoja_esoterica": Una frase sabia o paradoja hermética corta de iluminación interior para reflexionar sobre este concept.

    IMPORTANTE: Responde ÚNICAMENTE con el objeto JSON estructurado con el formato exacto requerido, sin rodeos, sin bloques de código con markdown o texto explicativo fuera del JSON, para que pueda ser parseado directamente de manera robusta en JavaScript.`;

    const response = await ai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const text = response.choices[0]?.message?.content || "{}";
    res.json(parseLLMResponse(text));
  } catch (error: any) {
    console.error("Error en /api/decode:", error);
    res.status(500).json({ error: error.message || "Error al decodificar el término invocando a la fuerza hermética." });
  }
});

// API Route: Esoteric Movie analysis
app.post("/api/analyze-movie", async (req, res) => {
  try {
    const { movie } = req.body;
    if (!movie) {
      return res.status(400).json({ error: "Nombre de película o serie requerido." });
    }

    const ai = getAI();
    const prompt = `Actúa como un erudito e historiador de Cine Hermético, Simbología Comparada y Gnosticismo.
    
    Analiza la siguiente obra cinematográfica: "${movie}".
    
    Analízala desde una perspectiva iniciática y esotérica de forma concisa y rápida. Desglosa alegorías del cautiverio del demiurgo/falsa realidad, el viaje de iniciación espiritual del alma caída hacia la gnosis (despertar), correspondencias con la Gran Obra Alquímica y detalles cabalísticos.
    
    Proporciona un desglose estructurado en JSON estricto con las siguientes claves:
    - "sinopsis_esoterica": Una síntesis del film interpretando la trama desde el viaje de iniciación espiritual o trascendencia gnóstica. (Máximo 3 frases cortas).
    - "arquetipos": Un arreglo o lista de los personajes principales y sus correspondencias arquetípicas iniciáticas (ej: el mentor sabio como El Ermitaño, el protagonista rebelde de la ilusión como El Loco o el Mago, etc.). (Limítate a los 2 personajes principales).
    - "simbolos_ocultos": Una lista de 3 símbolos visuales (colores, números, objetos, espejos, puertas, animales) que aparecen de fondo con un significado hermético directo y qué significa cada uno en una frase muy breve.
    - "fases_transmutacion": Explicación de cómo encajan los actos o etapas de la película con los procesos de la Alquimia Espiritual (Nigredo - fragmentación y crisis; Albedo - el despertar de la sabiduría clara; Rubedo - la integración soberana y transmutación del héroe). (Una frase muy corta por cada fase).
    - "conclusion_gnostica": Un mensaje final resumiendo la enseñanza espiritual iniciática profunda que el film transmite de forma oculta para los que tienen ojos para ver. (Máximo 2 frases).

    Responde ÚNICAMENTE con el objeto JSON estructurado, sin encapsular en bloques markdown, listo para ser consumido directamente.`;

    const response = await ai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const text = response.choices[0]?.message?.content || "{}";
    res.json(parseLLMResponse(text));
  } catch (error: any) {
    console.error("Error en /api/analyze-movie:", error);
    res.status(500).json({ error: error.message || "Error al realizar el análisis cinematográfico hermético." });
  }
});

// API Route: Esoteric Book analysis
app.post("/api/analyze-book", async (req, res) => {
  try {
    const { book } = req.body;
    if (!book) {
      return res.status(400).json({ error: "Nombre del libro o texto sagrado requerido." });
    }

    const ai = getAI();
    const prompt = `Actúa como un erudito e historiador de Literatura Esotérica, Simbología Comparada, Alta Magia y Gnosticismo.
    
    Analiza la siguiente obra literaria o texto sagrado: "${book}".
    
    Analízalo desde una perspectiva iniciática y esotérica de forma concisa y rápida. Desglosa los misterios que revela, su aporte a la Gran Obra Alquímica, sus arquetipos y detalles cabalísticos.
    
    Proporciona un desglose estructurado en JSON estricto con las siguientes claves:
    - "sinopsis_esoterica": Una síntesis del libro interpretando su mensaje central desde el viaje de iniciación espiritual o trascendencia gnóstica. (Máximo 3 frases cortas).
    - "arquetipos": Un arreglo o lista de los conceptos principales o figuras arquetípicas del texto (ej: el mago, la emanación divina, el buscador, el logos). (Limítate a los 2 o 3 arquetipos principales).
    - "simbolos_ocultos": Una lista de 3 símbolos, alegorías o misterios (colores, números, esferas, sellos) que enseña la obra con un significado hermético directo y qué significa cada uno en una frase muy breve.
    - "fases_transmutacion": Explicación de cómo las enseñanzas del libro guían a través de la Alquimia Espiritual (Nigredo - fragmentación y crisis; Albedo - el despertar de la sabiduría; Rubedo - la integración soberana). (Una frase muy corta por cada fase).
    - "conclusion_gnostica": Un mensaje final resumiendo la enseñanza espiritual iniciática profunda que el libro transmite a los adeptos. (Máximo 2 frases).

    Responde ÚNICAMENTE con el objeto JSON estructurado, sin encapsular en bloques markdown, listo para ser consumido directamente.`;

    const response = await ai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const text = response.choices[0]?.message?.content || "{}";
    res.json(parseLLMResponse(text));
  } catch (error: any) {
    console.error("Error en /api/analyze-book:", error);
    res.status(500).json({ error: error.message || "Error al decodificar los misterios literarios." });
  }
});

// API Route: Guided Pathworkings
app.post("/api/generate-pathworking", async (req, res) => {
  try {
    const { title, focusType } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Foco místico (arcano, sefirá, o constelación) requerido." });
    }

    const ai = getAI();
    const prompt = `Diseña un Pathworking (Visualización Astral Guiada y Meditación Activa de la Imaginación) altamente inmersivo basado en: "${title}" (tipo de enfoque místico: "${focusType}").
    
    El tono tiene que ser profundamente solemne, poético y místico. Guía al buscador espiritual a través de un viaje astral enriquecedor y seguro por la dimensión espiritual asociada a este concept.
    
    Proporciona un desglose estructurado en JSON estricto con las siguientes claves:
    - "preparacion": Instrucciones físicas, respiratorias y espaciales recomendadas para sentarse en la vigilia astral (respiración rítmica pranayama, mudras protectores, sintonía aromática con inciensos o aceites, colores de velas rituales). (Sé breve y conciso).
    - "rumbo": El portal de cruce astral (descripción mística del sigilo celestial o umbral arquetípico que brilla ante ti para cruzar). (1-2 oraciones).
    - "viaje_narrativo": Un relato bellísimo de meditación de máximo 2 párrafos dinámicos que narre el viaje espiritual. Debe incluir encuentros con guardianes arcangélicos o espectros de sabiduría, simbología del entorno cósmico, y descripciones astrales detalladas escritas en segunda persona singular: "Miras hacia...", "Sientes la sagrada geometría...".
    - "comunion_ritual": La revelación transmutadora o bendición de luz/sombras puras que ocurre al unificar tu vibración con el regente del sendero. (1-2 oraciones).
    - "retorno": Pasos poéticos para desarmar el cuerpo astral y volver de manera equilibrada y segura a tu vehículo carnal ("siente la pesadez de tus pies, asimila el elixir, contrae tu aura..."). (1-2 oraciones).
    - "mantra_afirmacion": Un antiguo decreto, palabra hebrea de poder o mantra evocativo en sánscrito para sellar y fijar la vibración experimentada en el plano terrenal.

    Responde ÚNICAMENTE con el objeto JSON estructurado, sin preámbulos, delimitadores de código markdown ni discursos introductorios.`;

    const response = await ai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const text = response.choices[0]?.message?.content || "{}";
    res.json(parseLLMResponse(text));
  } catch (error: any) {
    console.error("Error en /api/generate-pathworking:", error);
    res.status(500).json({ error: error.message || "Error al forjar tu sendero astral guiado." });
  }
});

// ── NEW ENDPOINT: Gematria AI Interpretation ──────────────────────────────
app.post("/api/gematria", async (req, res) => {
  try {
    const { word, value, katan } = req.body;
    if (!word) return res.status(400).json({ error: "Palabra requerida." });
    const ai = getAI();
    const prompt = `Actúa como un cabalista experto. Analiza el valor gematría de la palabra "${word}" que tiene un valor de Mispar Gadol: ${value} y raíz digital (Mispar Katan): ${katan}.

Responde ÚNICAMENTE con JSON con estas claves:
- "significado_numerologico": significado del número ${value} en numerología sagrada y kábala (1-2 frases)
- "conexion_cabala": qué Sefirot, senderos o conceptos del Árbol de la Vida se asocian a este número
- "equivalencias_hebreas": palabras hebreas famosas con el mismo valor gematría
- "practica": una contemplación o práctica meditativa breve usando este número
- "paradoja": una paradoja hermética corta sobre el número

Solo JSON, sin markdown.`;
    const r = await ai.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    res.json(parseLLMResponse(r.choices[0]?.message?.content || "{}"));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── NEW ENDPOINT: Sigil Ritual ────────────────────────────────────────────
app.post("/api/sigil-ritual", async (req, res) => {
  try {
    const { intent, letters } = req.body;
    if (!intent) return res.status(400).json({ error: "Intención requerida." });
    const ai = getAI();
    const prompt = `Actúa como maestro de Magia del Caos y Ocultismo. El practicante creó un sigilo para manifestar: "${intent}". Las letras activas del sigilo son: "${letters}".

Diseña un ritual de activación del sigilo. Responde ÚNICAMENTE con JSON:
- "preparacion": cómo preparar el espacio (incienso, colores, hora del día, estado mental) - 2 frases
- "activacion": el método de activación del sigilo (mirar fijamente, meditación, destrucción ritual, etc.) - 2-3 frases
- "sellado": cómo sellar el trabajo y activar el olvido consciente - 1-2 frases  
- "mantra": un mantra o decreto corto en inglés, español o latín para recitar durante la activación

Solo JSON, sin markdown.`;
    const r = await ai.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    res.json(parseLLMResponse(r.choices[0]?.message?.content || "{}"));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── NEW ENDPOINT: Tarot Reading ───────────────────────────────────────────
app.post("/api/tarot-reading", async (req, res) => {
  try {
    const { question, spread, cards } = req.body;
    if (!cards?.length) return res.status(400).json({ error: "Cartas requeridas." });
    const ai = getAI();
    const cardsDesc = cards.map((c: any) => `${c.position}: ${c.name}${c.reversed ? " (invertida)" : ""}`).join(", ");
    const prompt = `Eres un tarotista hermético experto en Cábala y Magia de la Golden Dawn. Interpreta la tirada de Tarot: ${spread}.
${question ? `Pregunta del consultante: "${question}"` : "Sin pregunta específica — lectura de energía general."}
Cartas reveladas: ${cardsDesc}

Responde ÚNICAMENTE con JSON:
- "lectura_general": interpretación profunda y detallada de la tirada (3-4 frases). DEBES MENCIONAR EXPLÍCITAMENTE LOS NOMBRES DE LAS CARTAS REVELADAS (ej. "El hecho de que El Loco salga junto a La Muerte indica..."). Explica claramente la alquimia y la interacción entre estas cartas específicas para formar un mensaje global único de esta tirada.
- "cartas": array con { posicion, carta, interpretacion } para cada carta. La "interpretacion" debe ser profunda (2-3 frases) y explicar detalladamente qué significa esa carta específicamente en esa posición.
- "mensaje_final": consejo final inspirador del oráculo (1-2 frases).

Solo JSON puro, sin markdown ni explicaciones adicionales.`;
    const r = await ai.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    res.json(parseLLMResponse(r.choices[0]?.message?.content || "{}"));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── NEW ENDPOINT: Dream Analysis ──────────────────────────────────────────
app.post("/api/dream-analysis", async (req, res) => {
  try {
    const { dream, emotion, recurring } = req.body;
    if (!dream) return res.status(400).json({ error: "Descripción del sueño requerida." });
    const ai = getAI();
    const prompt = `Actúa como psicoanalista junguiano y hermetista. Analiza el siguiente sueño:
"${dream}"
Emoción predominante al despertar: ${emotion || "no especificada"}
Sueño recurrente: ${recurring ? "Sí" : "No"}

Responde ÚNICAMENTE con JSON:
- "sinopsis_onirica": lectura general del sueño desde la perspectiva del inconsciente (2-3 frases)
- "arquetipos_presentes": arquetipos junguianos identificados (Sombra, Anima/Animus, Sí-mismo, Héroe, etc.) y su rol en el sueño
- "simbolos_hermeticos": 3-4 símbolos herméticos presentes y su significado esotérico
- "mensaje_inconsciente": el mensaje que el inconsciente intenta comunicar (1-2 frases directas)
- "integracion_sombra": si hay elementos de sombra, cómo trabajarlos
- "practica_integradora": una práctica concreta (escritura, meditación, ritual) para integrar el mensaje del sueño
- "oraculo_final": frase oracular hermética de cierre

Solo JSON, sin markdown.`;
    const r = await ai.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    res.json(parseLLMResponse(r.choices[0]?.message?.content || "{}"));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── NEW ENDPOINT: Magical Correspondences + Ritual ────────────────────────
app.post("/api/correspondencias", async (req, res) => {
  try {
    const { objetivo, correspondencias } = req.body;
    if (!objetivo) return res.status(400).json({ error: "Objetivo mágico requerido." });
    const ai = getAI();
    const corrStr = correspondencias && Object.keys(correspondencias).length
      ? `Correspondencias ya conocidas: planeta ${correspondencias.planeta}, sefirá ${correspondencias.sefira}, elemento ${correspondencias.element}.`
      : "";
    const prompt = `Actúa como Maestro de Magia Ceremonial y Hermetismo. El practicante quiere realizar magia para: "${objetivo}". ${corrStr}

Diseña un ritual ceremonial completo y efectivo. Responde ÚNICAMENTE con JSON:
- "propicio": mejor momento astral para realizar este trabajo (día de la semana, fase lunar, hora planetaria)
- "preparacion": lista de materiales y preparación del espacio sagrado (colores, velas, incienso, cristales, hierbas)
- "ritual": el ritual paso a paso, detallado y práctico (4-6 pasos numerados)
- "cierre": cómo cerrar el ritual, agradecer y sellar el trabajo
- "mantra": decreto o mantra de poder para recitar durante el ritual

Solo JSON, sin markdown.`;
    const r = await ai.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    res.json(parseLLMResponse(r.choices[0]?.message?.content || "{}"));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── NEW ENDPOINT: Astrology Interpretation ────────────────────────────────
app.post("/api/astrology", async (req, res) => {
  try {
    const { planets, ascendant, birthDate, city } = req.body;
    if (!planets?.length) return res.status(400).json({ error: "Datos planetarios requeridos." });
    const ai = getAI();
    const planetsDesc = planets.map((p: any) => `${p.name} en ${p.sign} Casa ${p.house}${p.retro ? " (Retrógrado)" : ""}`).join("; ");
    const prompt = `Actúa como astrólogo hermético experto en Cábala y Hermetismo. Interpreta esta carta natal:
Ascendente: ${ascendant}
Planetas: ${planetsDesc}
Fecha de nacimiento: ${birthDate}, ${city}

Responde ÚNICAMENTE con JSON:
- "perfil_alma": descripción profunda del alma encarnada según el ascendente y luminarias (Sol y Luna) - 2-3 frases
- "sol_luna_ascendente": trinidad fundamental Sol/Luna/Ascendente y cómo interactúan
- "planetas_destacados": 2-3 planetas más significativos de la carta y su influencia
- "mision_karmica": propósito kármico del alma basado en la posición de los planetas generacionales (Urano, Neptuno, Plutón)
- "correspondencias_hermeticas": correlaciones con el Árbol de la Vida, Sefirot y senderos del Árbol de la Vida cabalístico
- "decreto": frase de poder oracular para que el nativo afirme su misión

Solo JSON, sin markdown.`;
    const r = await ai.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    res.json(parseLLMResponse(r.choices[0]?.message?.content || "{}"));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Hermetic Server Running — Phase 1 Complete" });
});

// ── NEW ENDPOINT: Archetype Interpretation ───────────────────────────────
app.post("/api/archetype", async (req, res) => {
  try {
    const { archetypes, answers } = req.body;
    if (!archetypes?.length) return res.status(400).json({ error: "Arquetipos requeridos." });
    const ai = getAI();
    const archetypesDesc = archetypes.map((a: any) => `${a.name}: ${a.percent}%`).join("; ");
    const prompt = `Actúa como psicoanalista junguiano y teúrgo de la Golden Dawn. Interpreta el siguiente perfil de arquetipos de personalidad cruzado con el Tarot:
${archetypesDesc}

Respuestas clave dadas por el buscador:
${JSON.stringify(answers)}

Responde ÚNICAMENTE con un objeto JSON estricto con las siguientes claves:
- "descripcion_perfil": Análisis psicológico y esotérico del perfil resultante (3-4 frases).
- "arquetipo_dominante": Análisis del arquetipo principal, su luz y su sombra (2-3 frases).
- "integracion_sombra": Ejercicio o pauta de integración de la Sombra y reconciliación de opuestos según el perfil (2-3 frases).
- "consejo_teurgico": Consejo práctico de teúrgia/magia ceremonial o meditación para equilibrar estas energías en el Árbol de la Vida (2-3 frases).
- "decreto": Una frase oracular solemne de afirmación del Ser.

Solo JSON puro, sin markdown.`;
    const r = await ai.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    res.json(parseLLMResponse(r.choices[0]?.message?.content || "{}"));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── NEW ENDPOINT: Generate Story ───────────────────────────────────────
app.post("/api/generate-story", async (req, res) => {
  try {
    const { movies, books } = req.body;
    if (!movies || !books) return res.status(400).json({ error: "Películas y libros requeridos." });
    const ai = getAI();
    const prompt = `Actúa como un tejedor de destinos herméticos. Crea un cuento esotérico corto y personalizado (máximo 3 párrafos) donde el protagonista viva una historia de iniciación inspirada en los arquetipos de estas películas: "${movies}" y estos libros: "${books}".
    Responde ÚNICAMENTE con un JSON con la clave "story" conteniendo el cuento.`;
    const r = await ai.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    res.json(parseLLMResponse(r.choices[0]?.message?.content || "{}"));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── NEW ENDPOINT: Generate Monomyth Scene ──────────────────────────────
app.post("/api/generate-monomyth", async (req, res) => {
  try {
    const { promptText } = req.body;
    if (!promptText) return res.status(400).json({ error: "Prompt requerido." });
    const ai = getAI();
    const prompt = `Actúa como un Maestro del Juego de Rol Esotérico. ${promptText}
    Responde ÚNICAMENTE con un JSON con la clave "scene" conteniendo la descripción vívida de la escena.`;
    const r = await ai.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    res.json(parseLLMResponse(r.choices[0]?.message?.content || "{}"));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default app;
