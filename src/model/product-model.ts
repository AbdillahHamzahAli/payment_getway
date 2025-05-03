import { Product } from "@prisma/client";

export type CreateProductRequest = {
  name: string;
  price: number;
  stock: number;
};

export type UpdateProductRequest = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export type ProductResponse = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export type SearchProductRequest = {
  name?: string;
  page: number;
  size: number;
};

export function toProductResponse(product: Product): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    stock: product.stock,
  };
}
