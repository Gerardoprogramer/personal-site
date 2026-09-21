interface Props {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  index?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  index,
}: Props) {
  return (
    <div
      className={
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
      }
    >
      <p className="eyebrow mb-4">
        {index && `${index} / `}
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
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
