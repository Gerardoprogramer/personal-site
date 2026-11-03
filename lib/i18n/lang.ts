export type Language = "es" | "en";

export function toLanguage(value: string | null | undefined): Language {
  return value === "en" ? "en" : "es";
}
