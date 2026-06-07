import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // Initialize official Gemini AI client
  const apiKey = process.env.GEMINI_API_KEY || "";
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route: Custom Esoteric Decoding
  app.post("/api/decode", async (req, res) => {
    try {
      const { term, context } = req.body;
      if (!term) {
        return res.status(400).json({ error: "Símbolo o término requerido." });
      }

      if (!apiKey) {
        return res.status(500).json({ error: "La clave GEMINI_API_KEY no está configurada en los Secretos de la aplicación en AI Studio." });
      }

      const prompt = `Actúa como un Gran Maestro Hermético experto en Cábala (Árbol de la Vida, Sefirot y Qlifot), Tarot, Alquimia Operativa, Astrología Caldea, Gnosticismo y Magia Ceremonial de órdenes de misterios como la Golden Dawn o los Rosacruces.
      
      Analiza y decodifica el siguiente término o símbolo: "${term}" ${context ? `dentro del contexto o pregunta expresados: "${context}"` : ""}.
      
      Proporciona una respuesta estructurada en formato JSON estricto con las siguientes claves:
      - "etimologia": Explicación corta y esclarecedora del origen o significado literal del término.
      - "hermetismo": Principios herméticos aplicados a este símbolo (por ejemplo, correspondencias con las leyes del Kybalion como mentalismo, correspondencia, vibración, polaridad, etc.).
      - "cabala": Conexión directa con el Árbol de la Vida (Sefirot, senderos, letras hebreas, correspondencias numéricas/gematría o Qlifot si aplica).
      - "alquimia": Correspondencia alquímica (fórmula de transmutación y purificación superior, elementos básicos asociados, azufre/mercurio/sal, etapas como Nigredo/Albedo/Rubedo si calza en el simbolismo).
      - "tarot": Arcanos asociados destacados (simbología, significados ocultos que desvela).
      - "practica_mágica": Una práctica real y detallada de meditación, visualización o ritual seguro y venerable (por ejemplo, desterrar con el pilar medio, sintonización de energía, o contemplación meditativa del sigilo) relacionada al símbolo.
      - "paradoja_esoterica": Una frase sabia o paradoja hermética corta de iluminación interior para reflexionar sobre este concepto.

      IMPORTANTE: Responde ÚNICAMENTE con el objeto JSON estructurado con el formato exacto requerido, sin rodeos, sin bloques de código con markdown o texto explicativo fuera del JSON, para que pueda ser parseado directamente de manera robusta en JavaScript.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "{}";
      res.json(JSON.parse(text));
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

      if (!apiKey) {
        return res.status(500).json({ error: "La clave GEMINI_API_KEY no está configurada en los Secretos de la aplicación en AI Studio." });
      }

      const prompt = `Actúa como un erudito e historiador de Cine Hermético, Simbología Comparada y Gnosticismo.
      
      Analiza la siguiente obra cinematográfica: "${movie}".
      
      Analízala desde una perspectiva puramente iniciática y esotérica. Desglosa alegorías del cautiverio del demiurgo/falsa realidad, el viaje de iniciación espiritual del alma caída hacia la gnosis (despertar), correspondencias con la Gran Obra Alquímica y detalles cabalísticos.
      
      Proporciona un desglose detallado estructurado en JSON estricto con las siguientes claves:
      - "sinopsis_esoterica": Una síntesis del film interpretando la trama desde el viaje de iniciación espiritual o trascendencia gnóstica.
      - "arquetipos": Un arreglo o lista de los personajes principales y sus correspondencias arquetípicas iniciáticas (ej: el mentor sabio como El Ermitaño, el protagonista rebelde de la ilusión como El Loco o el Mago, etc.).
      - "simbolos_ocultos": Una lista de 3 a 5 símbolos visuales (colores, números, objetos, espejos, puertas, animales) que aparecen de fondo con un significado hermético directo y qué significa cada uno.
      - "fases_transmutacion": Explicación de cómo encajan los actos o etapas de la película con los procesos de la Alquimia Espiritual (Nigredo - fragmentación y crisis; Albedo - el despertar de la sabiduría clara; Rubedo - la integración soberana y transmutación del héroe).
      - "conclusion_gnostica": Un mensaje final resumiendo la enseñanza espiritual iniciática profunda que el film transmite de forma oculta para los que tienen ojos para ver.

      Responde ÚNICAMENTE con el objeto JSON estructurado, sin encapsular en bloques markdown, listo para ser consumido directamente.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "{}";
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("Error en /api/analyze-movie:", error);
      res.status(500).json({ error: error.message || "Error al realizar el análisis cinematográfico hermético." });
    }
  });

  // API Route: Guided Pathworkings
  app.post("/api/generate-pathworking", async (req, res) => {
    try {
      const { title, focusType } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Foco místico (arcano, sefirá, o constelación) requerido." });
      }

      if (!apiKey) {
        return res.status(500).json({ error: "La clave GEMINI_API_KEY no está configurada en los Secretos de la aplicación en AI Studio." });
      }

      const prompt = `Diseña un Pathworking (Visualización Astral Guiada y Meditación Activa de la Imaginación) altamente inmersivo basado en: "${title}" (tipo de enfoque místico: "${focusType}").
      
      El tono tiene que ser profundamente solemne, poético, místico y cargado de misterio venerable (al estilo de los grimorios clásicos o escritos de Israel Regardie y Dion Fortune). Guía al buscador espiritual a través de un viaje astral enriquecedor y seguro por la dimensión espiritual asociada a este concepto.
      
      Proporciona un desglose estructurado en JSON estricto con las siguientes claves:
      - "preparacion": Instrucciones físicas, respiratorias y espaciales recomendadas para sentarse en la vigilia astral (respiración rítmica pranayama, mudras protectores, sintonía aromática con inciensos o aceites, colores de velas rituales).
      - "rumbo": El portal de cruce astral (descripción mística del sigilo celestial, clave tonal, o umbral arquetípico que brilla ante ti para cruzar).
      - "viaje_narrativo": Un relato largo y bellísimo de meditación de 3-4 párrafos ricos que narre el viaje espiritual. Debe incluir encuentros con guardianes arcangélicos o espectros de sabiduría, simbología del entorno cósmico, y descripciones astrales detalladas escritas en segunda persona singular: "Miras hacia...", "Sientes la sagrada geometría...".
      - "comunion_ritual": La revelación transmutadora o bendición de luz/sombras puras que ocurre al unificar tu vibración con el regente del sendero.
      - "retorno": Pasos poéticos para desarmar el cuerpo astral y volver de manera equilibrada y segura a tu vehículo carnal ("siente la pesadez de tus pies, asimila el elixir, contrae tu aura protectivamente...").
      - "mantra_afirmacion": Un antiguo decreto, palabra hebrea de poder o mantra evocativo en sánscrito para sellar y fijar la vibración experimentada en el plano terrenal.

      Responde ÚNICAMENTE con el objeto JSON estructurado, sin preámbulos, delimitadores de código markdown ni discursos introductorios.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "{}";
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("Error en /api/generate-pathworking:", error);
      res.status(500).json({ error: error.message || "Error al forjar tu sendero astral guiado." });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Hermetic Server Running" });
  });

  // Mount Vite middleware handles serving front-end in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Hermetic Server] Escuchando en el plano terrenal (http://localhost:${PORT})`);
  });
}

startServer().catch((err) => {
  console.error("Error iniciando el templo del servidor hermético:", err);
});
