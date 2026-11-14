// Stand-in for a project screenshot that has not been added yet. It is visible
// only in development, so a missing image never reaches production: there the
// slot renders nothing.
export function PendingImage({
  label,
  aspect = "16 / 10",
  className = "",
}: {
  label: string;
  aspect?: string;
  className?: string;
}) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div
      role="note"
      style={{ aspectRatio: aspect }}
      className={`flex w-full items-center justify-center rounded-lg border-2 border-dashed border-amber-400/70 bg-amber-400/5 p-6 text-center font-mono-tech text-sm text-amber-200 ${className}`}
    >
      [dev] Captura pendiente / Screenshot pending: {label}
    </div>
  );
}
