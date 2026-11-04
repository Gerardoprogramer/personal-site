'use client';

import { useTranslation } from "@/lib/i18n/context";


export const FooterBottomBar = () => {
    const { t } = useTranslation();
    return (
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 font-mono-tech text-xs uppercase tracking-[0.08em] text-muted-foreground sm:flex-row sm:items-center">
            <span>© {new Date().getFullYear()} · {t.footer.builtWith}</span>
            <span className="text-primary/70">status: {t.footer.status}</span>
        </div>
    )
}
