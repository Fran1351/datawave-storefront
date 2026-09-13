import ProductCard from "./ProductCard";
import { products } from "../data/products";

export default function ProductGrid() {

  return (

    <section>

      <h2 className="text-4xl font-bold mb-10">
        Productos destacados
      </h2>

      <div className="grid md:grid-cols-4 gap-8">

        {products.map((product) => (

          <ProductCard
  key={product.id}
  id={product.id}
  name={product.name}
  price={product.price}
  image={product.image}
  stock={product.stock}
/>

        ))}

      </div>

    </section>

  );

}