import { Metadata } from "next";
import Image from "next/image";
import { products } from "@/app/data/products";
import { notFound } from "next/navigation";
import ProductActions from "@/app/productos/[id]/ProductActions";
import { Product } from "@/app/types/product";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id.toString() === id);

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
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image || product.image || "/placeholder.png" }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const rawProduct = products.find((p) => p.id.toString() === id);

  if (!rawProduct) {
    notFound();
  }

 const product: Product = {
  id: rawProduct.id,
  name: rawProduct.name,
  price: rawProduct.price,
  image: rawProduct.image || "/placeholder.png",
  imageUrl: rawProduct.image || "/placeholder.png",
  category: typeof rawProduct.category === "object" ? (rawProduct.category as any)?.name : rawProduct.category || "General",
  stock: rawProduct.stock ?? 10,
  description: rawProduct.description || "",
};

  const displayPrice =
    typeof product.price === "number" || !isNaN(Number(product.price))
      ? new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          maximumFractionDigits: 0,
        }).format(Number(product.price))
      : product.price;

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-36 pb-24 px-6 md:px-20">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="bg-white rounded-3xl p-8 relative aspect-square">
          <Image
            src={product.image || product.image || "/placeholder.png"}
            alt={product.name}
            fill
            priority
            className="object-contain p-8"
          />
        </div>

        <div>
  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
    {typeof product.category === "object" && product.category !== null
  ? (product.category as { name: string }).name
  : product.category || "General"}
  </span>
  <h1 className="text-4xl font-black mt-2">{product.name}</h1>
  <p className="text-3xl font-bold text-white mt-4">{displayPrice}</p>
  <p className="text-zinc-400 mt-6 leading-relaxed">{product.description}</p>

  <div className="mt-8">
    <ProductActions product={product} />
  </div>
</div>
        </div>
      
    </main>
  );
}