import Image from "next/image";
import Link from "next/link";
import { products } from "@/app/data/products";

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between border border-gray-100 hover:shadow-lg transition-shadow duration-300"
        >
          <div>
            <div className="relative w-full h-48 bg-gray-100">
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                {product.category}
              </span>
              <h3 className="text-lg font-medium text-gray-900 mt-1 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-xl font-bold text-gray-900 mt-2">
                ${product.price}
              </p>
              <p className={`text-xs mt-1 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
              </p>
            </div>
          </div>
          
          <div className="p-4 pt-0">
            <Link 
              href={`/products/${product.id}`}
              className="w-full block text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Ver detalle
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}