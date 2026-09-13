import { Product } from "../types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "Funda para iPhone",
    price: "$25.000",
    numericPrice: 25000,
    category: "iPhone",
    image: "/products/funda.jpg",
    description: "Funda de silicona con MagSafe para máxima protección."
  },
  {
    id: "2",
    name: "AirPods Pro 2",
    price: "$350.000",
    numericPrice: 350000,
    category: "Audio",
    image: "/products/airpods.jpg",
    description: "Cancelación activa de ruido de nivel superior y audio espacial personalizado."
  },
  {
    id: "3",
    name: "Cargador MagSafe 20W",
    price: "$45.000",
    numericPrice: 45000,
    category: "Cargadores",
    image: "/products/cargador.jpg",
    description: "Carga inalámbrica rápida y alineación magnética perfecta para tu iPhone."
  },
  {
    id: "4",
    name: "Perfume Bleu de Chanel",
    price: "$210.000",
    numericPrice: 210000,
    category: "Perfumes",
    image: "/products/perfume.jpg",
    description: "Fragancia aromática e intensamente amaderada para un estilo sofisticado."
  }
];