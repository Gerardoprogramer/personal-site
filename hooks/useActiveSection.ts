"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  SECTION_IDS,
  TOP_SECTION,
  getActiveSection,
  sectionPage,
} from "@/lib/sections";

export function useActiveSection() {
  const pathname = usePathname();
  const [active, setActive] = useState(TOP_SECTION);
  const onHome = sectionPage(pathname) === "home";

  useEffect(() => {
    if (!onHome) return;
    const sections = SECTION_IDS.map((id) =>
      document.getElementById(id),
    ).filter((section): section is HTMLElement => Boolean(section));
    const update = () => {
      const readingLine = window.innerHeight * 0.35;
      const current = sections.findLast(
        (section) => section.getBoundingClientRect().top <= readingLine,
      );
      setActive(current?.id ?? TOP_SECTION);
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
  }, [onHome]);

  return getActiveSection(pathname, active);
}
