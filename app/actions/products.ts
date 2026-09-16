"use server";

import * as productData from "@/app/data/products";
import { Product } from "@/app/types/product";

const products = Object.values(productData).find(Array.isArray) as Product[] | undefined;

export async function getProducts(): Promise<Product[]> {
  // Aquí puedes conectar tu base de datos o lógica de persistencia
  return products ?? [];
}

export async function updateProductStock(productId: string, newStock: number): Promise<boolean> {
  try {
    // Lógica para actualizar stock en base de datos o almacenamiento
    console.log(`Actualizando stock del producto ${productId} a ${newStock}`);
    return true;
  } catch (error) {
    console.error("Error al actualizar el stock:", error);
    return false;
  }
}