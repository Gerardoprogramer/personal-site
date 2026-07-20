export const ArchDiagram = () => {
    const nodes = [
        { x: 80, y: 90, label: "POS", delay: 0.2 },
        { x: 320, y: 90, label: "STOCK", delay: 0.35 },
        { x: 80, y: 310, label: "ORD", delay: 0.5 },
        { x: 320, y: 310, label: "EMP", delay: 0.65 },
        { x: 200, y: 40, label: "WS", delay: 0.15 },
        { x: 200, y: 360, label: "DB", delay: 0.8 },
    ];

    return (
        <div
            className="surface-card blueprint-grid relative aspect-square w-full overflow-hidden p-6"
            aria-hidden="true"
        >
            <div className="absolute left-3 top-3 h-3 w-3 border-l border-t border-primary/60" />
            <div className="absolute right-3 top-3 h-3 w-3 border-r border-t border-primary/60" />
            <div className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-primary/60" />
            <div className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-primary/60" />

            <div className="absolute left-6 top-6 flex items-center gap-1.5 font-mono-tech text-[10px] uppercase tracking-widest text-primary">
                <span className="inline-block size-1 rounded-full bg-primary" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
                fig.01 — erp
            </div>

            <svg
                viewBox="0 0 400 400"
                className="absolute inset-0 h-full w-full"
                role="img"
                aria-label="Diagrama de arquitectura hexagonal del ERP"
            >
                <g
                    stroke="var(--color-primary)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    fill="none"
                    opacity="0.6"
                    style={{
                        strokeDashoffset: 400,
                        animation: "dash-draw 1.8s ease-out 0.4s forwards",
                    }}
                >
                    <line x1="80" y1="90" x2="200" y2="200" />
                    <line x1="320" y1="90" x2="200" y2="200" />
                    <line x1="80" y1="310" x2="200" y2="200" />
                    <line x1="320" y1="310" x2="200" y2="200" />
                    <line x1="200" y1="60" x2="200" y2="200" />
                    <line x1="200" y1="340" x2="200" y2="200" />
                </g>

                <g fill="var(--color-primary)" style={{ animation: "node-in 0.4s ease-out 2.2s both" }}>
                    {nodes.map((n, i) => (
                        <circle key={n.label} r="2.5" opacity="0">
                            <animateMotion
                                path={`M${n.x},${n.y} L200,200`}
                                dur="2.4s"
                                begin={`${2.4 + i * 0.35}s`}
                                repeatCount="indefinite"
                                calcMode="spline"
                                keySplines="0.4 0 0.2 1"
                            />
                            <animate
                                attributeName="opacity"
                                values="0;1;1;0"
                                keyTimes="0;0.1;0.85;1"
                                dur="2.4s"
                                begin={`${2.4 + i * 0.35}s`}
                                repeatCount="indefinite"
                            />
                        </circle>
                    ))}
                </g>

                {nodes.map((n) => (
                    <g
                        key={n.label}
                        style={{
                            transformOrigin: `${n.x}px ${n.y}px`,
                            animation: `node-in 0.5s cubic-bezier(0.16,1,0.3,1) ${n.delay}s both`,
                        }}
                    >
                        <rect
                            x={n.x - 26}
                            y={n.y - 14}
                            width="52"
                            height="28"
                            rx="2"
                            fill="var(--color-surface-2)"
                            stroke="var(--color-border)"
                        />
                        <text
                            x={n.x}
                            y={n.y + 4}
                            textAnchor="middle"
                            fontSize="10"
                            fontFamily="JetBrains Mono, monospace"
                            fill="var(--color-muted-foreground)"
                        >
                            {n.label}
                        </text>
                    </g>
                ))}

                <g
                    style={{
                        transformOrigin: "200px 200px",
                        animation: "node-in 0.6s cubic-bezier(0.16,1,0.3,1) 0.9s both",
                    }}
                >
                    <polygon
                        points="200,140 260,175 260,225 200,260 140,225 140,175"
                        fill="oklch(0.85 0.16 195 / 0.08)"
                        stroke="var(--color-primary)"
                        strokeWidth="1.2"
                        style={{ filter: "drop-shadow(0 0 10px oklch(0.85 0.16 195 / 0.25))" }}
                    />
                    <text
                        x="200"
                        y="196"
                        textAnchor="middle"
                        fontSize="10"
                        fontFamily="JetBrains Mono, monospace"
                        fill="var(--color-primary)"
                        letterSpacing="1"
                    >
                        DOMAIN
                    </text>
                    <text
                        x="200"
                        y="212"
                        textAnchor="middle"
                        fontSize="8"
                        fontFamily="JetBrains Mono, monospace"
                        fill="var(--color-muted-foreground)"
                    >
                        reorder.algo
                    </text>
                </g>
            </svg>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between font-mono-tech text-[10px] uppercase text-muted-foreground">
                <span>ddd + hexagonal</span>
                <span className="text-primary">v2.4.1</span>
            </div>
        </div>
    )
}