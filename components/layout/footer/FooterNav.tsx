'use client';

import { useNavLinks } from '@/hooks/use-nav-links';
import { useTranslation } from "@/lib/i18n/context";

export const FooterNav = () => {
    const links = useNavLinks();
    const { t } = useTranslation();

    return (
        <div>
            <div className="font-mono-tech text-[10px] uppercase tracking-widest text-primary">
              // {t.footer.titleNav}
            </div>
            <ul className="mt-4 space-y-2 font-mono-tech text-xs text-muted-foreground">
                {links.map((l) => (
                    <li key={l.href}>
                        <a
                            href={l.href}
                            className="transition-colors hover:text-primary"
                        >
                            {l.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
