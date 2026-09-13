export interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  numericPrice?: number;
  image: string;
  imageUrl?: string;
  category?: string;
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}