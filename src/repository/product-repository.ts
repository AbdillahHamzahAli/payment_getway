import { Product } from "@prisma/client";
import { prismaClient } from "../application/database";
import { CreateProductRequest } from "../model/product-model";

export class ProductRepository {
  static async createProduct(product: CreateProductRequest): Promise<Product> {
    const newProduct = await prismaClient.product.create({
      data: product,
    });
    return newProduct;
  }

  static async getProductById(id: string): Promise<Product | null> {
    const product = await prismaClient.product.findUnique({
      where: { id },
    });
    return product;
  }

  static async searchProduct(
    name: string,
    skip: number,
    take: number
  ): Promise<Product[]> {
    const products = await prismaClient.product.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      skip,
      take,
    });
    return products;
  }
  static async countProduct(name: string): Promise<number> {
    const count = await prismaClient.product.count({
      where: {
        name: {
          contains: name,
        },
      },
    });
    return count;
  }
}
