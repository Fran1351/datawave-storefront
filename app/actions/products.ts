"use server";

import { Product, products, MOCK_PRODUCTS } from "@/lib/products";

export { MOCK_PRODUCTS };

export async function getProducts(): Promise<{
  success: boolean;
  data: Product[];
  error: string | null;
}> {
  try {
    return {
      success: true,
      data: MOCK_PRODUCTS,
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      data: [],
      error: "Error al obtener productos.",
    };
  }
}