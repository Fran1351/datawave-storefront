export interface Product {
  id: string | number;
  name: string;
  price: number | string;
  numericPrice?: number;
  image?: string;
  imageUrl?: string;
  category?: string | { name: string };
  stock?: number;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}