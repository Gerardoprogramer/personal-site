import type { ProjectSlug } from "@/content/projects";
import type { Language } from "./context";

export interface ProjectContent {
  category: string;
  tagline: string;
  summary: string;
  headline: string;
  introduction: string;
  role: string;
  status: string;
  coverAlt: string;
  challenge: string;
  challengeBody: string;
  decisions: { title: string; body: string }[];
  evidence: { value: string; label: string }[];
  evidenceNote: string;
  scope: string;
  closing: string;
}

export const caseLabels = {
  es: {
    back: "Todos los proyectos",
    read: "Explorar el proyecto",
    demo: "Abrir demo",
    code: "Código",
    role: "Mi participación",
    context: "Contexto",
    status: "Estado",
    year: "Año",
    challenge: "El punto de partida",
    decisions: "Decisiones que dan forma al producto",
    evidence: "Implementación y verificación",
    stack: "Tecnologías",
    scope: "Alcance actual",
    next: "Siguiente proyecto",
    contact: "¿Construimos algo juntos?",
    contactAction: "Hablemos",
    screen: "Captura de la aplicación",
    inspect: "Ampliar captura",
    close: "Cerrar imagen",
    of: "de",
    selected: "Selección de proyectos",
    view: "Ver proyecto",
  },
  en: {
    back: "All projects",
    read: "Explore the project",
    demo: "Open demo",
    code: "Code",
    role: "My contribution",
    context: "Context",
    status: "Status",
    year: "Year",
    challenge: "The starting point",
    decisions: "Decisions that shape the product",
    evidence: "Implementation and verification",
    stack: "Technologies",
    scope: "Current scope",
    next: "Next project",
    contact: "Let’s build something together.",
    contactAction: "Get in touch",
    screen: "Application screenshot",
    inspect: "Enlarge screenshot",
    close: "Close image",
    of: "of",
    selected: "Selected projects",
    view: "View project",
  },
};

export const projectsContent: Record<
  Language,
  Record<ProjectSlug, ProjectContent>
> = {
  es: {
    "obsidian-library": {
      category: "Proyecto personal · Aplicación web",
      tagline: "Del catálogo al préstamo, con cada operación conectada.",
      summary:
        "Una biblioteca para lectores y administradores: catálogo, préstamos, reservas y membresías con pagos mediante Stripe.",
      headline: "Una biblioteca. Todo un producto detrás.",
      introduction:
        "Desarrollé Obsidian para conectar las dos caras de una biblioteca. El lector descubre libros, gestiona préstamos y reservas y mantiene su membresía. Desde el panel administrativo se organiza el catálogo y se atienden préstamos, multas y suscripciones. Una aplicación completa en Next.js y Spring Boot, publicada como demo.",
      role: "Desarrollo integral: interfaz del lector, panel administrativo, API, datos y pagos.",
      status: "Proyecto completado · Demo publicada",
      coverAlt:
        "Portada actual de Obsidian Library con el mensaje Una biblioteca que te acompaña y una vista ilustrativa de la plataforma",
      challenge: "Lo que ocurre entre un clic y una confirmación.",
      challengeBody:
        "Un libro puede estar prestado, reservado o disponible. Un pago puede seguir pendiente cuando el lector vuelve desde Stripe. El reto es coordinar esos estados y explicarlos en la interfaz, aplicando en el servidor las reglas de disponibilidad, membresías y pagos.",
      decisions: [
        {
          title: "Dos roles, una misma biblioteca",
          body: "El lector tiene su catálogo, préstamos, reservas, favoritos y reseñas. El panel administrativo reúne libros, géneros, usuarios, operaciones, multas y planes de membresía. Cada experiencia ofrece acciones distintas según los permisos de la cuenta y comparte las reglas del backend.",
        },
        {
          title: "Confirmar antes de activar",
          body: "La pantalla consulta el estado del backend y muestra la espera de confirmación. El servidor verifica la firma de los eventos de Stripe, reconoce entregas repetidas y evita que un evento tardío de fallo revierta un pago exitoso.",
        },
        {
          title: "Una cola que respeta la disponibilidad",
          body: "Las reservas avanzan según el orden de solicitud y los ejemplares libres. El lector dispone de 48 horas para recoger el libro. Al vencer ese plazo, el sistema puede dar paso a la siguiente reserva.",
        },
        {
          title: "Sesiones y red coordinadas",
          body: "Next.js actúa como BFF entre el navegador y Spring Boot. La autenticación combina cookies HTTP-only, protección CSRF y rotación de refresh tokens, mientras el cliente coordina renovaciones concurrentes. El proxy también gestiona los cold starts del backend mediante health checks y evita reintentar automáticamente operaciones que modifican estado.",
        },
        {
          title: "Reglas cerca de los datos",
          body: "Los préstamos validan límites de la membresía y disponibilidad. Las operaciones críticas utilizan transacciones y bloqueos. Flyway mantiene el historial del esquema y PostgreSQL añade restricciones de integridad.",
        },
      ],
      evidence: [
        { value: "92", label: "pruebas automatizadas entre frontend y backend" },
        { value: "48 h", label: "plazo de recogida de una reserva" },
        { value: "CI", label: "validación automatizada con GitHub Actions" },
      ],
      evidenceNote:
        "Suite documentada: 67 pruebas de backend, 18 pruebas unitarias de frontend y 7 recorridos de navegador con Playwright. Los recorridos autenticados de Playwright utilizan una API simulada para comprobar la interfaz y sus interacciones.",
      scope:
        "Proyecto personal completado y publicado como demo en la nube. Incluye la experiencia del lector y el panel administrativo, con catálogo, operaciones de préstamo y reserva, multas, planes, suscripciones y reembolsos. El frontend y el backend cuentan con pruebas automatizadas, CI y despliegues independientes.",
      closing:
        "Una interfaz clara necesita representar también las esperas, los vencimientos y las operaciones que requieren confirmación.",
    },
    "la-central": {
      category: "Desarrollo a medida · ERP + POS",
      tagline: "La operación de un minisúper, conectada de principio a fin.",
      summary:
        "Ventas, inventario, caja, compras y fiado en una instalación local compartida por varias cajas.",
      headline: "Software a la medida de un negocio real.",
      introduction:
        "Desarrollé La Central para reunir la operación de un minisúper en Costa Rica en un sistema adaptado a su forma de trabajar. Me encargué de la interfaz, el backend, la base de datos y el despliegue local, además de las herramientas de respaldo y recuperación.",
      role: "Desarrollo integral: interfaz, backend, datos, despliegue y respaldos.",
      status: "Desarrollo completado · Pendiente de puesta en marcha",
      coverAlt:
        "Punto de venta de La Central con una venta por gramos y precio automático por cartón de huevos",
      challenge: "Cada venta mueve más que el inventario.",
      challengeBody:
        "Un cobro puede combinar productos por peso, unidades, paquetes, efectivo y fiado. Afecta las existencias, la caja y la deuda del cliente, mientras otro cajero trabaja con los mismos datos. El sistema debe mantener esas operaciones coherentes, incluso ante reintentos y acciones simultáneas.",
      decisions: [
        {
          title: "Varias cajas, una misma operación",
          body: "Una PC principal ejecuta el servidor y la base de datos. Las demás cajas acceden desde el navegador por la red local. La operación diaria funciona sin Internet mientras la PC principal y la red estén disponibles.",
        },
        {
          title: "Reintentar sin duplicar",
          body: "Si se pierde la confirmación de un cobro, la interfaz conserva la clave de la operación. Al reintentar con los mismos datos, el servidor puede devolver la venta ya registrada. Las transacciones coordinan venta, inventario y caja.",
        },
        {
          title: "Vender como trabaja el minisúper",
          body: "Unidades y cartones comparten inventario; los productos por peso admiten captura de gramos. Los precios por presentación se aplican al total, y las ventas conservan descripciones, precios y factores de conversión históricos.",
        },
        {
          title: "Reponer con información y criterio",
          body: "Las sugerencias consideran ventas netas, mínimos, existencias disponibles y pedidos pendientes de todos los proveedores. El usuario puede aceptar parte de la propuesta y editar cantidades y costos antes de crear la orden.",
        },
        {
          title: "Preparar también la recuperación",
          body: "El despliegue incluye respaldos, restauración de comprobación en un contenedor independiente y controles de integridad. Las compras parciales, devoluciones y créditos a proveedores mantienen sus propios saldos e historial.",
        },
      ],
      evidence: [
        { value: "53", label: "pruebas documentadas" },
        { value: "4", label: "formatos de comprobante verificados en PDF" },
        { value: "LAN", label: "instalación compartida en la red del local" },
      ],
      evidenceNote:
        "Verificación del 14 al 16 de septiembre de 2026: 15 pruebas unitarias, 33 de integración y 5 recorridos de navegador aprobados. Durante varios días de operación simulada se corrigieron errores y se comprobaron de nuevo los flujos. También se documentó la recuperación de respaldos.",
      scope:
        "Desarrollo terminado y validado en pruebas. La puesta en marcha depende de adquirir y configurar los equipos del local, incluida la impresora. El sistema registra medios de pago; no procesa tarjetas ni SINPE. Los comprobantes no tienen conexión con Hacienda. Las capturas utilizan datos de demostración.",
      closing:
        "El trabajo abarca la venta que ve el cajero y los datos, las excepciones y la recuperación que sostienen la operación.",
    },
    selvatica: {
      category: "Proyecto personal · Experiencia web",
      tagline: "Una experiencia digital construida alrededor del paisaje.",
      summary:
        "Hospitalidad conceptual inspirada en Arenal: composición editorial, imágenes y movimiento que cambian con el dispositivo.",
      headline: "El paisaje marca el ritmo.",
      introduction:
        "Selvática explora cómo la tipografía, las imágenes y el movimiento pueden transmitir la identidad de un alojamiento conceptual. Una experiencia personal de diseño y desarrollo frontend inspirada en el bosque húmedo y el paisaje volcánico de Arenal, Costa Rica.",
      role: "Desarrollo frontend, composición visual e interacciones responsive.",
      status: "Proyecto completado · Demo publicada",
      coverAlt:
        "Portada de Selvática: tipografía de gran formato sobre un paisaje de bosque",
      challenge: "Transmitir un lugar a través de una pantalla.",
      challengeBody:
        "La propuesta alterna escenas inmersivas con espacios de lectura más pausados. La composición, las transiciones y la carga de imágenes debían acompañar ese ritmo y conservar una experiencia natural tanto con ratón como con pantalla táctil.",
      decisions: [
        {
          title: "Dos maneras de recorrer el paisaje",
          body: "En escritorio, una imagen permanece visible mientras avanza el relato y cambia con la experiencia activa. En móvil, la sección se convierte en una secuencia vertical de imágenes y textos adaptada a la lectura táctil.",
        },
        {
          title: "Movimiento con una función",
          body: "Las transiciones conectan imágenes, contenido y jerarquía. Motion respeta la preferencia de movimiento reducido. Las secciones estáticas e interactivas se componen con Server y Client Components de Next.js.",
        },
        {
          title: "Un archivo que se puede explorar",
          body: "La galería usa una composición asimétrica y un visor con dialog nativo. Admite navegación con flechas, cierre con Escape y devolución del foco al elemento que abrió la imagen.",
        },
        {
          title: "De la intención a la consulta",
          body: "Un panel accesible desde varias partes de la página reúne llegada, salida y huéspedes. Con esos datos prepara una consulta de disponibilidad que continúa por WhatsApp.",
        },
      ],
      evidence: [
        { value: "93", label: "rendimiento móvil documentado" },
        { value: "100", label: "accesibilidad en Lighthouse" },
        { value: "100", label: "buenas prácticas y SEO en Lighthouse" },
      ],
      evidenceNote:
        "Puntuaciones recogidas en el README del proyecto. El rendimiento depende de las condiciones de medición; el resultado automatizado de accesibilidad no sustituye la comprobación manual.",
      scope:
        "Proyecto conceptual publicado como demo. No representa un alojamiento ni un operador turístico real. El formulario prepara una consulta por WhatsApp; no confirma reservas ni procesa pagos.",
      closing:
        "El detalle está en cómo se relacionan las imágenes, la lectura y las interacciones a lo largo del recorrido.",
    },
  },
  en: {
    "obsidian-library": {
      category: "Personal project · Web application",
      tagline: "From the catalog to the loan, with every operation connected.",
      summary:
        "A library for readers and administrators: a catalog, loans, reservations and memberships with Stripe payments.",
      headline: "A library. A whole product behind it.",
      introduction:
        "I built Obsidian to connect both sides of a library. Readers discover books, manage loans and reservations, and maintain their memberships. The admin panel supports catalog management, loans, fines and subscriptions. A complete application built with Next.js and Spring Boot, published as a live demo.",
      role: "Complete development: reader interface, admin panel, API, data and payments.",
      status: "Project completed · Live demo",
      coverAlt:
        "Current Obsidian Library homepage with its Una biblioteca que te acompaña headline and an illustrative preview of the platform",
      challenge: "What happens between a click and a confirmation.",
      challengeBody:
        "A book can be on loan, reserved or available. A payment can still be pending when the reader returns from Stripe. The challenge is to coordinate those states and communicate them while the server enforces availability, membership and payment rules.",
      decisions: [
        {
          title: "Two roles, one library",
          body: "Readers have a catalog, loans, reservations, wishlists and reviews. The admin panel brings together books, genres, users, operations, fines and membership plans. Each experience offers actions based on account permissions and shares the rules enforced by the backend.",
        },
        {
          title: "Confirm before activating",
          body: "The payment screen checks the backend status and displays the confirmation wait. The server verifies Stripe signatures, recognizes repeated deliveries and prevents a late failure event from reversing a successful payment.",
        },
        {
          title: "A queue that respects availability",
          body: "Reservations advance in request order as copies become available. Readers have 48 hours to collect a book. Once that window expires, the system can advance the next reservation.",
        },
        {
          title: "Coordinated sessions and network",
          body: "Next.js acts as a BFF between the browser and Spring Boot. Authentication combines HTTP-only cookies, CSRF protection and refresh-token rotation, while the client coordinates concurrent session renewals. The proxy also handles backend cold starts through health checks without automatically retrying state-changing operations.",
        },
        {
          title: "Rules close to the data",
          body: "Loans validate membership limits and availability. Critical operations use transactions and locks. Flyway tracks schema changes, while PostgreSQL adds integrity constraints.",
        },
      ],
      evidence: [
        { value: "92", label: "automated tests across frontend and backend" },
        { value: "48 h", label: "reservation pickup window" },
        { value: "CI", label: "automated validation with GitHub Actions" },
      ],
      evidenceNote:
        "Documented suite: 67 backend tests, 18 frontend unit tests and 7 Playwright browser flows. The authenticated Playwright flows use a mocked API to check the interface and its interactions.",
      scope:
        "Completed personal project published as a cloud demo. It includes reader and admin interfaces, with a catalog, loan and reservation operations, fines, plans, subscriptions and refunds. Both frontend and backend include automated tests, CI and independent deployments.",
      closing:
        "A clear interface also needs to represent waiting, expiration and operations that require confirmation.",
    },
    "la-central": {
      category: "Custom software · ERP + POS",
      tagline: "The daily operation of a grocery store, connected end to end.",
      summary:
        "Sales, inventory, cash management, purchasing and customer credit in one local installation shared by multiple registers.",
      headline: "Software shaped around a real business.",
      introduction:
        "I developed La Central to bring the operations of a grocery store in Costa Rica into a system tailored to how it works. I built the interface, backend, database and local deployment, together with backup and recovery tools.",
      role: "Complete development: interface, backend, data, deployment and backups.",
      status: "Development completed · Awaiting installation",
      coverAlt:
        "La Central point of sale with a weighted product and automatic egg carton pricing",
      challenge: "Every sale affects more than inventory.",
      challengeBody:
        "A checkout can combine weighted products, units, packs, cash and customer credit. It affects stock, cash and the customer’s balance while another cashier works with the same data. Those operations need to remain consistent through retries and concurrent actions.",
      decisions: [
        {
          title: "Multiple registers, one operation",
          body: "A main PC runs the server and database. Other registers connect through a browser on the local network. Daily operation works without Internet as long as the main PC and network remain available.",
        },
        {
          title: "Retry without duplicating",
          body: "If a checkout confirmation is lost, the interface retains the operation key. A retry with the same data can return the sale already recorded. Transactions coordinate the sale, inventory and cash record.",
        },
        {
          title: "Sell the way the store works",
          body: "Individual units and cartons share inventory; weighted products support gram entry. Pack prices are applied to the total, and sales retain historical descriptions, prices and conversion factors.",
        },
        {
          title: "Restock with information and judgment",
          body: "Suggestions consider net sales, minimum stock, available inventory and outstanding orders from every supplier. Users can accept part of a proposal and edit quantities and costs before creating an order.",
        },
        {
          title: "Prepare for recovery too",
          body: "Deployment includes backups, restore checks in an independent container and integrity checks. Partial deliveries, returns and supplier credits maintain their own balances and history.",
        },
      ],
      evidence: [
        { value: "53", label: "documented tests" },
        { value: "4", label: "receipt formats verified as PDFs" },
        { value: "LAN", label: "shared installation on the store network" },
      ],
      evidenceNote:
        "September 14–16, 2026 verification: 15 unit tests, 33 integration tests and 5 browser journeys passed. Errors found during several days of simulated operation were corrected and the flows checked again. Backup recovery was also documented.",
      scope:
        "Development completed and validated in testing. Launch awaits purchase and configuration of the store’s equipment, including the printer. Payment methods are recorded; cards and SINPE are not processed. Receipts have no Hacienda integration. Screenshots use demonstration data.",
      closing:
        "The work covers the sale a cashier sees and the data, exceptions and recovery that support the operation.",
    },
    selvatica: {
      category: "Personal project · Web experience",
      tagline: "A digital experience built around the landscape.",
      summary:
        "A hospitality concept inspired by Arenal: editorial composition, imagery and motion adapted to each device.",
      headline: "The landscape sets the pace.",
      introduction:
        "Selvática explores how typography, imagery and motion can express the identity of a conceptual hospitality destination. A personal design and frontend project inspired by the rainforest and volcanic landscape of Arenal, Costa Rica.",
      role: "Frontend development, visual composition and responsive interactions.",
      status: "Project completed · Live demo",
      coverAlt:
        "Selvática homepage with large typography over a forest landscape",
      challenge: "Communicating a place through a screen.",
      challengeBody:
        "The experience alternates immersive scenes with quieter reading spaces. Composition, transitions and image loading needed to support that pace and feel natural with both a mouse and a touch screen.",
      decisions: [
        {
          title: "Two ways to explore the landscape",
          body: "On desktop, an image stays visible as the story progresses and changes with the active experience. On mobile, the section becomes a vertical sequence of images and text suited to touch-based reading.",
        },
        {
          title: "Motion with a purpose",
          body: "Transitions connect images, content and hierarchy. Motion respects the reduced-motion preference. Static and interactive sections use Next.js Server and Client Components.",
        },
        {
          title: "An archive to explore",
          body: "The gallery uses an asymmetric composition and a native dialog viewer. It supports arrow-key navigation, Escape to close and focus restoration to the element that opened the image.",
        },
        {
          title: "From interest to inquiry",
          body: "A panel available throughout the page collects arrival, departure and guest count. It uses those details to prepare an availability inquiry that continues through WhatsApp.",
        },
      ],
      evidence: [
        { value: "93", label: "documented mobile performance" },
        { value: "100", label: "Lighthouse accessibility" },
        { value: "100", label: "Lighthouse best practices and SEO" },
      ],
      evidenceNote:
        "Scores documented in the project README. Performance depends on measurement conditions; an automated accessibility score does not replace manual checks.",
      scope:
        "A conceptual project published as a demo. It does not represent a real accommodation or tourism operator. The form prepares a WhatsApp inquiry; it does not confirm reservations or process payments.",
      closing:
        "The detail lies in how imagery, reading and interaction work together throughout the experience.",
    },
  },
};
