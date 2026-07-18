'use client';

import { socials } from "@/content/portfolio";
import { getProfile } from "@/content/profile";
import { useTranslation } from "@/lib/i18n/context";

export const FooterContact = () => {
    const { t, language } = useTranslation();
    const profile = getProfile(t);

    return (
        <div>
            <div className="font-mono-tech text-[10px] uppercase tracking-widest text-primary">
              // {t.footer.titleContact}
            </div>
            <ul className="mt-4 space-y-2 font-mono-tech text-xs text-muted-foreground">
                <li>
                    <a
                        href={socials.email}
                        className="transition-colors hover:text-primary"
                    >
                        {profile.email}
                    </a>
                </li>
                <li>
                    <a
                        href={socials.whatsapp}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="transition-colors hover:text-primary"
                    >
                        whatsapp →
                    </a>
                </li>
                <li>
                    <a
                        href={socials.cv}
                        download
                        className="transition-colors hover:text-primary"
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
                        className="transition-colors hover:text-primary text-left"
                    >
                        {language === "es" ? "preferencias de cookies" : "cookie preferences"}
                    </button>
                </li>
            </ul>
        </div>
    )
}
