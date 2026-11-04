"use client";

import { socials } from "@/content/portfolio";
import { getProfile } from "@/content/profile";
import { useTranslation } from "@/lib/i18n/context";
import { FiArrowUpRight } from "react-icons/fi";

export const FooterContact = () => {
  const { t } = useTranslation();
  const profile = getProfile(t);

  return (
    <div>
      <div className="font-mono-tech text-xs uppercase tracking-[0.08em] text-primary">
        {t.footer.titleContact}
      </div>
      <ul className="mt-4 font-mono-tech text-xs text-muted-foreground md:space-y-2">
        <li>
          <a
            href={socials.email}
            className="inline-flex min-h-11 items-center transition-colors hover:text-accent md:min-h-0"
          >
            {profile.email}
          </a>
        </li>
        <li>
          <a
            href={socials.whatsapp}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`WhatsApp · ${t.common.newTab}`}
            className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-accent md:min-h-0"
          >
            WhatsApp
            <FiArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
          </a>
        </li>
        <li>
          <a
            href={socials.cv}
            download
            className="inline-flex min-h-11 items-center transition-colors hover:text-accent md:min-h-0"
          >
            {t.footer.descargar} cv (.pdf)
          </a>
        </li>
        <li>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("cookie-consent");
              window.location.reload();
            }}
            className="inline-flex min-h-11 items-center transition-colors hover:text-accent text-left md:min-h-0"
          >
            {t.common.cookiePreferences}
          </button>
        </li>
      </ul>
    </div>
  );
};
