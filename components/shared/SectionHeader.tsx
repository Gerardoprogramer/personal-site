import type { ReactNode } from "react";

// Title sizes: "lg" for the main sections, "md" for the rest, and "md-fixed"
// when the "md" desktop size must also hold on mobile.
const TITLE_SIZES = {
  lg: "text-4xl sm:text-5xl",
  md: "text-3xl sm:text-4xl",
  "md-fixed": "text-4xl",
} as const;

interface Props {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  size?: keyof typeof TITLE_SIZES;
  align?: "left" | "center";
  // Tighter eyebrow-to-title gap (12px instead of 16px).
  compact?: boolean;
  className?: string;
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  size = "md",
  align = "left",
  compact = false,
  className,
}: Props) {
  const layout = align === "center" ? "mx-auto max-w-2xl text-center" : "";
  return (
    <div className={[layout, className].filter(Boolean).join(" ") || undefined}>
      <p className={`eyebrow ${compact ? "mb-3" : "mb-4"}`}>
        {index} / {eyebrow}
      </p>
      <h2 className={`font-display tracking-tight ${TITLE_SIZES[size]}`}>
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
