import { Product } from "@/app/types/product";

export const products: Product[] = [
  {
    id: 1,
    name: "Producto 1",
    description: "Descripción del producto",
    price: 25000,
    numericPrice: 25000,
    image: "/images/producto1.png",
    category: "Categoría",
    stock: 10,
  },
  {
    id: 2,
    name: "Producto 2",
    description: "Descripción del producto",
    price: 350000,
    numericPrice: 350000,
    image: "/images/producto2.png",
    category: "Categoría",
    stock: 5,
  },
  {
    id: 3,
    name: "Producto 3",
    description: "Descripción del producto",
    price: 45000,
    numericPrice: 45000,
    image: "/images/producto3.png",
    category: "Categoría",
    stock: 8,
  },
  {
    id: 4,
    name: "Producto 4",
    description: "Descripción del producto",
    price: 210000,
    numericPrice: 210000,
    image: "/images/producto4.png",
    category: "Categoría",
    stock: 3,
  },
];