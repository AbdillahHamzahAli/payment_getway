import { Order } from "@prisma/client";

export type CreateOrderRequest = {
  userId: string;
  productId: string;
  quantity: number;
};

export type OrderResponse = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  amount: number;
};

export function toOrderResponse(order: Order): OrderResponse {
  return {
    id: order.id,
    productId: order.productId,
    productName: order.productName,
    quantity: order.quantity,
    amount: order.amount,
  };
}
