import { profileStatic as profile } from '@/content/profile'

export const Logo = () => {
    return (
        <a
            href="#top"
            className="font-display text-sm font-semibold tracking-tight"
            aria-label={`${profile.name} — inicio`}
        >
            <svg
                width="160"
                height="32"
                viewBox="0 0 160 32"
                className="overflow-visible"
            >
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "var(--color-foreground)" }} />
                        <stop offset="100%" style={{ stopColor: "var(--color-primary)" }} />
                    </linearGradient>
                </defs>

                <g className="transition-transform duration-300 ease-out group-hover:rotate-3 group-hover:scale-105 origin-[16px_16px]">
                    <path
                        d="M16,3 L27.26,9.5 L27.26,22.5 L16,29 L4.74,22.5 L4.74,9.5 Z"
                        fill="none"
                        stroke="url(#logoGradient)"
                        strokeWidth={1.1}
                        strokeLinejoin="round"
                    />
                    <text
                        x="16"
                        y="21"
                        textAnchor="middle"
                        className="font-display text-[13px] font-bold"
                        style={{ fill: "url(#logoGradient)" }}
                    >
                        G
                    </text>
                </g>

                <text
                    x="42"
                    y="21"
                    className="font-display text-sm font-semibold tracking-tight"
                    style={{ fill: "var(--color-foreground)" }}
                >
                    gerardo
                </text>
                <text
                    x="90"
                    y="21"
                    className="font-display text-sm font-semibold tracking-tight"
                    style={{ fill: "var(--color-primary)" }}
                >
                    .mm
                </text>
            </svg>
        </a>
    )
}
