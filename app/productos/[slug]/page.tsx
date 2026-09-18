import { Metadata } from "next";
import { MOCK_PRODUCTS } from "@/app/data/products";
import { notFound, redirect } from "next/navigation";
import ProductActions from "@/app/productos/[slug]/ProductActions";
import ProductGallery from "./ProductGallery";
import { Product } from "@/app/types/product";
import Breadcrumbs from "./Breadcrumbs";
import RelatedProducts from "@/app/productos/[slug]/RelatedProducts";
import { slugify } from "@/app/lib/slugify";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://datawave-storefront-fv8f.vercel.app";

interface Props {
  params: Promise<{ slug: string }>;
}

function findBySlug(slug: string) {
  return MOCK_PRODUCTS.find((p) => slugify(p.name) === slug);
}

// Pre-genera todas las páginas de producto en build time en vez de
// resolverlas en cada request.
export function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({
    slug: slugify(product.name),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = findBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado | DataWave",
    };
  }

  const formattedPrice =
    typeof product.price === "number" || !isNaN(Number(product.price))
      ? new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          maximumFractionDigits: 0,
        }).format(Number(product.price))
      : product.price;

  return {
    title: `${product.name} - ${formattedPrice} | DataWave`,
    description: product.description,
    alternates: {
      canonical: `/productos/${slugify(product.name)}`,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  // Compatibilidad con URLs viejas: si alguien entra con el id numérico
  // (ej. quedó guardado en un favorito, un mail viejo o Google todavía
  // no re-indexó), lo mandamos a la URL nueva con slug en vez de un 404.
  if (/^\d+$/.test(slug)) {
    const byId = MOCK_PRODUCTS.find((p) => Number(p.id) === Number(slug));
    if (byId) {
      redirect(`/productos/${slugify(byId.name)}`);
    }
    notFound();
  }

  const rawProduct = findBySlug(slug);

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

  const productSlug = slugify(product.name);

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
      url: `${SITE_URL}/productos/${productSlug}`,
    },
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-36 pb-24 px-6 md:px-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto">
        <Breadcrumbs category={categoryName} productName={product.name} />
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <ProductGallery images={[product.image]} productName={product.name} />

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

      <RelatedProducts currentId={Number(product.id)} category={categoryName} />
    </main>
  );
}