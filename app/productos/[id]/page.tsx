
import { Metadata } from "next";
import Image from "next/image";
import { MOCK_PRODUCTS } from "@/app/data/products";
import { notFound } from "next/navigation";
import ProductActions from "@/app/productos/[id]/ProductActions";
import { Product } from "@/app/types/product";
interface Props {
  params: Promise<{ id: string }>;
}
export default async function ProductDetailPage({ params }: Props) {
  
  const { id } = await params;
  const rawProduct = MOCK_PRODUCTS.find((p: Product) => Number(p.id) === Number(id));

  if (!rawProduct) {
    notFound();
  }

  const fallbackImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e";

  // Normalizamos category UNA sola vez acá, en vez de repetir el check en el JSX
  const categoryName =
    typeof rawProduct.category === "object" && rawProduct.category !== null
      ? (rawProduct.category as { name: string }).name
      : rawProduct.category || "General";

  const product: Product = {
    id: rawProduct.id,
    name: rawProduct.name,
    price: rawProduct.price,
    image: rawProduct.image && rawProduct.image.trim() !== "" ? rawProduct.image : fallbackImage,
    category: categoryName,
    stock: rawProduct.stock ?? 10,
    description: rawProduct.description || "",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    category: categoryName,
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: Number(product.price),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `https://tu-dominio.com/productos/${product.id}`,
    },
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-36 pb-24 px-6 md:px-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="relative border border-blue-500/40 rounded-3xl aspect-[3/4] overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-10 z-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(6,182,212,0.4) 0px, transparent 1px, transparent 3px)",
            }}
          />
          <Image
            src={product.image}
            alt={`${product.name} - ${categoryName}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
            {categoryName}
          </span>
          <h1 className="text-4xl font-black mt-2">{product.name}</h1>

          <p className="text-2xl font-bold text-cyan-400 mt-4">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
              maximumFractionDigits: 0,
            }).format(Number(product.price))}
          </p>

          <p
            className={`text-sm mt-2 font-mono ${
              product.stock > 0 ? "text-emerald-400" : "text-red-500"
            }`}
          >
            {product.stock > 0
              ? product.stock <= 5
                ? `Últimas ${product.stock} unidades`
                : "En stock"
              : "Sin stock"}
          </p>

          <p className="text-zinc-400 mt-6 leading-relaxed">{product.description}</p>

          <div className="mt-8">
            <ProductActions product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}