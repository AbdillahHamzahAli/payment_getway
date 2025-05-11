import {
  CancelOrder,
  CreateOrder,
  CreateOrderItemRequest,
} from "../model/order-model";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  Order,
  OrderItems,
  OrderItemStatus,
  OrderStatus,
} from "@prisma/client";

export class OrderRepository {
  // =============== Order Item ===============
  static async createOrder(item: CreateOrderItemRequest): Promise<OrderItems> {
    try {
      const product = await prismaClient.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new ResponseError(401, "Product not found");
      }

      return await prismaClient.orderItems.create({
        data: {
          userId: item.userId,
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          status: OrderItemStatus.IN_CART,
          amount: product.price * item.quantity,
        },
      });
    } catch (error) {
      throw new Error("Error creating order");
    }
  }

  static async findOrderItem(userId: string): Promise<OrderItems[]> {
    return await prismaClient.orderItems.findMany({
      where: {
        userId,
      },
    });
  }
  // =============== Orders ===============
  static async createOrderToTransaction(
    data: CreateOrder,
    trxId: string
  ): Promise<Order> {
    return await prismaClient.$transaction(async (tx) => {
      const totalPrice = await this.getTotalPrice(data.orderItemsId);
      const transaction = await tx.order.create({
        data: {
          userId: data.userId,
          transactionId: trxId,
          status: OrderStatus.PENDING,
          amount: totalPrice,
        },
      });
      await tx.orderItems.updateMany({
        where: {
          userId: data.userId,
          id: {
            in: data.orderItemsId,
          },
        },
        data: {
          status: OrderItemStatus.PENDING,
          orderId: transaction.id,
        },
      });

      return transaction;
    });
  }

  private static async getTotalPrice(ids: string[]): Promise<number> {
    const orderItem = await prismaClient.orderItems.findMany({
      where: {
        id: {
          in: ids,
        },
        status: {
          in: [OrderItemStatus.IN_CART, OrderItemStatus.PENDING],
        },
      },
      select: {
        quantity: true,
        product: {
          select: {
            price: true,
          },
        },
      },
    });

    if (orderItem.length !== ids.length) {
      throw new ResponseError(404, "Order Item not found");
    }

    return orderItem.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);
  }

  static async markFailedOrder(
    orderId: string,
    itemsId: string[]
  ): Promise<Order> {
    return prismaClient.$transaction(async (tx) => {
      const transaction = await tx.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: OrderStatus.CANCELLED,
        },
      });

      await tx.orderItems.updateMany({
        where: {
          id: {
            in: itemsId,
          },
        },
        data: {
          status: OrderItemStatus.CANCELLED,
        },
      });
      return transaction;
    });
  }

  static async cancelOrder(
    data: CancelOrder
  ): Promise<{ transaction: Order; item: OrderItems[] }> {
    return prismaClient.$transaction(async (tx) => {
      const transaction = await tx.order.findUnique({
        where: {
          id: data.orderId,
          status: OrderStatus.PENDING,
        },
      });

      if (!transaction) {
        throw new ResponseError(404, "Order not found");
      }

      await tx.order.update({
        where: {
          id: data.orderId,
        },
        data: {
          status: OrderStatus.CANCELLED,
        },
      });

      await tx.orderItems.updateMany({
        where: {
          orderId: data.orderId,
          status: {
            in: [OrderItemStatus.PENDING, OrderItemStatus.CANCELLED],
          },
        },
        data: {
          status: OrderItemStatus.CANCELLED,
        },
      });

      const item = await tx.orderItems.findMany({
        where: {
          orderId: data.orderId,
        },
      });

      return { transaction, item };
    });
  }
}
