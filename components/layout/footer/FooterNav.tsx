'use client';

import Link from "next/link";
import { useNavLinks } from '@/hooks/use-nav-links';
import { useTranslation } from "@/lib/i18n/context";

export const FooterNav = () => {
    const { links } = useNavLinks();
    const { t } = useTranslation();

    return (
        <div>
            <div className="font-mono-tech text-xs uppercase tracking-[0.08em] text-primary">
                {t.footer.titleNav}
            </div>
            <ul className="mt-4 font-mono-tech text-xs lowercase text-muted-foreground md:space-y-2">
                {links.map((l) => (
                    <li key={l.id}>
                        <Link
                            href={l.href}
                            className="inline-flex min-h-11 items-center transition-colors hover:text-accent md:min-h-0"
                        >
                            {l.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
