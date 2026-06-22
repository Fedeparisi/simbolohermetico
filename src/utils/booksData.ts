export interface PDFBook {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  pdfUrl: string;
  coverUrl?: string;
}

export const PDF_BOOKS_DATABASE: PDFBook[] = [
  {
    id: "kybalion",
    title: "El Kybalión",
    author: "Tres Iniciados",
    description: "Estudio sobre la filosofía hermética del antiguo Egipto y Grecia.",
    category: "Hermetismo",
    pdfUrl: "/books/el_kybalion.pdf"
  },
  {
    id: "dogma_y_ritual",
    title: "Dogma y Ritual de la Alta Magia",
    author: "Eliphas Lévi",
    description: "La obra fundacional del ocultismo moderno que revela los misterios y prácticas de la alta magia.",
    category: "Magia Práctica",
    pdfUrl: "/books/dogma_y_ritual.pdf"
  },
  {
    id: "corpus_hermeticum",
    title: "Corpus Hermeticum",
    author: "Hermes Trismegisto",
    description: "Textos sagrados de la antigua sabiduría hermética, base del esoterismo occidental.",
    category: "Hermetismo",
    pdfUrl: "/books/corpus_hermeticum.pdf"
  },
  {
    id: "biblia_hierbas",
    title: "La Biblia de las hierbas",
    author: "Sarah Garland",
    description: "Una guía completa sobre el cultivo, el uso culinario y las propiedades medicinales e históricas de las plantas.",
    category: "Herbolaria",
    pdfUrl: "/books/la_biblia_de_las_hierbas.pdf"
  },
  {
    id: "clavicula_salomon",
    title: "La Clavícula de Salomón",
    author: "Rey Salomón",
    description: "Uno de los grimorios más famosos de la magia ceremonial y la evocación de espíritus.",
    category: "Grimorios",
    pdfUrl: "/books/clavicula_de_salomon.pdf"
  },
  {
    id: "diario_magia_cordelia",
    title: "365 Hechizos: Diario con Magia de Cordelia",
    author: "Cordelia",
    description: "Un compendio diario de rituales, hechizos y consejos prácticos para sintonizar con la magia.",
    category: "Magia Práctica",
    pdfUrl: "/books/diario_con_magia_cordelia.pdf"
  },
  {
    id: "rituales_velas",
    title: "Rituales Prácticos con Velas",
    author: "Raymond Buckland",
    description: "Una guía detallada para el uso mágico y espiritual de las velas en rituales de transformación.",
    category: "Magia Práctica",
    pdfUrl: "/books/rituales_practicos_con_velas.pdf"
  }
];
