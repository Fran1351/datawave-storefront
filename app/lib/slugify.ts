
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // saca acentos (á, é, í, ó, ú, ñ queda como n)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // todo lo que no sea letra/número -> guion
    .replace(/^-+|-+$/g, ""); // saca guiones al principio/final
}