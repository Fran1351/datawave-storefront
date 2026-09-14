export interface Product {
  id: number | string;
  name: string;
  description?: string;
  price: number | string;
  numericPrice?: number;
  image?: string;
  imageUrl?: string;
  category?: string | { name: string }; // <--- Permite string u objeto
  stock?: number;
}