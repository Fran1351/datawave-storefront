import { MOCK_PRODUCTS } from "@/app/data/products";
import { slugify } from "@/app/lib/slugify";

const seen = new Map<string, string>();
for (const p of MOCK_PRODUCTS) {
  const slug = slugify(p.name);
  if (seen.has(slug)) {
    throw new Error(
      `Slug duplicado: "${slug}" generado por "${p.name}" y "${seen.get(slug)}"`
    );
  }
  seen.set(slug, p.name);
}