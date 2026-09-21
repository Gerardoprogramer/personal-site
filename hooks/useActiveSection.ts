"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SECTION_IDS = [
  "top",
  "proyectos",
  "experiencia",
  "sobre-mi",
  "stack",
  "servicios",
  "contacto",
];

export function useActiveSection() {
  const pathname = usePathname();
  const [active, setActive] = useState("top");

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = SECTION_IDS.map((id) =>
      document.getElementById(id),
    ).filter((section): section is HTMLElement => Boolean(section));
    const update = () => {
      const readingLine = window.innerHeight * 0.35;
      const current = sections.findLast(
        (section) => section.getBoundingClientRect().top <= readingLine,
      );
      setActive(current?.id ?? "top");
    };
    const observer = new IntersectionObserver(update, {
      rootMargin: "-35% 0px -64% 0px",
    });
    sections.forEach((section) => observer.observe(section));
    const frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  if (pathname.startsWith("/proyectos/")) return "proyectos";
  return pathname === "/" ? active : null;
}
