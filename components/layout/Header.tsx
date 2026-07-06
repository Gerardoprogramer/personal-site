
import { Logo } from '@/components/layout/header/Logo'
import { Nav } from '@/components/layout/header/Nav'
import { LanguageSwitcher } from '@/components/layout/header/LanguageSwitcher'
import { SocialLinks } from '@/components/layout/header/SocialLinks'
import { LocalClock } from '@/components/layout/header/LocalClock'
import { AvailabilityBadge } from '@/components/layout/header/AvailabilityBadge'

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
                <Logo />
                <Nav />
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
