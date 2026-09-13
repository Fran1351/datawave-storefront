import AnimatedProductCard from "@/app/components/AnimatedProductCard";
import { products } from "@/app/data/products";
import { Product } from "@/app/types/product";

interface ProductGridProps {
  onAddToCart?: (product: Product) => void;
}

export default function ProductGrid({ onAddToCart }: ProductGridProps) {
  const handleAddToCart = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      console.log("Producto añadido:", product.name);
    }
  };

  return (
    <section>
      <h2 className="text-4xl font-bold mb-10">
        Productos destacados
      </h2>

      <div className="grid md:grid-cols-4 gap-8">
        {products.map((product) => (
          <AnimatedProductCard
            key={product.id}
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              numericPrice: typeof product.price === "number" ? product.price : undefined,
              image: product.image || "/placeholder.png",
              category: product.category || "General",
              stock: product.stock,
              description: product.description || "",
            }}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  );
}