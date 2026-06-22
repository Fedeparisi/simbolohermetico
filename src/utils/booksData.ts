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
    pdfUrl: "/books/La Biblia de las hierbas.pdf"
  }
];
