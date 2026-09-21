interface BackgroundLetterProps {
  letter: "G" | "E" | "R" | "A" | "D" | "O";
  side?: "left" | "right";
  position?: "center" | "top";
  size?: "large" | "compact";
}

export function BackgroundLetter({
  letter,
  side = "right",
  position = "center",
  size = "large",
}: BackgroundLetterProps) {
  return (
    <div
      aria-hidden="true"
      data-section-letter={letter}
      className="section-letter"
      data-side={side}
      data-position={position}
      data-size={size}
    >
      <span>{letter}</span>
    </div>
  );
}
