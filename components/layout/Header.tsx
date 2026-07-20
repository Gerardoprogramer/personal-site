'use client';

import { Logo } from '@/components/layout/header/Logo'
import { Nav } from '@/components/layout/header/Nav'
import { LanguageSwitcher } from '@/components/layout/header/LanguageSwitcher'
import { SocialLinks } from '@/components/layout/header/SocialLinks'
import { LocalClock } from '@/components/layout/header/LocalClock'
import { AvailabilityBadge } from '@/components/layout/header/AvailabilityBadge'
import { useRef } from "react";

export const Header = () => {
    const headerRef = useRef<HTMLElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = headerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        headerRef.current?.style.setProperty("--mx", `${x}%`);
        headerRef.current?.style.setProperty("--my", `${y}%`);
    };

    return (
        <header
            ref={headerRef}
            onMouseMove={handleMouseMove}
            className="group fixed top-0 left-0 right-0 z-50 overflow-hidden border-b border-border/60 bg-background/70 backdrop-blur-xl"
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), var(--color-primary), transparent 70%)",
                    opacity: 0.06,
                }}
            />
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
                <div className="flex items-center gap-6">
                    <Logo />
                    <Nav />
                </div>
                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <span className="hidden h-4 w-px bg-border sm:block" />
                    <SocialLinks />
                    <span className="hidden h-4 w-px bg-border md:block" />
                    <LocalClock />
                    <span className="hidden h-4 w-px bg-border md:block" />
                    <AvailabilityBadge />
                </div>
            </div>
        </header>
    )
}