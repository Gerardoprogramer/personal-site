"use client";

import { useRef, useState } from "react";

import { Logo } from "@/components/layout/header/Logo";
import { Nav } from "@/components/layout/header/Nav";
import { LanguageSwitcher } from "@/components/layout/header/LanguageSwitcher";
import { SocialLinks } from "@/components/layout/header/SocialLinks";
import { LocalClock } from "@/components/layout/header/LocalClock";
import { MenuToggle } from "@/components/layout/header/MenuToggle";

import { useHeaderVisibility } from "@/hooks/useHeaderVisibility";

export const Header = () => {
    const headerRef = useRef<HTMLElement>(null);

    const { visible, show } = useHeaderVisibility({
        threshold: 12,
        topOffset: 96,
    });

    const [menuOpen, setMenuOpen] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = headerRef.current?.getBoundingClientRect();

        if (!rect) return;

        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        headerRef.current?.style.setProperty("--mx", `${x}%`);
        headerRef.current?.style.setProperty("--my", `${y}%`);
    };

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-[max(0.9rem,env(safe-area-inset-bottom))] top-auto z-50 flex justify-center md:bottom-auto md:top-4">
            <div
                data-visible={visible}
                className="relative translate-y-[calc(100%+1.5rem)] opacity-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100 md:-translate-y-[calc(100%+1.5rem)] md:data-[visible=true]:translate-y-0"
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-2 -z-10 rounded-full blur-2xl"
                    style={{
                        background: "var(--color-accent)",
                        opacity: 0.22,
                    }}
                />

                <header
                    ref={headerRef}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={show}
                    onFocusCapture={show}
                    data-open={menuOpen}
                    className="group pointer-events-auto relative w-[min(92vw,26rem)] overflow-hidden rounded-full border border-accent bg-surface-2/95 shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_24px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-[border-radius] duration-300 data-[open=true]:rounded-[1.75rem] md:w-auto"
                >
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                            background:
                                "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(138,39,64,0.4), transparent 70%)",
                        }}
                    />

                    <div className="relative flex h-12 items-center gap-3 px-4 md:h-14 md:gap-5 md:px-5">
                        <div className="hidden md:flex">
                            <Logo />
                        </div>

                        <div className="hidden md:flex">
                            <Nav />
                        </div>


                        <div className="flex min-w-0 flex-1 items-center gap-3 md:hidden">

                            <div className="min-w-0 flex-1">
                                <Nav compact />
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <MenuToggle
                                    open={menuOpen}
                                    onToggle={() => setMenuOpen((v) => !v)}
                                />
                            </div>
                        </div>

                        <div className="hidden items-center gap-4 md:flex">
                            <LanguageSwitcher />
                            <SocialLinks />
                            <LocalClock />
                        </div>
                    </div>

                    <div
                        id="mobile-menu"
                        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden"
                        style={{
                            gridTemplateRows: menuOpen ? "1fr" : "0fr",
                        }}
                    >
                        <div className="overflow-hidden">
                            <div className="flex flex-col gap-4 border-t border-border/60 px-5 pb-5 pt-3">
                                <div className="flex items-center justify-between gap-3 pt-1">
                                    <LanguageSwitcher />
                                    <SocialLinks />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        </div>
    );
};