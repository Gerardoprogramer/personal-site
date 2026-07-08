import { ProjectView as Project } from "@/content/ProjectView"

export const ContextTag = ({ context }: { context: Project["context"] }) => {
  const map = {
    freelance: "// freelance",
    profesional: "// profesional",
    personal: "// personal",
  } as const;
  
  return (
    <span className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
      {map[context]}
    </span>
  );
}
