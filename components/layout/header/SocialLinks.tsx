"use client";

import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { socials } from "@/content/portfolio";
import { useTranslation } from "@/lib/i18n/context";

export function SocialLinks({ expanded = false }: { expanded?: boolean }) {
  const { t } = useTranslation();
  const links = [
    { name: "WhatsApp", href: socials.whatsapp, Icon: FaWhatsapp },
    { name: "GitHub", href: socials.github, Icon: FaGithub },
    { name: "LinkedIn", href: socials.linkedin, Icon: FaLinkedinIn },
  ];
  return (
    <nav
      aria-label={t.header.socialNav}
      className={
        expanded ? "social-links social-links-expanded" : "social-links"
      }
    >
      {links.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} · ${t.common.newTab}`}
          title={name}
          className={`social-link ${name === "WhatsApp" ? "social-link-whatsapp" : ""}`}
        >
          <Icon aria-hidden="true" className="size-4.5" />
          {expanded && <span>{name}</span>}
        </a>
      ))}
    </nav>
  );
}
