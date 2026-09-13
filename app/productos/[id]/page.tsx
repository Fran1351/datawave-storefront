import { Metadata } from "next";
import Image from "next/image";
import { products } from "../../data/products";
import { notFound } from "next/navigation";
import ProductActions from "./ProductActions"; // Componente cliente para botón "Añadir"

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Producto no encontrado | DataWave",
    };
  }

  return {
    title: `${product.name} - ${product.price} | DataWave`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-36 pb-24 px-6 md:px-20">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="bg-white rounded-3xl p-8 relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            className="object-contain p-8"
          />
        </div>

        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
            {product.category}
          </span>
          <h1 className="text-4xl font-black mt-2">{product.name}</h1>
          <p className="text-3xl font-bold text-white mt-4">{product.price}</p>
          <p className="text-zinc-400 mt-6 leading-relaxed">{product.description}</p>

          <div className="mt-8">
            <ProductActions product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}