import { Order, OrderStatus } from "@prisma/client";
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
          status: OrderStatus.IN_CART,
        },
      });
    } catch (error) {
      throw new Error("Error creating order");
    }
  }

  static async findOrder(userId: string): Promise<Order[]> {
    return await prismaClient.order.findMany({
      where: {
        userId,
      },
    });
  }

  static async findOrderById(orderId: string): Promise<Order> {
    const order = await prismaClient.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new ResponseError(404, "Order not found");
    }

    return order;
  }
}
