import { Order } from "@prisma/client";
import { CreateOrderRequest } from "../model/order-model";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class OrderRepository {
  static async createOrder(order: CreateOrderRequest): Promise<Order> {
    try {
      const product = await prismaClient.product.findUnique({
        where: { id: order.productId },
      });

      if (!product) {
        throw new ResponseError(401, "Product not found");
      }

      return await prismaClient.order.create({
        data: {
          userId: order.userId,
          productId: order.productId,
          quantity: order.quantity,
          amount: product?.price * order.quantity,
          productName: product?.name,
          status: "pending",
        },
      });
    } catch (error) {
      throw new Error("Error creating order");
    }
  }
}
