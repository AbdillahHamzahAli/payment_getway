import { Order, OrderItems } from "@prisma/client";

// =============== Order Item ===============
export type CreateOrderItemRequest = {
  userId: string;
  productId: string;
  quantity: number;
};

export type OrderItemResponse = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  status: string;
  amount: number;
};

export function toOrderItemResponse(order: OrderItems): OrderItemResponse {
  return {
    id: order.id,
    productId: order.productId,
    productName: order.productName,
    quantity: order.quantity,
    status: order.status,
    amount: order.amount,
  };
}

// =============== Order ===============

export type CreateOrder = {
  userId: string;
  orderItemsId: string[];
};

export type CancelOrder = {
  userId: string;
  orderId: string;
};

export type OrderResponse = {
  id: string;
  trxId: string;
  status: string;
  amount: number;
  orderItems: OrderItemResponse[];
};
