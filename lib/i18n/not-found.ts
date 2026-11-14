import type { Language } from "./lang";

// Copy of the 404 pages under app/[lang] and app/global-not-found. The legacy
// app/(legacy)/not-found.tsx keeps its own copy until stage 3 removes it.
export const notFoundCopy: Record<
  Language,
  {
    title: string;
    description: string;
    heading: string;
    body: string;
    home: string;
    projects: string;
  }
> = {
  es: {
    title: "Página no encontrada",
    description: "La página que buscas no existe o cambió de dirección.",
    heading: "Esta página no existe.",
    body: "Puede que el enlace esté mal escrito o que la página haya cambiado de dirección.",
    home: "Volver al inicio",
    projects: "Ver proyectos",
  },
  en: {
    title: "Page not found",
    description: "The page you are looking for does not exist or has moved.",
    heading: "This page does not exist.",
    body: "The link may be mistyped, or the page may have moved.",
    home: "Back to home",
    projects: "View projects",
  },
};
