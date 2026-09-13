export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Auriculares Inalámbricos Noise-Cancelling",
    price: 129.99,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
  },
  {
    id: "2",
    name: "Teclado Mecánico RGB Switches Red",
    price: 89.50,
    category: "Periféricos",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
  },
  {
    id: "3",
    name: "Monitor Gaming 27\" 144Hz IPS",
    price: 249.00,
    category: "Monitores",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80",
  },
  {
    id: "4",
    name: "Mouse Ergonómico Inalámbrico",
    price: 45.00,
    category: "Periféricos",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
  },
];