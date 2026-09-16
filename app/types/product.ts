export interface Product {
  id: number;
  name: string;
  title?: string;
  price: number;
  image: string;
  description?: string;
  stock: number;
  category?: string;
}