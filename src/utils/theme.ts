export interface AlchemicalPalette {
  id: string;
  name: string;
  description: string;
  colors: string[]; // [accent/gold, background, text]
  variables: Record<string, string>;
}

export const ALCHEMICAL_PALETTES: AlchemicalPalette[] = [
  {
    id: "gold-cyan",
    name: "Cian y Oro Alquímico (Original)",
    description: "La paleta mística con destellos celestes y bordes translúcidos.",
    colors: ["#06B6D4", "#0b1326", "#dae2fd"],
    variables: {
      "--color-alchemical-gold": "#06B6D4",
      "--gold": "#06B6D4",
      "--gold-dim": "rgba(6, 182, 212, 0.15)",
      "--color-obsidian-base": "#0b1326",
      "--color-background": "#0b1326",
      "--color-surface": "#0b1326",
      "--color-surface-container": "#171f33",
      "--ink": "#0b1326",
      "--color-on-surface": "#dae2fd",
      "--color-on-background": "#dae2fd",
      "--parchment": "#dae2fd",
      "--color-mystical-violet": "#818CF8",
      "--color-charcoal-surface": "rgba(30, 41, 59, 0.5)",
      "--color-surface-glass": "rgba(30, 41, 59, 0.5)",
      "--color-glass-border": "rgba(255, 255, 255, 0.1)",
      "--color-border-glass": "rgba(255, 255, 255, 0.1)",
      "--color-zinc-950": "#080d1a",
      "--color-zinc-900": "#0f1629",
      "--color-zinc-800": "#1d283c"
    }
  },
  {
    id: "combo-05",
    name: "Combo 05: Lime Sprout & Fresh Canopy",
    description: "Follaje fresco y retoños de lima. Un renacer alquímico vegetal.",
    colors: ["#E4FD97", "#2D3E2C", "#f2fde0"],
    variables: {
      "--color-alchemical-gold": "#E4FD97",
      "--gold": "#E4FD97",
      "--gold-dim": "rgba(228, 253, 151, 0.15)",
      "--color-obsidian-base": "#2D3E2C",
      "--color-background": "#2D3E2C",
      "--color-surface": "#2D3E2C",
      "--color-surface-container": "#1d2b1c",
      "--ink": "#2D3E2C",
      "--color-on-surface": "#f2fde0",
      "--color-on-background": "#f2fde0",
      "--parchment": "#f2fde0",
      "--color-mystical-violet": "#81C784",
      "--color-charcoal-surface": "rgba(25, 40, 25, 0.5)",
      "--color-surface-glass": "rgba(25, 40, 25, 0.5)",
      "--color-glass-border": "rgba(228, 253, 151, 0.12)",
      "--color-border-glass": "rgba(228, 253, 151, 0.12)",
      "--color-zinc-950": "#1c291b",
      "--color-zinc-900": "#243323",
      "--color-zinc-800": "#2d3e2c"
    }
  },
  {
    id: "combo-10",
    name: "Combo 10: Skin Tone & Bridal",
    description: "El calor del tono de piel sobre un fondo carmesí nupcial profundo.",
    colors: ["#FFC6A8", "#741A2F", "#fff1ea"],
    variables: {
      "--color-alchemical-gold": "#FFC6A8",
      "--gold": "#FFC6A8",
      "--gold-dim": "rgba(255, 198, 168, 0.15)",
      "--color-obsidian-base": "#741A2F",
      "--color-background": "#741A2F",
      "--color-surface": "#741A2F",
      "--color-surface-container": "#52101e",
      "--ink": "#741A2F",
      "--color-on-surface": "#fff1ea",
      "--color-on-background": "#fff1ea",
      "--parchment": "#fff1ea",
      "--color-mystical-violet": "#F08080",
      "--color-charcoal-surface": "rgba(80, 15, 30, 0.5)",
      "--color-surface-glass": "rgba(80, 15, 30, 0.5)",
      "--color-glass-border": "rgba(255, 198, 168, 0.12)",
      "--color-border-glass": "rgba(255, 198, 168, 0.12)",
      "--color-zinc-950": "#450c18",
      "--color-zinc-900": "#5c1221",
      "--color-zinc-800": "#741a2f"
    }
  },
  {
    id: "combo-06",
    name: "Combo 06: Milky & Mantis",
    description: "Verdes mantis vibrantes destilados en una base láctea y pura.",
    colors: ["#59C749", "#162E1A", "#FFFDF1"],
    variables: {
      "--color-alchemical-gold": "#59C749",
      "--gold": "#59C749",
      "--gold-dim": "rgba(89, 199, 73, 0.15)",
      "--color-obsidian-base": "#162E1A",
      "--color-background": "#162E1A",
      "--color-surface": "#162E1A",
      "--color-surface-container": "#0d1f10",
      "--ink": "#162E1A",
      "--color-on-surface": "#FFFDF1",
      "--color-on-background": "#FFFDF1",
      "--parchment": "#FFFDF1",
      "--color-mystical-violet": "#8AE67A",
      "--color-charcoal-surface": "rgba(15, 35, 18, 0.5)",
      "--color-surface-glass": "rgba(15, 35, 18, 0.5)",
      "--color-glass-border": "rgba(89, 199, 73, 0.12)",
      "--color-border-glass": "rgba(89, 199, 73, 0.12)",
      "--color-zinc-950": "#0a170d",
      "--color-zinc-900": "#112415",
      "--color-zinc-800": "#162e1a"
    }
  },
  {
    id: "combo-09",
    name: "Combo 09: Vulcanico & Noturno",
    description: "Fuego volcánico emergiendo de la noche más profunda de la materia.",
    colors: ["#FF4103", "#001621", "#E0F2FE"],
    variables: {
      "--color-alchemical-gold": "#FF4103",
      "--gold": "#FF4103",
      "--gold-dim": "rgba(255, 65, 3, 0.15)",
      "--color-obsidian-base": "#001621",
      "--color-background": "#001621",
      "--color-surface": "#001621",
      "--color-surface-container": "#002334",
      "--ink": "#001621",
      "--color-on-surface": "#E0F2FE",
      "--color-on-background": "#E0F2FE",
      "--parchment": "#E0F2FE",
      "--color-mystical-violet": "#FF7F50",
      "--color-charcoal-surface": "rgba(0, 30, 45, 0.5)",
      "--color-surface-glass": "rgba(0, 30, 45, 0.5)",
      "--color-glass-border": "rgba(255, 65, 3, 0.12)",
      "--color-border-glass": "rgba(255, 65, 3, 0.12)",
      "--color-zinc-950": "#000b11",
      "--color-zinc-900": "#00111a",
      "--color-zinc-800": "#001b29"
    }
  },
  {
    id: "combo-02",
    name: "Combo 02: True Pink & Chill White",
    description: "Rosa verdadero de alta intensidad espiritual templado con blanco gélido.",
    colors: ["#FD1843", "#240008", "#FFF9FA"],
    variables: {
      "--color-alchemical-gold": "#FD1843",
      "--gold": "#FD1843",
      "--gold-dim": "rgba(253, 24, 67, 0.15)",
      "--color-obsidian-base": "#240008",
      "--color-background": "#240008",
      "--color-surface": "#240008",
      "--color-surface-container": "#3d000f",
      "--ink": "#240008",
      "--color-on-surface": "#FFF9FA",
      "--color-on-background": "#FFF9FA",
      "--parchment": "#FFF9FA",
      "--color-mystical-violet": "#FF69B4",
      "--color-charcoal-surface": "rgba(45, 0, 10, 0.5)",
      "--color-surface-glass": "rgba(45, 0, 10, 0.5)",
      "--color-glass-border": "rgba(253, 24, 67, 0.12)",
      "--color-border-glass": "rgba(253, 24, 67, 0.12)",
      "--color-zinc-950": "#140004",
      "--color-zinc-900": "#1f0007",
      "--color-zinc-800": "#2c000a"
    }
  }
];

export function applyAlchemicalPalette(paletteId: string) {
  const palette = ALCHEMICAL_PALETTES.find(p => p.id === paletteId) || ALCHEMICAL_PALETTES[0];
  const root = document.documentElement;
  
  // Apply all CSS variables defined in the palette mapping
  Object.entries(palette.variables).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });
  
  localStorage.setItem("hermetic-palette", paletteId);
}
