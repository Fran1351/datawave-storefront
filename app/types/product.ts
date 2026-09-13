export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number;
  numericPrice?: number;
  image?: string;
  imageUrl?: string;
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}