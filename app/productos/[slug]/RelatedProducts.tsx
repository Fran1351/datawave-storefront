import Link from "next/link";
import Image from "next/image";
import { MOCK_PRODUCTS } from "@/app/data/products";
import { formatPrice } from "@/lib/utils";

interface RelatedProductsProps {
  currentId: number;
  category: string;
}

export default function RelatedProducts({ currentId, category }: RelatedProductsProps) {
  const fallbackImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e";

  const related = MOCK_PRODUCTS.filter((p) => {
    const pCategory =
      typeof p.category === "object" && p.category !== null
        ? (p.category as { name: string }).name
        : p.category || "General";

    return Number(p.id) !== currentId && pCategory === category;
  }).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto mt-20">
      <h2 className="text-xl font-black uppercase tracking-wide mb-6">
        También te puede interesar
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((p) => {
          const image = p.image && p.image.trim() !== "" ? p.image : fallbackImage;

          return (
            <Link
              key={p.id}
              href={`/productos/${p.id}`}
              className="group block"
            >
              <div className="relative border border-blue-500/40 rounded-2xl aspect-[3/4] overflow-hidden mb-3">
                <Image
                  src={image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-sm font-bold line-clamp-2 group-hover:text-cyan-400 transition-colors">
                {p.name}
              </h3>
              <p className="text-sm font-mono text-cyan-400 mt-1">
                {formatPrice(Number(p.price))}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}