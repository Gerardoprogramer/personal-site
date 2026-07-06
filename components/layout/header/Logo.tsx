import { profile } from '@/content/portfolio'

export const Logo = () => {
    return (
        <a
            href="#top"
            className="font-display text-sm font-semibold tracking-tight"
            aria-label={`${profile.name} — inicio`}
        >
            gerardo<span className="text-primary">.mm</span>
        </a>
    )
}
