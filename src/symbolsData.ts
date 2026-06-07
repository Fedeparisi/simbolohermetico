export interface EsotericSymbol {
  id: string;
  category: "fundamentales" | "sefirot" | "tarot" | "elementos" | "chakras" | "zodiaco" | "qlifot" | "adicionales";
  name: string;
  emoji: string;
  association: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  gematria?: string;
}

export const CATEGORIES = [
  { id: "fundamentales", name: "Fundamentales", emoji: "🌀", desc: "Patrones primordiales y geometrías eternas." },
  { id: "sefirot", name: "Sefirot (Árbol de Vida)", emoji: "🌳", desc: "Las 10 emanaciones sagradas del Ein Sof." },
  { id: "tarot", name: "Arcanos Mayores", emoji: "🃏", desc: "Claves arquetípicas de la conciencia evolutiva." },
  { id: "elementos", name: "Elementos Clásicos", emoji: "🔥", desc: "Cimientos elementales de la materia y el espíritu." },
  { id: "chakras", name: "Los 7 Chakras", emoji: "🧘", desc: "Ruedas de energía y anatomía sutil interior." },
  { id: "zodiaco", name: "Mar de Estrellas", emoji: "✨", desc: "Los 12 signos celestes y su influjo cósmico." },
  { id: "qlifot", name: "Qlifot (Árbol Sombra)", emoji: "💀", desc: "Las cáscaras de fuerza y el sendero oscuro." },
  { id: "adicionales", name: "Símbolos Adicionales", emoji: "🗝️", desc: "Sellos, llaves rituales y cosmogramas mágicos." }
];

export const SYMBOLS_DATABASE: EsotericSymbol[] = [
  // --- 1. SÍMBOLOS FUNDAMENTALES (5) ---
  {
    id: "merkaba",
    category: "fundamentales",
    name: "Merkabá",
    emoji: "🌟",
    association: "Cuerpo de Luz / Geometría Sagrada",
    beginner: "Un vehículo tridimensional de luz compuesto por dos tetraedros entrelazados que giran en direcciones opuestas. Representa la integración entre cuerpo, mente y alma.",
    intermediate: "Conexión directa con la visión del carro de Ezequiel en el misticismo judío (Ma'aseh Merkabah). Actúa como un interruptor interdimensional y un modelo de la estructura del campo magnético sutil humano.",
    advanced: "Práctica de reactivación del Merkabá a través de la respiración esférica de 17 fases. Se asocia con la transmutación del biocampo celular para proyectar la conciencia a través del plano astral de manera incorpórea y protegida de entidades hostiles."
  },
  {
    id: "hexagrama",
    category: "fundamentales",
    name: "Hexagrama",
    emoji: "✡️",
    association: "Sello de Salomón / Macrocosmos",
    beginner: "Una estrella de seis puntas formada por dos triángulos entrelazados. Simboliza el equilibrio perfecto de polaridades cósmicas y la unión del cielo con la tierra.",
    intermediate: "En Alquimia es la conjunción del Fuego (triángulo apuntando arriba) y el Agua (triángulo abajo). En la Cábala, sintetiza el equilibrio de Tiphereth gobernando las seis direcciones de la existencia espacial.",
    advanced: "Llave litúrgica en la magia ceremonial de la Golden Dawn. Protagonista en el Ritual Mayor del Hexagrama utilizado para invocar o desterrar fuerzas planetarias del macrocosmos mediante el trazado de trazos lineales sintonizados con los cuadrantes astronómicos."
  },
  {
    id: "flor_vida",
    category: "fundamentales",
    name: "Flor de la Vida",
    emoji: "🏵️",
    association: "Matriz Primordial",
    beginner: "Un patrón geométrico decorativo compuesto por múltiples círculos superpuestos de manera simétrica. Contiene las plantillas de todo lo que existe en el universo.",
    intermediate: "Estructura generatriz que alberga en su centro el Fruto de la Vida, el cual da origen al Cubo de Metatrón. Este último contiene los cinco Sólidos Platónicos, que configuran las leyes físicas de la materia cristalina.",
    advanced: "Meditación tántrica-hermética de proyección geométrica. Se utiliza como un talismán espacial de ordenación vibratoria absoluta para purificar el ambiente ritual, disolviendo interferencias astrales de baja frecuencia y sintonizando la mente con la mente divina."
  },
  {
    id: "yin_yang",
    category: "fundamentales",
    name: "Yin-Yang",
    emoji: "☯️",
    association: "Dualidad Primordial / Taoísmo",
    beginner: "Símbolo de equilibrio que representa dos fuerzas opuestas pero complementarias que fluyen cíclicamente. Todo aspecto posee una semilla de su opuesto en su interior.",
    intermediate: "La expresión del binario universal que precede a los Tres Tesoros (San Bao) y los Cinco Elementos (Wuxing). Se alinea con los principios de Polaridad y Ritmo del Kybalión, donde los opuestos son idénticos en naturaleza pero diferentes en grado.",
    advanced: "Alquimia interna taoísta (Neidan). Transmutación de la esencia (Jing) en energía vital (Qi), y ésta en espíritu (Shen), a través del equilibrio térmico del caldero inferior combinando el fuego del corazón (Yang) con el agua de los riñones (Yin)."
  },
  {
    id: "ouroboros",
    category: "fundamentales",
    name: "Ouroboros",
    emoji: "🐉",
    association: "Eterno Retorno / Opus Alquímico",
    beginner: "Una serpiente o dragón que devora su propia cola formando un círculo continuo. Simboliza la naturaleza cíclica del tiempo, la eternidad y la autosuficiencia espiritual.",
    intermediate: "Expresión máxima de la máxima hermética 'El Todo es Uno' (Hen to Pan). En los tratados de Cleopatra la Alquimista, ilustra la disolución y coagulación perpetua de los metales en el crisol, donde nada se destruye.",
    advanced: "Unificación del plano psíquico con el plano somático mundano. Simboliza el proceso de muerte iniciática y auto-fecundación del alma; el buscador asimila su propia sombra autodevorándose, superando la ilusión temporal planetaria y el Karma."
  },

  // --- 2. LOS 10 SEFIROT (10) ---
  {
    id: "kether",
    category: "sefirot",
    name: "Kether",
    emoji: "👑",
    association: "La Corona / Sefirá 1",
    gematria: "כתר (620)",
    beginner: "La corona en el tope del Árbol de la Vida. Representa la fuente original pura de luz divina, la voluntad inmanifestada y el origen absoluto del cosmos.",
    intermediate: "Vibración de la que deriva todo movimiento. Se sitúa por encima del abismo y de la bifurcación del género. Su correspondencia física en el macrocosmos es el Primer Torbellino (Rashith ha-Gilgalim).",
    advanced: "Estación mística del Ein Sof Aur. En la práctica ritual con el Pilar Medio, se proyecta visualmente como una esfera de luz blanca incandescente de pureza deslumbrante sobre la coronilla del adepto, vibrando el nombre divino sagrado: EHEIEH."
  },
  {
    id: "chokmah",
    category: "sefirot",
    name: "Chokmah",
    emoji: "👁️‍🗨️",
    association: "Sabiduría / Sefirá 2",
    gematria: "חכמה (73)",
    beginner: "La sabiduría divina, el chispazo creativo inicial, la fuerza de acción masculina del universo y la iluminación intelectual que brota de la nada.",
    intermediate: "El Padre Celestial (Abba) y el zodiaco (Mazloth). Representa el dinamismo puro e infinito antes de ser contenido y estructurado por su polo complementario y delimitador binario.",
    advanced: "Canalización del flujo primordial mediante el nombre sagrado YAH. Correspondiente al hemisferio cerebral derecho y la visión espiritual de la creación instantánea, sintonizando al mago con los flujos arquetípicos de iluminación directa."
  },
  {
    id: "binah",
    category: "sefirot",
    name: "Binah",
    emoji: "🖤",
    association: "Entendimiento / Sefirá 3",
    gematria: "בינה (67)",
    beginner: "El entendimiento, la Madre Cósmica (Ama). Representa la fuerza que da forma a la luz, estructurándola bajo leyes de limitación, tiempo y compasión materna.",
    intermediate: "Gobernada por Saturno (Shabbathai). Es el útero cósmico donde se gestan las ideas creativas abstractas que bajan de Chokmah, delimitándolas en el espacio-tiempo cósmico.",
    advanced: "Misterio de la Gran Madre Oscura y el portal de las lágrimas. Vibrado ceremonialmente bajo el nombre divino YHVH ELOHIM. El adepto la activa en el hombro izquierdo para asimilar la estructura y la disciplina protectora universal."
  },
  {
    id: "chesed",
    category: "sefirot",
    name: "Chesed",
    emoji: "💙",
    association: "Misericordia / Sefirá 4",
    gematria: "חסד (72)",
    beginner: "La misericordia divina, el amor incondicional, la benevolencia, la opulencia generosa y la fuerza arquitectónica que expande el universo en belleza infinita.",
    intermediate: "Asociada al planeta Júpiter (Tzedek). Representa el rey constructor que provee abundancia y gobierna con justicia benívola, organizando los reinos invisibles creados.",
    advanced: "Vibración mágica bajo el nombre divino EL. Visualizada como un pilar de luz azul zafiro en el hombro derecho de la anatomía energética, invocada para la edificación psíquica, la curación planetaria y la expansión de la riqueza espiritual."
  },
  {
    id: "geburah",
    category: "sefirot",
    name: "Geburah",
    emoji: "❤️",
    association: "Severidad / Sefirá 5",
    gematria: "גבורה (216)",
    beginner: "La fuerza, la severidad, el juicio divino y el principio de disciplina rigoroso necesario para limitar la expansión descontrolada del cosmos.",
    intermediate: "Bajo la influencia del aguerrido Marte (Madim). Es la espada divisora que juzga, purifica y destruye lo que es inútil para la evolución espiritual del alma carnal.",
    advanced: "Conexión invocatoria con el nombre de poder ELOHIM GIBOR. Visualizada en la anatomía del adepto como una esfera rojo rubí de fuego purificador sobre el hombro izquierdo. Esencial para conjuros de justicia, desvanecimiento de miasmas y firmeza existencial."
  },
  {
    id: "tiphereth",
    category: "sefirot",
    name: "Tiphereth",
    emoji: "☀️",
    association: "Belleza / Sefirá 6",
    gematria: "תפארת (1081)",
    beginner: "Representa el centro del Árbol de la Vida. Simboliza la armonía espiritual, la belleza celestial, la autoconciencia superior, la devoción y el sol interior.",
    intermediate: "El Sol central (Shemesh) y el arquetipo del Cristo / Osiris en el Tarot. Actúa como el puente salvador entre los reinos celestiales arquetípicos y el plano burdo físico.",
    advanced: "Meditación de comunión con el Santo Ángel Guardián. Vibrado bajo la fórmula sagrada teúrgica YHVH ELOAH VA-DAATH. Se localiza en el plexo solar o centro cardíaco como una estrella de luz dorada resplandeciente que unifica todos los sefirot."
  },
  {
    id: "netzach",
    category: "sefirot",
    name: "Netzach",
    emoji: "💚",
    association: "Victoria / Sefirá 7",
    gematria: "נצח (148)",
    beginner: "La victoria, el instinto creativo de la naturaleza vegetal, todas las emociones profundas, el arte sagrado y la sensibilidad poética que impulsa al alma.",
    intermediate: "Gobernada por la hermosa Venus (Nogah). Representa la energía instintiva que mantiene el impulso de cohabitación y reproducción cósmica de las especies vivientes.",
    advanced: "Invocación mágica con el nombre divino YHVH TZABAOTH. Se activa en la cadera o muslo derecho como una esfera verde esmeralda luminosa, estimulando la transmutación de la pasión animal en devoción mística."
  },
  {
    id: "hod",
    category: "sefirot",
    name: "Hod",
    emoji: "🍊",
    association: "Esplendor / Sefirá 8",
    gematria: "הוד (15)",
    beginner: "El esplendor intelectual, la mente racional lógica, la formulación matemática de hechizos y la estructura de comunicación sagrada universal.",
    intermediate: "Influenciada directamente por Mercurio (Kokab). Es el templo donde las aguas de la emoción en Netzach toman nombres cabalísticos inteligibles y conceptos mágicos formales.",
    advanced: "Manejo devocional bajo el nombre místico ELOHIM TZABAOTH. Se localiza en la cadera o muslo izquierdo como una esfera de color naranja o cobre brillante, propiciando el dominio de las ciencias esotéricas y la telepatía sagrada."
  },
  {
    id: "yesod",
    category: "sefirot",
    name: "Yesod",
    emoji: "🌙",
    association: "El Fundamento / Sefirá 9",
    gematria: "יסוד (80)",
    beginner: "El fundamento cósmico, el plano astral medio, el subconsciente humano, las mareas psíquicas sutiles, los sueños clarividentes y el magnetismo vital.",
    intermediate: "Gobernado por la Luna (Levanah). Funciona como un espejo gigante que refleja las energías planetarias superiores condensándolas para materializarlas en nuestro plano corporal.",
    advanced: "Purificación energética invocando el nombre sagrado SHADDAI EL CHAI. Visualizada sobre la zona genital en el Pilar Medio como una esfera violeta profunda que regula las emanaciones vitales (Prana/Kundalini) previas al cuerpo físico."
  },
  {
    id: "malkuth",
    category: "sefirot",
    name: "Malkuth",
    emoji: "🌍",
    association: "El Reino / Sefirá 10",
    gematria: "מלכות (496)",
    beginner: "El plano físico de la existencia terrestre, la naturaleza material, el cuerpo del buscador humano y el receptáculo final de todas las fuerzas superiores.",
    intermediate: "La Esfera de los Elementos (Cholem Yesodoth). Es donde se cristaliza la Shejiná (Presencia Divina Inmanente) de forma concreta en el mundo tridimensional de los sentidos comunes.",
    advanced: "Enraizamiento místico vibrando el nombre divino ritual ADONAI HA-ARETZ. Se activa rítmicamente en los pies como una esfera cuatripartita (citrino, oliva, bermellón y negro profundo), conectando al cuerpo con las corrientes de energías terrestres."
  },

  // --- 3. ARCANOS MAYORES DEL TAROT (22) ---
  {
    id: "tarot_0_loco",
    category: "tarot",
    name: "0 - El Loco",
    emoji: "🃏",
    association: "El Espíritu Libre / Sendero de Aleph",
    beginner: "El vagabundo divino que salta sin mirar al abismo cargando un fardo silbando. Simboliza nuevos comienzos inocentes, saltos de fe profundos y potencial ilimitado.",
    intermediate: "Asociado a la letra hebrea Aleph y el elemento Aire sacro. Representa el alma inmortal que encarna en el universo físico portando sabiduría pura que la mente mundana racional tilda de locura absoluta.",
    advanced: "La experiencia mística de la vacuidad primordial (Kether disolviéndose en Chokmah). Su correspondencia simbólica rige la libertad absoluta frente a las leyes del Karma y la maestría teúrgica de vaciar el Ego para llenarse de la luz espiritual divina."
  },
  {
    id: "tarot_1_mago",
    category: "tarot",
    name: "I - El Mago",
    emoji: "🧙",
    association: "La Voluntad Creadora / Sendero de Beth",
    beginner: "El canalizador de poder con un brazo elevado al cielo y otro señalando la tierra con los cuatro elementos sobre su mesa. Representa iniciativa, poder de manifestación activa y enfoque mental supremo.",
    intermediate: "Asociado a la letra hebrea Beth y el planeta Mercurio. Sostiene la máxima de 'Como es arriba, es abajo'. Canaliza los destellos divinos convirtiendo la potencialidad etérea en herramientas de manifestación racional concretas.",
    advanced: "Rito de consagración del altar hermético. El adepto que despierta al Mago interior manipula conscientemente el aire, fuego, agua y tierra en su psique a través de la concentración diamantina y el uso teúrgico de varas, copas, espadas y pantáculos."
  },
  {
    id: "tarot_2_sacerdotisa",
    category: "tarot",
    name: "II - La Sacerdotisa",
    emoji: "📖",
    association: "La Sabiduría Oculta / Sendero de Guimel",
    beginner: "La guardiana sentada entre las columnas Jakin y Boaz que sostiene un pergamino de la ley sagrada. Simboliza intuición, secretos ocultos, meditación profunda y pasividad inteligente.",
    intermediate: "Rige la letra hebrea Guimel y la Luna. Es el portal de la memoria subconsciente planetaria (Akasha) que vela y desvela la verdad detrás del velo de Isis para los iniciados meritorios.",
    advanced: "Pathworking de cruce del Abismo astral por medio del sendero directo de Guimel que une místicamente Kether con Tiphereth. Requiere un silencio mental absoluto, asimilando la influencia fría pero lúcida del espejo lunar supremo sin distorsiones psíquicas."
  },
  {
    id: "tarot_3_emperatriz",
    category: "tarot",
    name: "III - La Emperatriz",
    emoji: "👑",
    association: "Abundancia Creativa / Sendero de Daleth",
    beginner: "La madre sentada soberanamente en un campo de trigo fértil decorando un escudo con el glifo de Venus. Simboliza creatividad ilimitada, amor fecundo y nacimientos de ideas generadoras.",
    intermediate: "Corresponde a la letra hebrea Daleth ('La Puerta') y el amor de Venus. Representa el nacimiento milagroso del amor arquetípico, la matriz de las ideas sagradas encarnadas en belleza orgánica.",
    advanced: "Práctica de invocación teúrgica del arquetipo de la fecundidad mental. Es el portal iniciático por el cual las esencias puras intangibles cruzan los umbrales para condensarse en forma existencial, enseñando la transmutación del eros mundano en ágape místico."
  },
  {
    id: "tarot_4_emperador",
    category: "tarot",
    name: "IV - El Emperador",
    emoji: "🏰",
    association: "Poder Estructural / Sendero de He",
    beginner: "El gobernante sabio sentado en su trono labrado de piedra de carneros en la firme montaña. Simboliza autoridad moral sólida, disciplina inquebrantable, orden civil y estabilidad de reinos.",
    intermediate: "Se asocia a Aries (signo de fuego) y la letra hebrea He. Representa la ley terrenal divina que estabiliza el caos primordial, el establecimiento de imperios mentales bien estructurados gobernados bajo razón lógica.",
    advanced: "Visualización de la armadura alquímica solar. Ejercicios teúrgicos de fijación mundana de la voluntad imperial para gobernar las tempestades del plano astral inferior, proveyendo un espacio sagrado inexpugnable ante influencias entópicas destructivas."
  },
  {
    id: "tarot_5_hierofante",
    category: "tarot",
    name: "V - El Hierofante",
    emoji: "🏛️",
    association: "Iniciación de Misterios / Sendero de Vav",
    beginner: "El maestro espiritual con la tiara papal que bendice a dos acólitos señalando las llaves del conocimiento cruzadas. Simboliza enseñanza iniciática, sabiduría de tradición y revelación moral.",
    intermediate: "Viculado a la constelación de Tauro y la letra hebrea Vav ('El Clavo' que une cielo y tierra). Rige la voz interior inspiradora de la intuición superior orientando al buscador sincero hacia las escuelas sagradas.",
    advanced: "La invocación del Gurú espiritual interior o Ángel Guardián. El adepto medita sobre las llaves cósmicas de oro y plata cruzadas bajo los pies, unificando los aspectos físicos y mentales para comprender las revelaciones herméticas silenciosas."
  },
  {
    id: "tarot_6_enamorados",
    category: "tarot",
    name: "VI - Los Enamorados",
    emoji: "💞",
    association: "Decisión y Polaridad / Sendero de Zain",
    beginner: "La pareja en el jardín de Edén velados por el resplandor de un ángel solar de amor infinito. Simboliza elecciones libres cruciales basadas en el corazón, armonía emocional y polaridad integradora.",
    intermediate: "Letra hebrea Zain y el signo Géminis. Representa el matrimonio sagrado alquímico (Al-Kimia) de los aspectos masculinos activos y femeninos pasivos dentro del laboratorio mental humano.",
    advanced: "Práctica metafísica de la unificación mística del Azufre y el Mercurio en los niveles profundos de la psique iniciática, logrando un equilibrio diamantino que neutraliza de forma activa las ilusiones tridimensionales de enemistad o polarización exterior."
  },
  {
    id: "tarot_7_carro",
    category: "tarot",
    name: "VII - El Carro",
    emoji: "🛒",
    association: "Triunfo Consagrado / Sendero de Chet",
    beginner: "El guerrero coronado de estrellas controlando dos esfinges opuestas en su carro sagrado. Simboliza fuerza de voluntad férrea, control de pasiones enfrentadas y avance victorioso imperturbable.",
    intermediate: "Asociado a la letra hebrea Chet y el signo de Cáncer. Representa la coraza protectora del Ego espiritualizado y el triunfo de la mente centrada sobre el rebaño instintivo de los mundanos.",
    advanced: "Visualización activa sobre la armadura de luz astral. El adepto aprende a dirigir mísitcamente las dos esfinges (vibración Yang solar y Yin lunar) para ascender a través de las llanuras astrales manteniéndose de forma incorruptible centrado en el pilar del medio sagrado."
  },
  {
    id: "tarot_8_justicia",
    category: "tarot",
    name: "VIII - La Justicia",
    emoji: "⚖️",
    association: "Equilibrio Kármico / Sendero de Lamed",
    beginner: "La jueza imperturbable entronada sosteniendo la espada erguida y la balanza nivelada exacta. Simboliza verdad imparcial, consecuencias directas de tus actos pasados y rectitud moral.",
    intermediate: "Letra hebrea Lamed y el signo Libra. Se alinea con la Ley del Ritmo y Causa y Efecto del Kybalión, manteniendo equilibrada minuciosamente la balanza existencial de las emanaciones del Árbol de la Vida.",
    advanced: "Teúrgia de ajuste divino. Meditación en la espada llameante de equilibrio que separa y reubica adecuadamente las fuerzas disonantes en el aura humana del buscador, transmutando el peso de faltas pasadas mediante un sincero y estricto examen mental diario."
  },
  {
    id: "tarot_9_ermitano",
    category: "tarot",
    name: "IX - El Ermitaño",
    emoji: "🏮",
    association: "La Lámpara Interna / Sendero de Yod",
    beginner: "El anciano en la solitaria montaña nevada alumbrando el sendero con una lámpara que alberga una estrella de seis puntas. Simboliza autoconocimiento, guía protectora solitaria y introspección profunda.",
    intermediate: "Rige la letra hebrea Yod y el signo Virgo. Es la vigilia del guardián silencioso de los misterios eternos, que oculta el conocimiento profundo tras su capa de sencillez para proteger al neófito descuidado.",
    advanced: "Proceso interior de aislamiento alquímico purificador (MCD). Cultivar el fuego de la estrella interna de la lámpara en absoluto retiro de ruido exterior para aislar y fijar el Oro espiritual, logrando un despertar de la Gnosis que trasciende la soledad mundana."
  },
  {
    id: "tarot_10_rueda",
    category: "tarot",
    name: "X - La Rueda de la Fortuna",
    emoji: "🎡",
    association: "Ciclos del Destino / Sendero de Kaph",
    beginner: "Un disco misterioso grabado con letras sagradas del TETRAGRAMATON rodeado de criaturas arcanas místicas. Simboliza giros imprevistos del destino terrenal, suerte cósmica y ciclos kármicos vivos.",
    intermediate: "Viculado a la letra hebrea Kaph y el planeta Júpiter. Representa al buscador comprendiendo los eternos ascensos y descensos evolutivos de la materia sensible tridimensional bajo los influjos planetarios celestes.",
    advanced: "Meditación en el eje central inmóvil del torbellino existencial. El adepto retira su centro de anclaje de la circunferencia externa de la rueda (el vaivén azaroso del plano material mundano), habitando en la tranquilidad del centro absoluto del Ser."
  },
  {
    id: "tarot_11_fuerza",
    category: "tarot",
    name: "XI - La Fuerza",
    emoji: "🦁",
    association: "Dominio de la Pasión / Sendero de Tet",
    beginner: "La doncella coronada de flores que cierra suavemente y con amor el hocico de un león salvaje rojo. Simboliza fuerza mental sutil, autodisciplina serena intelectual y dominio de impulsos salvajes.",
    intermediate: "Regido por la letra hebrea Tet y el signo de Leo. Simboliza la transmutación del instinto animal inferior salvaje (el león devorador) mediante el poder magnético refinado del corazón iniciático compasivo.",
    advanced: "Elevación consciente del flujo de la Kundalini o Fuego Secreto Alquímico sin destruirse en el intento. La mente consciente pacifica y reorienta la fuerza líbida interna hacia los centros espirituales elevados del cerebro para revitalizar el cuerpo de luz del adepto."
  },
  {
    id: "tarot_12_colgado",
    category: "tarot",
    name: "XII - El Colgado",
    emoji: "🧗",
    association: "Inversión y Sacrificio / Sendero de Mem",
    beginner: "El joven pacífico colgado del tobillo de una horca en forma de cruz de Tau, con la cabeza aureolada de luz. Simboliza pausa introspectiva, sacrificios espirituales y ver el mundo desde otra perspectiva.",
    intermediate: "Conectado a la letra hebrea Mem y las Aguas de la vida arcanas. Es la etapa intermedia de incomprensión mundana donde el iniciado abandona voluntariamente el control material ordinario por sintonía con revelaciones divinas.",
    advanced: "La etapa de disolución alquímica interior mística. Disolver los dogmas lógicos rígidos del intelecto del Ego de forma consciente para permitir el retorno del alma a la fluidez cósmica primordial, experimentando el estado divino de no-acción y éxtasis puro."
  },
  {
    id: "tarot_13_muerte",
    category: "tarot",
    name: "XIII - La Muerte",
    emoji: "💀",
    association: "Transformación Alquímica / Sendero de Nun",
    beginner: "El esqueleto de armadura negra con un estandarte de rosa blanca marchando sobre reyes y plebeyos por igual. Simboliza finales necesarios dramáticos, transmutaciones profundas y renacer purificado.",
    intermediate: "Corresponde al signo Escorpio y la letra hebrea Nun ('El Pez'). Representa la disolución purificadora del envase limitante caduco en el baño corrosivo de la materia mística del laboratorio inferior.",
    advanced: "La Gran Putrefacción o Nigredo de la Alquimia Espiritual. Pasar conscientemente a través del vacío sepulcral, rompiendo los apegos emocionales e identitarios de la personalidad mundana construida para liberar el átomo solar eterno aprisionado por el Demiurgo."
  },
  {
    id: "tarot_14_templanza",
    category: "tarot",
    name: "XIV - La Templanza",
    emoji: "🏺",
    association: "Arte de Combinación / Sendero de Samekh",
    beginner: "Un ángel solar alado traspasando fluidos revitalizantes armoniosamente entre dos copas de oro y plata reales. Simboliza equilibrio templado emocional, sanación espiritual profunda y moderación total.",
    intermediate: "Asociado a la letra hebrea Samekh y el signo Sagitario. Representa el Arte de la Alquimia Espiritual, combinando el fuego de tus deseos con el agua de tus intuiciones para crear un elixir vital sano y equilibrado.",
    advanced: "Generación consciente del Elixir de Vida alquímico equilibrado de los opuestos. Ritos teúrgicos que unifican las energías masculinas internas (Yang solar) y femeninas (Yin lunar) en el micro-laboratorio áureo del templo del cuerpo humano."
  },
  {
    id: "tarot_15_diablo",
    category: "tarot",
    name: "XV - El Diablo",
    emoji: "😈",
    association: "Cadena de Ilusión / Sendero de Ayin",
    beginner: "El macho cabrío alado de Mendes sentado sobre un yunque con dos humanos encadenados del cuello de forma holgada. Simboliza adicciones mundanas materiales, engaño sensorial de los sentidos y temores ocultos.",
    intermediate: "Rige la letra hebrea Ayin ('El Ojo' ilusorio) y el signo de Capricornio. Simboliza el encuentro directo con el propio ego desbocado y la ilusión material limitante creada por el Demiurgo (Yaldabaoth) para mantenerte prisionero.",
    advanced: "Transmutación de la sombra personal en fuerza catalizadora pura. El iniciado asimila las energías salvajes reprimidas que habitan en la fosa del subconsciente más oscuro de forma amorosa y bajo control absoluto de su voluntad, rompiendo las cadenas ilusorias y usando el fuego creativo liberador."
  },
  {
    id: "tarot_16_torre",
    category: "tarot",
    name: "XVI - La Torre",
    emoji: "⚡",
    association: "Caída de Mentiras / Sendero de Pe",
    beginner: "Una gran torre de piedra golpeada por un rayo celeste divino que desploma su corona dorada y a dos personas al abismo vacío. Simboliza cambios repentinos catastróficos, liberación de prisiones falsas mentales.",
    intermediate: "Vinculado a la letra hebrea Pe ('La Boca') y el destructivo Marte. Representa la destrucción súbita y compasiva de las falsas doctrinas místicas y castillos de naipes construidos sobre el orgullo existencial humano de tu Ego.",
    advanced: "El destello iniciático de la superación de la falsa realidad. La irrupción de la visión espiritual pura de Kether que derriba instantáneamente los reinos de mentira del intelecto del adepto, forzando un renacimiento cósmico despojado de hipocresías doctrinales."
  },
  {
    id: "tarot_17_estrella",
    category: "tarot",
    name: "XVII - La Estrella",
    emoji: "⭐",
    association: "Guía de Fe Sagrada / Sendero de Tzaddi",
    beginner: "La doncella desnuda que vierte aguas de sabiduría mística sobre la tierra y el estanque sagrado bajo una gran estrella de brillo divino celestial. Simboliza esperanza cósmica, serenidad pura artística e inspiración espiritual.",
    intermediate: "Asociado al signo Acuario y la letra hebrea Tzaddi. Representa la revelación del canal superior cósmico por el cual cae de forma pacífica y constante el rocío de sanación sobre la psique sedienta del adepto buscador.",
    advanced: "Activación del Kundalini estelar a través del chakra coronilla. Meditación de sintonía fina con las constelaciones superiores que derraman sabiduría cuántica purificadora sobre el cuerpo de luz del mago, consagrando su vehículo existencial para el servicio fraterno universal."
  },
  {
    id: "tarot_18_luna",
    category: "tarot",
    name: "XVIII - La Luna",
    emoji: "🌙",
    association: "Misterio del Subconsciente / Sendero de Qoph",
    beginner: "Un disco lunar triste vertiendo y gotas divinas sobre un páramo donde un perro y lobo aúllan entre dos torres mientras un cangrejo surge de aguas profundas. Simboliza laberintos emocionales oscuros, miedos ciegos profundos e intuición onírica salvaje.",
    intermediate: "Letra hebrea Qoph y el signo Piscis. Describe el difícil sendero nocturno de cruce astral (el desierto del alma), donde las creaciones mentales grotescas aberrantes de tu subconsciente cobran vida para poner a prueba tu temple e integridad sagrada.",
    advanced: "Magia astral nocturna y superación de ilusiones fantasmagóricas de la mente subconsciente. El iniciado aprende a caminar imperturbado a través del umbral de las sombras oníricas de la psique, domando sus miedos primordiales y transformando la pesadilla en un mapa de sabiduría trascendental."
  },
  {
    id: "tarot_19_sol",
    category: "tarot",
    name: "XIX - El Sol",
    emoji: "☀️",
    association: "Gran Despertar Solar / Sendero de Resh",
    beginner: "Un niño inocente alegre cabalgando desnudo sobre un corcel blanco bajo el resplandor de un sol gigante protector. Simboliza éxito glorioso en el mundo terrenal, claridad mental absoluta y vitalidad feliz pura.",
    intermediate: "Rige la letra hebrea Resh y el Sol vital. Simboliza el despertar de la conciencia de Cristo o el Oro Alquímico radiante en tu mente existencial, disolviendo toda sombra de confusión ideológica anterior.",
    advanced: "Generación del cuerpo radiante inmortal de luz sagrada (Cuerpo de Oro Alquímico). El mago funde ceremonialmente sus polaridades en un resplandor eterno solar teúrgico, asumiendo su divinidad innata integrada perfectamente con las fuerzas benefactoras eternas del cosmos cósmico."
  },
  {
    id: "tarot_20_juicio",
    category: "tarot",
    name: "XX - El Juicio",
    emoji: "🎺",
    association: "Trascendencia Cósmica / Sendero de Shin",
    beginner: "Un ángel celestial tocando una trompeta sagrada desde nubes celestes mientras difuntos resurgen felices de sus tumbas en las aguas del tiempo. Simboliza llamados espirituales reveladores, despertares profundos e integración final de vidas.",
    intermediate: "Asociado a la letra hebrea Shin y el elemento Fuego cósmico o Espíritu (Éter/Prana). Describe el despertar de tu letargo espiritual planetario obligado por el Demiurgo, liberándote del velo material rígido de las formas falsas de la Matrix terrestre.",
    advanced: "Ritual ceremonial de resurrección de la conciencia iniciática. El adepto transmuta de forma absoluta y definitiva su antiguo envoltorio de arcilla mundano, escuchando el llamado trascendental divino que le permite unificar y disolver su individualidad temporal en el Vacío Supremo Sagrado."
  },
  {
    id: "tarot_21_mundo",
    category: "tarot",
    name: "XXI - El Mundo",
    emoji: "🌍",
    association: "Éxito Absoluto Integral / Sendero de Tav",
    beginner: "Una hermosa doncella danzante sosteniendo dos varas mágicas al centro de una corona de hermosas hojas rodeada de los cuatro Querubines bíblicos. Simboliza finales de ciclos coronados de éxito absoluto místico completo e integración cósmica libre.",
    intermediate: "Correspondiente a la letra hebrea Tav y Saturno. Representa la reintegración cósmica íntegra y total de tu psique con el macrocosmos divino resuelto; la culminación exitosa absoluta de la Gran Obra alquímica iniciada en vidas.",
    advanced: "La estabilización final divina de la conciencia cósmica sagrada. El iniciado habita permanentemente al centro de la danza cósmica eterna del universo material e inmaterial, gobernando las leyes físicas inferiores y disfrutando de la comunión íntima espiritual inmanifestada duradera."
  },

  // --- 4. ELEMENTOS CLÁSICOS (4) ---
  {
    id: "el_fuego",
    category: "elementos",
    name: "Fuego",
    emoji: "🔥",
    association: "Yod / Voluntad Divina / Salamandras",
    beginner: "La fuerza de combustión, calor extremo y ascensión lumínica vivaz. Simboliza voluntad personal férrea, vitalidad pura, espíritu destructivo sagrado-purificador, acción decidida rápida.",
    intermediate: "Letra hebrea Yod ('La Semilla') y los espíritus naturales llamados Salamandras elementales. En el laboratorio alquímico inferior interno, es el calor constante medido necesario para catalizar las cocciones de los compuestos impuros.",
    advanced: "Convocatoria y dominio ceremonial de cuadrante sur a través del Ritual Menor del Pentagrama. Activa e intensifica el deseo puro místico solar dentro del cuerpo sutil del mago iniciático, disolviendo toda inercia mental destructiva de Hod y miedos terrestres pasivos."
  },
  {
    id: "el_agua",
    category: "elementos",
    name: "Agua",
    emoji: "💧",
    association: "He / Intuición Sagrada / Ondinas",
    beginner: "Fluidez maleable refrescante de mares internos y externos puros. Simboliza intuición cósmica superior profunda, reino de las emociones sutiles humanas, receptividad amorosa pasiva infinita.",
    intermediate: "Letra hebrea He primero de los nombres divinos cruzados y el reino elemental de las Ondinas de estanques mágicos. Gobierna la disolución sanadora purificadora psíquica y la incubación delicada de las simientes metales.",
    advanced: "Purificación teúrgica del cuenco occidental y llamado ceremonial de entidades acuosas sabias celestes. Sintonizar el flujo onírico controlado de tus meditaciones para viajar de forma profunda a través de los océanos magnéticos de Yesod protector espiritual supremo."
  },
  {
    id: "el_aire",
    category: "elementos",
    name: "Aire",
    emoji: "💨",
    association: "Vav / Intelecto Sagrado / Silfos",
    beginner: "El susurro invisible constante que acaricia y nutre la vida planetaria sutil entera. Simboliza pensamiento racional puro, comunicación intelectual veloz, ideas generatrices místicas.",
    intermediate: "Yod-He-Vav-He representa el elemento central reconciliador intermedio Vav y el misterioso reino de los Silfos del cielo sagrado. Gobierna la evaporación sutil y el viento de inspiración que guía al artista místico.",
    advanced: "Invocación mágica del portal de cuadrante oriental cósmico planetario. El mago entona la vibración sónica sagrada del viento sagrado para expandir su aura protectora a través del campo cuántico, logrando telepatía, claridad mental y destreza de fórmulas."
  },
  {
    id: "el_tierra",
    category: "elementos",
    name: "Tierra",
    emoji: "🪵",
    association: "He (F) / Estabilidad Física / Gnomos",
    beginner: "Suelo fértil mineral estable cimiento del cuerpo físico biológico de sentidos tridimensionales primarios. Simboliza paciencia labrada, ley de gravedad, abundancia de recursos.",
    intermediate: "Letra He final del sagrado Tetragramatón y el reino subterráneo laborioso de los Gnomos de las cuevas sagradas. Simboliza la cristalización concreta de las fuerzas solares etéreas dándoles molde tangible físico.",
    advanced: "Rito de consagración del Pantáculo o disco de cera consagrado del Altar. Anclar de forma estable las energías vibratorias espirituales elevadas cósmicas en el vehículo terrenal Malkuth de modo seguro para proteger la salud celular somática."
  },

  // --- 5. LOS 7 CHAKRAS (7) ---
  {
    id: "ch_muladhara",
    category: "chakras",
    name: "1 - Muladhara",
    emoji: "🔴",
    association: "Chakra Raíz / Lam / Soporte Base",
    beginner: "Chakra raíz ubicado firmemente en la base de la columna ósea inferior de color rojo tierra. Rige nuestro instinto de supervivencia biológica básica de sentidos.",
    intermediate: "Frecuencia resonante sónica del mantra sagrado sánscrito LAM. Simboliza la morada mística de la serpiente sagrada Kundalini enrollada durmiente esperando el sublime despertar espiritual.",
    advanced: "Purificación del asiento elemental de la materia física somática. Se activa mediante respiración de vacío pélvica rítmica para solidificar el cuerpo sutil ante peligros físicos mundanos dándole un escudo inamovible de magnetismo terrestre denso sano."
  },
  {
    id: "ch_svadhisthana",
    category: "chakras",
    name: "2 - Svadhisthana",
    emoji: "🟠",
    association: "Chakra Sacro / Vam / Dulzura Creativa",
    beginner: "Chakra sacro ubicado dos dedos por debajo de tu ombligo biológico de color naranja vivaz. Rige tu sexualidad regenerativa, pasiones de goce creativo sensorial.",
    intermediate: "Se asocia sintonizadamente con la vibración sónica del mantra sagrado sánscrito VAM y el elemento líquido Agua cósmico. Gobierna la fluidez instintiva y el equilibrio de hormonas.",
    advanced: "Sublimación de la libido sagrada primordial sutil. El adepto transmuta conscientemente el deseo físico orgánico inferior canalizándolo hacia arriba sutilmente a través de los tubos sutiles Sushumna para nutrir las funciones cerebrales superiores."
  },
  {
    id: "ch_manipura",
    category: "chakras",
    name: "3 - Manipura",
    emoji: "🟡",
    association: "Chakra Plexo Solar / Ram / Ciudad de Joyas",
    beginner: "Chakra de plexo solar en la boca de tu estómago biológico de color amarillo solar radiante. Rige tu poder personal de voluntad terrenal, autoestima de acción.",
    intermediate: "Resuena íntimamente con el mantra místico sagrado sánscrito RAM y el elemento ígneo Fuego. Es el caldero interno cósmico donde se procesan todas tus asimilaciones emocionales de existencias.",
    advanced: "Protección alquímica del plexo solar existencial. Visualizar un sol de luz dorada blindada de trazos perfectos que repele activamente el vampirismo magnético de parásitos astrales mundanos protegiendo tu vitalidad vital."
  },
  {
    id: "ch_anahata",
    category: "chakras",
    name: "4 - Anahata",
    emoji: "🟢",
    association: "Chakra Corazón / Yam / Sonido Sin Choque",
    beginner: "Chakra de corazón en el centro del pecho biológico de hermoso color verde esmeralda o rosa puro. Rige tu amor incondicional divino, empatía de curación profunda.",
    intermediate: "Sintonizado con la vibración del mantra sagrado sagrado sánscrito YAM y el elemento gaseoso Aire místico. Es el puente sagrado dorado intermedio que une los chakras terrenales inferiores con los celestes elevados.",
    advanced: "Despertar del ojo del corazón sagrado teúrgico. El iniciado asimila la luz de paz perfecta de Anahata para emitir corrientes electromagnéticas de curación divina capaces de regular mareas vibratorias desarmónicas ajenas con sola proximidad."
  },
  {
    id: "ch_vishuddha",
    category: "chakras",
    name: "5 - Vishuddha",
    emoji: "🔵",
    association: "Chakra Garganta / Ham / Purificación Pura",
    beginner: "Chakra de garganta sobre tu laringe biológica de color azul celeste celestial brillante. Rige tu poder de comunicación de verdades verbales, expresión de bellos decretos.",
    intermediate: "Asociado a la frecuencia vibratoria elemental del mantra sagrado HAM y el misterioso Éter o espacio cósmico (Akasha). Es la morada creativa sagrada de la palabra sonora hablada cósmica.",
    advanced: "Dominio sagrado teúrgico de convocatorias síncronas. Aprender a cantar mantras o conjuros antiguos con la voz de pecho aureolada sintonizando la fonética sánscrita o hebrea exacta para precipitar cambios moleculares en matrices sutiles circundantes."
  },
  {
    id: "ch_ajna",
    category: "chakras",
    name: "6 - Ajna",
    emoji: "🟣",
    association: "Tercer Ojo / Om / Comando Superior",
    beginner: "Chakra de tercer ojo sobre el entrecejo facial de misterioso color índigo o violeta electrizante. Rige intuición cósmica superior, clarividencia mental pura onírica.",
    intermediate: "Vibración con el mantra inmortal eterno OM. Representa la glándula pineal psíquica pura estimulada que traspasa velos de tiempo lineal tridimensional para captar realidades alternas celestes.",
    advanced: "Apertura del ojo clarividente de Horus para proyección astral segura. Prácticas visuales sostenidas meditando en el sigilo sutil frontal sónico para desvanecer la ilusión óptica demiúrgica espacial leyendo tramas del destino vivas."
  },
  {
    id: "ch_sahasrara",
    category: "chakras",
    name: "7 - Sahasrara",
    emoji: "💮",
    association: "Chakra Corona / Silencio / Loto Mil Pétalos",
    beginner: "Chakra corona en la coronilla de la cabeza humana de color blanco puro deslumbrante o violeta celestial sutil. Rige tu iluminación perfecta cósmica divina de trascendencia.",
    intermediate: "Resuena íntimamente con el mantra del Silencio místico primordial infinito o el sonido universal que unifica el buscador existencial con la mente inmanifestada del Ein Sof de cábalas.",
    advanced: "Proceso sutil de samadhi o éxtasis místico perdurable existencial. Desvincular conscientemente la autoconciencia de todo molde de ego carnal frágil temporal fundiendo la chispa interna con la luz cósmica increada increada suprema."
  },

  // --- 6. LOS 12 SIGNOS DEL ZODIACO (12) ---
  {
    id: "zo_aries",
    category: "zodiaco",
    name: "Aries",
    emoji: "🐏",
    association: "Iniciador del Fuego / Casa 1",
    beginner: "El carnero impetuoso de fuego iniciador dinámico. Simboliza valentía, pasión que aviva, inicios rápidos e individualidad de liderazgo férreo.",
    intermediate: "Gobernado por la vibración bélica de Marte. Representa la irrupción original de la energía primaveral divina que brota destruyendo barreras heladas invernales del cosmos terrenal.",
    advanced: "Transmutación de la agresividad animal inferior en impulso de voluntad teúrgica pura (Fuego Sagrado). Adecuar tu respiración para enfocar el deseo en tus trabajos rituales sin dispersión dispersora de Hod."
  },
  {
    id: "zo_tauro",
    category: "zodiaco",
    name: "Tauro",
    emoji: "🐂",
    association: "Estabilizador de Tierra / Casa 2",
    beginner: "El toro sereno laborioso de tierra protectora fértil. Simboliza paciencia perseverante, placer de sentidos estables, constancia férrea de reinos materiales.",
    intermediate: "Gobernado por el amor refinado estético de Venus. Es la fijación concentrada orgánica de los brotes de Aries para que tomen forma de tallo duradero en el huerto humano.",
    advanced: "Invocación de corrientes de prosperidad material benévola real. El mago manipula las energías de Tauro sobre el altar para materializar recursos de salud celular sagrada duraderos con paciencia alquímica."
  },
  {
    id: "zo_geminis",
    category: "zodiaco",
    name: "Géminis",
    emoji: "♊",
    association: "Dualidad del Aire / Casa 3",
    beginner: "Los gemelos curiosos ágiles de aire movedizo purificador. Simboliza intelecto jovial rápido, comunicación elocuente de dualidades, aprendizaje de letras.",
    intermediate: "Regido por el intelecto mercurial sagrado de Hermes. Representa los dos Pilares Jakin y Boaz que flanquean los misterios del cosmos iniciático hermético planetario.",
    advanced: "unificación mental sagrada de polaridades mentales. Desarticular el laberinto intelectual disolviéndolo con respiraciones síncronas para fusionar tus aspectos lógicos y abstractos en un chispazo lúcido divino."
  },
  {
    id: "zo_cancer",
    category: "zodiaco",
    name: "Cáncer",
    emoji: "♋",
    association: "Nutrición del Agua / Casa 4",
    beginner: "El cangrejo sensible profundo de agua cristalina nutricia. Simboliza protección materna de ideas celestes, hogar del alma íntimo sutil sutil, memorias oníricas.",
    intermediate: "Gobernador celestial por la Luna cambiante de mareas psíquicas. Es el útero acuoso sutil donde se incuban pacientemente las semillas espirituales sagradas previas a encarnar.",
    advanced: "Inmersión onírica en la memoria akáshica de vidas pasadas mundanas. El adepto usa corrientes acuosas rítmicas para viajar de espaldas de forma consciente a través del útero lunar de Yesod sintonizando verdades ocultas."
  },
  {
    id: "zo_leo",
    category: "zodiaco",
    name: "Leo",
    emoji: "🦁",
    association: "Realeza del Fuego / Casa 5",
    beginner: "El león real deslumbrante de fuego solar majestuoso. Simboliza orgullo generoso, poder de magnetismo personal soberano, expresión artística sincera fecunda.",
    intermediate: "Bajo el influjo soberano directo de la estrella del Sol. Representa el corazón espiritual humano radiante vibrando de forma generosa compasión pura cósmica divina celestial.",
    advanced: "Fórmula sagrada alquímica de transmutación de la libido en Fuego Alquímico radiante. Despertar al león de oro de tu pecho por medio de teúrgia cardíaca radiante para fulminar larvas astrales."
  },
  {
    id: "zo_virgo",
    category: "zodiaco",
    name: "Virgo",
    emoji: "♍",
    association: "Purificación de Tierra / Casa 6",
    beginner: "La doncella pura protectora de tierra labrada detallada. Simboliza discernimiento de detalle, purificación de impurezas, servicio laborioso desinteresado.",
    intermediate: "Bajo la faceta pragmática detallada de Mercurio. Representa la cosecha selectiva mística que separa delicada y concienzudamente el trigo nutritivo útil de la paja inútil nociva.",
    advanced: "El proceso de disolución y refinación molecular de tus hábitos mentales insanos mundanos. Meditar sobre las geometrías de pureza terrestre para restablecer el orden celular de tu templo somático físico."
  },
  {
    id: "zo_libra",
    category: "zodiaco",
    name: "Libra",
    emoji: "♎",
    association: "Equilibrio del Aire / Casa 7",
    beginner: "La balanza nivelada precisa de aire armonioso estético. Simboliza justicia equitativa de relaciones humanas, armonía amorosa de pactos sinceros, belleza artística pura.",
    intermediate: "Bajo la influencia romántica estética de Venus refinada celestial. Representa el punto de equilibrio de senderos que cruza de lado a lado el laberinto existencial cósmico mundano.",
    advanced: "La experiencia cósmica de neutralidad absoluta de juicios egóticos. El mago se posiciona imperturbablemente al centro de la balanza existencial, disolviendo toda discordia vibrada para armonizar cuencos mágicos."
  },
  {
    id: "zo_escorpio",
    category: "zodiaco",
    name: "Escorpio",
    emoji: "🦂",
    association: "Alquimia del Agua / Casa 8",
    beginner: "El escorpión transmutador misterioso de agua profunda oscura. Simboliza regeneración espiritual profunda desestructurante, miedos superados mísitcos, poder oculto mental.",
    intermediate: "Gobernado conjuntamente por Marte y Plutón regenerativo. Describe el crisol subterráneo del laboratorio donde la materia negra muerta es transmutada obligatoriamente en elixir solar sagrado.",
    advanced: "Despertar del Águila o Fénix espiritual desde el asfixiante veneno del escorpión de fango. El adepto usa meditación profunda en la fosa subconsciente para reinar sobre demonios internos liberando el alma inmortal divina."
  },
  {
    id: "zo_sagitario",
    category: "zodiaco",
    name: "Sagitario",
    emoji: "🏹",
    association: "Explorador del Fuego / Casa 9",
    beginner: "El centauro sabio flechador de fuego inspirador veloz. Simboliza filosofías sagradas aventureras de misticismo, optimismo de metas espirituales, viajes de Gnosis.",
    intermediate: "Regido mísitcamente por la generosidad opulenta de Júpiter constructor celestial. Es la flecha de la voluntad enfocada que apunta directamente hacia los cuadrantes celestes del Ein Sof infinito.",
    advanced: "Proyección astral dirigida mediante visualización del arco de luz teúrgico. El mago tensa sus intenciones de transmutación y lanza su conciencia inmortal más allá del espacio-tiempo material ordinario de sentidos."
  },
  {
    id: "zo_capricornio",
    category: "zodiaco",
    name: "Capricornio",
    emoji: "♑",
    association: "Ascensión de Tierra / Casa 10",
    beginner: "La cabra con cola de pez trepadora de tierra rocosa montañosa solitaria. Simboliza disciplina constructora inquebrantable, ascensas lentas con paciencia sólida cósmica.",
    intermediate: "Gobernado bajo la estricta y sabia disciplina estructural de Saturno. Representa la cumbre solitaria mística donde se revela la luz iniciática tras duros inviernos de introspección.",
    advanced: "Consolidación de la voluntad del Ego consagrado en Malkuth terrenal definitivo. Caminar por la escarpa de las pruebas existenciales con compostura monacal divina para revestirse del cetro imperial estable cósmico."
  },
  {
    id: "zo_acuario",
    category: "zodiaco",
    name: "Acuario",
    emoji: "♒",
    association: "Aguador del Aire / Casa 11",
    beginner: "El aguador generoso vertiendo saber de cántaros en el aire cósmico social de mundos. Simboliza genialidades rebeldes transgresoras libertadoras, fraternidad humana.",
    intermediate: "Bajo la influencia revolucionaria fulminante de Urano y Saturno antiguos. Representa el derramamiento altruista sagrado del rocío cósmico celestial despertando conciencias encadenadas.",
    advanced: "Conexión cuántica mental con el futuro evolutivo planetario de la Gnosis pura sin barreras ideológicas. El buscador de verdades vacía su cántaro de prejuicios para sembrar semillas galácticas elevadas."
  },
  {
    id: "zo_piscis",
    category: "zodiaco",
    name: "Piscis",
    emoji: "♓",
    association: "Disolvencia del Agua / Casa 12",
    beginner: "Los dos peces nadando síncronos en direcciones enfrentadas atados por cuerda de agua onírica. Simboliza disolución compasiva mística suprema, fe de sueños.",
    intermediate: "Regido mísitcamente por Neptuno místico e intuitivo sagrado y Júpiter antiguo. Es el vasto océano primordial infinito de ensueños oníricos donde se disuelven las ilusiones físicas de reinos.",
    advanced: "Estabilización del viaje astral en el océano primordial Akáshico disolviéndose sin perderse de forma lúcida definitiva. El iniciado funde su aura con el loto marino cósmico, unificando su vibración solar."
  },

  // --- 7. QLIFOT (LOS 10 LADOS DEL ÁRBOL SOMBRA) (10) ---
  {
    id: "ql_thaumiel",
    category: "qlifot",
    name: "Thaumiel",
    emoji: "👹",
    association: "La Dualidad en Conflicto / Espejo de Kether",
    beginner: "La contraparte oscura de Kether en el Árbol del Conocimiento oscuro. Representa la dualidad eterna en conflicto hostil, la negación agresiva de la unidad pura cósmica divina.",
    intermediate: "Rige las potencias gigantescas enfrentadas de Satanás y Moloch arcaicos. Describe las guerras internas del Ego mundano que repudia sintonizar con la fuente por vanidades caprichosas de control hostil ciego.",
    advanced: "Asimilación hermética profunda de la sombra divisora extrema. El iniciado del Sendero de la Mano Izquierda transmuta la rebelión hostil destructiva en voluntad indomable lucidísima, rompiendo los moldes limitantes demiúrgicos dogmáticos."
  },
  {
    id: "ql_chaigidiel",
    category: "qlifot",
    name: "Chaigidiel",
    emoji: "🌫️",
    association: "La Confusión Mental / Espejo de Chokmah",
    beginner: "La fuerza de obstrucción oscura que distorsiona la sabiduría divina. Simboliza dogmas ciegos absurdos, confusión mental paralizante, e interferencias de pensamientos insanos.",
    intermediate: "Rige la fuerza de Beelzebub en las cortes de las moscas oscuras astrales. Es el torbellino de mentiras que tienta al neófito para que use el saber sagrado con fines tiranos egoístas destructivos de poder.",
    advanced: "Desmantelar de forma lúcida la falsa doctrina limitante ilusoria interior. El mago sintoniza con el pilar de luz interior para disolver las moscas parásitas de hod que nublan su clarividencia pineal con lógica aberrante."
  },
  {
    id: "ql_satariel",
    category: "qlifot",
    name: "Satariel",
    emoji: "🕸️",
    association: "El Ocultamiento Hostil / Espejo de Binah",
    beginner: "El velo de silencio negro que encarcela y esconde la luz de forma opresiva ciega. Simboliza prisiones mentales severas sin amor incondicional divino, miedos fóbicos rígidos.",
    intermediate: "Rige Lucifugo Rofocale bajo las leyes saturninas de la muerte cósmica egoísta. Es la tumba negra existencial de leyes muertas que priva al alma del calor unificador superior de Tiphereth.",
    advanced: "Cruzar de forma segura por el laberinto de Satariel integrando la disciplina severa sin caer en dogmas helados opresivos. Purificar la armadura protectora para transmutar el frío fóbico en sabiduría paciente oculta."
  },
  {
    id: "ql_gamchicoth",
    category: "qlifot",
    name: "Gamchicoth",
    emoji: "🐺",
    association: "Los Devoradores Astrales / Espejo de Chesed",
    beginner: "La fuerza invasiva tiránica que fagocita y devora los campos de energía de forma codiciosa. Simboliza codicia material voraz egocéntrica destructiva, gula de lujos mundanos.",
    intermediate: "Asociado a Astaroth y el reverso hostil de Júpiter. Describe el imperialismo moral despiadado de gobernantes que esclavizan al pueblo robándoles la vitalidad con falsas promesas dogmáticas de reinos.",
    advanced: "Protección de tus biocampas celulares de los devoradores de energía astral o larvas psíquicas parásitas. Usar decretos de anclaje de metal dorado canalizando la justicia estricta benívola para disolver succionadores."
  },
  {
    id: "ql_golachab",
    category: "qlifot",
    name: "Golachab",
    emoji: "🌋",
    association: "Los Quemadores / Espejo de Geburah",
    beginner: "El fuego destructor ciego incontrolable, ira volcánica irracional pura. Simboliza sadismo físico o mental hostil, guerras insanas irracionales que arruinan esperanzas.",
    intermediate: "Gobernado mísitcamente por Asmodeo teúrgico oscuro del deseo quemador. Es la fuerza destructiva inútil que calcina tu laboratorio mental por estallidos coléricos de ego ofendido.",
    advanced: "Transmutación de la caldera volcánica de Golachab en Fuego Purificador templado. El iniciado canaliza de forma sabia su indignación existencial ante tiranías demiúrgicas usándola de impulsora para su Gran Obra mística."
  },
  {
    id: "ql_thagirion",
    category: "qlifot",
    name: "Thagirion",
    emoji: "🧌",
    association: "El Sol Negro / Espejo de Tiphereth",
    beginner: "La contraparte fea distorsionada del Sol radiante armónico. Representa fealdad espiritual mundana soberbia ególatra tiránica, el falso ídolo de oropel brillante vacío.",
    intermediate: "Rige Belfegor bajo la luz de la pereza lujosa ilusoria de altares. Es el deslumbramiento de falsos gurús ambiciosos que usan teatro iniciático para desviar adeptos sedientos de verdades reales.",
    advanced: "Discernimiento extremo ante el Sol Negro interior y exterior. El adepto se despoja de toda búsqueda egocéntrica de aplauso tridimensional, anclándose exclusivamente en la luz silenciosa sagrada sutil del Ein Sof de cábalas."
  },
  {
    id: "ql_harab_serapel",
    category: "qlifot",
    name: "Harab Serapel",
    emoji: "🐦",
    association: "Los Cuervos de la Muerte / Espejo de Netzach",
    beginner: "Los cuervos del cementerio que devoran restos de pasiones desbocadas marchitas. Simboliza melancolías profundas destructivas, celos psicóticos destructivos de amor.",
    intermediate: "Regido por Baal y el reverso marchito corruptor de Netzach elemental. Describe los campos de batallas emocionales de intriga y sospecha donde el alma se desangra atada a deseos pasados.",
    advanced: "Maestría para volar por encima del cementerio mental de Harab Serapel como un halcón solar radiante y glorioso. El mago aprende a soltar los despojos muertos de su personalidad mundana obsoleta con gozo iniciático puro."
  },
  {
    id: "ql_samael",
    category: "qlifot",
    name: "Samael",
    emoji: "🦂",
    association: "El Veneno de Dios / Espejo de Hod",
    beginner: "La fuerza de intoxicación intelectual mental insana. Simboliza escepticismo ciego burlón, frialdad lógica despiadada satírica que destruye las intuiciones sagradas.",
    intermediate: "Rige Adramelek en las cortes de las ilusiones mercuriales oscuras complejas. Convierte los dogmas verbales teóricos en un veneno corrosivo inoculado en las mentes curiosas inexpertas.",
    advanced: "Transmutación del veneno de la amargura en Medicina Alquímica Suprema (MCD). El adepto consume sus venenos mentales lógicos de escepticismos mediante fuego de amor puro revelado, transformándolos en intelecto lúcido puro."
  },
  {
    id: "ql_gamaliel",
    category: "qlifot",
    name: "Gamaliel",
    emoji: "🧛",
    association: "La Obscena / Espejo de Yesod",
    beginner: "La fosa oscura de las fantasías sexuales perturbadoras reprimidas salvajes aberrantes. Simboliza adicciones oníricas nocturnas, vampirismo psíquico de pesadillas vivas.",
    intermediate: "Regido mísitcamente por Lilith la bella oscura de los súcubos astrales de lodo. Es el laberinto de pesadillas donde las larvas absorben la líbido del buscador de verdades descuidado durmiente.",
    advanced: "Blindaje de tus viajes astrales nocturnos ante seducciones ilusorias de Gamaliel. El mago entona palabras divinas hebreas de desterrar y utiliza mudras del león dorado para evaporar súcubos de fosa fijando vitalidad lunar pura."
  },
  {
    id: "ql_nehemoth",
    category: "qlifot",
    name: "Nehemoth",
    emoji: "🕳️",
    association: "Los Susurradores de Tierra / Espejo de Malkuth",
    beginner: "La pesadez de barro espeso fango asfixiante materialista. Simboliza ceguera espiritual absoluta en reinos terrenales de sentidos primarios de codicia animal.",
    intermediate: "Bajo el reinado sombrío de Nahemah la susurradora de fango negro. Intoxica los sentidos tridimensionales del iniciado para adormecer su deseo de búsqueda presentándole riquezas de ilusiones muertas mundanas.",
    advanced: "El proceso místico de asimilación y purificación molecular del barro denso somático terrestre físico. Levantar las perlas de luz cristalina divina atrapadas bajo el fango asfixiante de Nahemah para consagrarlas sobre altar."
  },

  // --- 8. SÍMBOLOS ADICIONALES (5) ---
  {
    id: "pentagrama",
    category: "adicionales",
    name: "Pentágrama L.",
    emoji: "⭐",
    association: "Microcosmos / Dominio Elemental",
    beginner: "La estrella de cinco puntas que apunta erguida arriba representando el ser humano perfecto. Simboliza el espíritu gobernando victoriosamente los cuatro elementos materiales.",
    intermediate: "En Cábala suma el sagrado nombre YESHUA (Yod-He-Shin-Vav-He), donde el Espíritu (letra Shin) unifica y pacifica el fuego, aire, agua y tierra caóticos de tu Ego.",
    advanced: "La base geométrica para el trazado exacto en el Ritual Menor de Destierro del Pentagrama (RMDP). El adepto expande una deslumbrante estrella flamígera azul de luz astral desde sus dedos hacia los cuadrantes kardinales espaciales."
  },
  {
    id: "cruz_celta",
    category: "adicionales",
    name: "Cruz Celta",
    emoji: "🪦",
    association: "Integración de Ejes del Ser",
    beginner: "La hermosa cruz grabada de hermosos nudos celtas abrazada por un anillo circular en su centro. Simboliza la unificación armoniosa de caminos de reinos celestes con terrenales.",
    intermediate: "El puente de senderos herméticos arcaicos donde se cruza el eje vertical cósmico (Ascensión espiritual) con el eje horizontal de la naturaleza material tridimensional.",
    advanced: "Meditación espacial de estabilidad energética existencial tridimensional. El iniciado se sumerge al centro inmóvil de la cruz celta, alineando su esqueleto óseo terrenal con las corrientes magnéticas cósmicas sagradas solares."
  },
  {
    id: "sri_yantra",
    category: "adicionales",
    name: "Sri Yantra",
    emoji: "☸️",
    association: "Geometría Tántrica No-Dual",
    beginner: "Un sagrado cosmograma de intrincados triángulos entrelazados que emanan armónicamente de un punto central imperceptible. Símbolo supremo de iluminación y unión mística tántrica del ser de reinos.",
    intermediate: "Símbolo sagrado de la mística de la deidad Tripurasundari gobernando mundos. Representa las fuerzas activas que dan origen al macrocosmos integrados síncronamente con el micro-laboratorio humano corporal sutil.",
    advanced: "Prácticas avanzadas de contemplación meditativa Trataka sobre el Bindu o punto central inmóvil absoluto. El mago entona cantos sagrados para sintonizar su glándula pineal con el Sri Yantra visual, logrando el samadhi."
  },
  {
    id: "mandala",
    category: "adicionales",
    name: "Mandala Cósmico",
    emoji: "🎨",
    association: "Mapa Psíquico de Integración Central",
    beginner: "Dibujo de simetrías concéntricas bellas que guían la mirada humana hacia el centro espiritual interno pacificador. Ayuda a meditar pacíficamente reduciendo el estrés ordinario mundano.",
    intermediate: "El cosmograma personal o representación fiel matemática de la mente de un iniciado buscador del Sí Mismo interior profundo uniendo reinos celestes con terrestres bajo orden geométrico sagrado.",
    advanced: "Forjar tu propio mándala existencial diario ritual dibujando los tránsitos y deidades planetarias en tu bitácora de vigilias teúrgicas para ordenar las fuerzas dispersas de tu subconsciente sutil nocturno."
  },
  {
    id: "espejo_alicia",
    category: "adicionales",
    name: "Espejo de Alicia",
    emoji: "🪞",
    association: "Umbral Especular de la Luz / Inversión de Iniciados",
    beginner: "El umbral de reflexión de cristal por el cual cruzas para ver realidades invertidas contrarias donde lo negro brilla de plata y las sombras cantan himnos sagrados sagrados.",
    intermediate: "Simbología de las paradojas herméticas supremas de la ley de Polaridad del Kybalión. Ilustra la inversión mágica pura que ocurre al cruzar el velo de tus sentidos corporales biológicos mundanos ordinarios.",
    advanced: "Meditación teúrgica frente al espejo negro o espejo consagrado de Isis. El mago aprende a fijar de forma imperturbada su mirada profunda en el cristal sin parpadear, cruzando el reflejo físico para penetrar el plano astral."
  }
];
