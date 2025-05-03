import { Product } from "@prisma/client";
import { prismaClient } from "../application/database";
import {
  CreateProductRequest,
  UpdateProductRequest,
} from "../model/product-model";
import { ResponseError } from "../error/response-error";

export class ProductRepository {
  static async createProduct(product: CreateProductRequest): Promise<Product> {
    const newProduct = await prismaClient.product.create({
      data: product,
    });
    return newProduct;
  }

  static async getProductById(id: string): Promise<Product> {
    const product = await prismaClient.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new ResponseError(404, "Product not found");
    }

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

  static async updateProduct(product: UpdateProductRequest): Promise<Product> {
    const prod = await prismaClient.product.count({
      where: {
        id: product.id,
      },
    });

    if (!prod) {
      throw new ResponseError(404, "Product not found");
    }

    const updatedProduct = await prismaClient.product.update({
      where: {
        id: product.id,
      },
      data: {
        name: product.name,
        price: product.price,
        stock: product.stock,
      },
    });

    return updatedProduct;
  }

  static async deleteProduct(id: string): Promise<void> {
    const prod = await prismaClient.product.count({
      where: {
        id,
      },
    });
    if (!prod) {
      throw new ResponseError(404, "Product not found");
    }

    await prismaClient.product.delete({
      where: {
        id,
      },
    });
  }
}
