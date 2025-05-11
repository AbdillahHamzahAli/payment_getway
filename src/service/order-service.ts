import {
  CancelOrder,
  CreateOrder,
  CreateOrderItemRequest,
  OrderItemResponse,
  OrderResponse,
  toOrderItemResponse,
} from "../model/order-model";
import { OrderRepository } from "../repository/order-repository";
import { OrderValidation } from "../validation/order-validation";
import { Validation } from "../validation/validation";
import { customAlphabet } from "nanoid";
import { MYENV } from "../config/environment";
import { MidtransService } from "./midtrans-service";
import { PaymentRepository } from "../repository/payment-repository";
import { createParam } from "@prisma/client/runtime/library";
import { OrderStatus } from "@prisma/client";

export class OrderService {
  // =============== Order Item ====================
  static async createOrderItem(
    request: CreateOrderItemRequest
  ): Promise<OrderItemResponse> {
    const itemRequest = Validation.validate(
      OrderValidation.CREATE_ITEM,
      request
    );
    const item = await OrderRepository.createOrder(itemRequest);

    return toOrderItemResponse(item);
  }

  static async findOrderItem(userId: string): Promise<OrderItemResponse[]> {
    const items = await OrderRepository.findOrderItem(userId);
    return items.map((order) => toOrderItemResponse(order));
  }

  // =============== Order to Transaction ====================
  private static nanoid = customAlphabet(
    "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    10
  );

  private static async generateTransactionId(): Promise<string> {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = this.nanoid();
    return `${MYENV.TRX_IDENTITY}-${date}-${random}`;
  }

  static async checkoutOrder(request: CreateOrder): Promise<any> {
    const orderRequest = Validation.validate(
      OrderValidation.CREATE_ORDER,
      request
    );
    const trxId = await this.generateTransactionId();

    let order;
    try {
      order = await OrderRepository.createOrderToTransaction(
        orderRequest,
        trxId
      );

      const midtrans = await MidtransService.createTransaction(
        order.transactionId,
        order.amount,
        order.userId
      );

      await PaymentRepository.createPayment({
        orderId: order.id,
        transactionId: trxId,
        snapToken: midtrans.token,
        snapRedirectUrl: midtrans.redirect_url,
      });

      return {
        orderId: order.id,
        token: midtrans.token,
        redirect_url: midtrans.redirect_url,
      };
    } catch (e) {
      if (order) {
        await OrderRepository.markFailedOrder(
          order.id,
          orderRequest.orderItemsId
        );
      }
      throw e;
    }
  }

  static async cancelOrder(request: CancelOrder): Promise<OrderResponse> {
    const orderRequest = Validation.validate(
      OrderValidation.CANCEL_ORDER,
      request
    );

    const { transaction, item } = await OrderRepository.cancelOrder(
      orderRequest
    );

    return {
      id: transaction.id,
      trxId: transaction.transactionId,
      status: transaction.status,
      amount: transaction.amount,
      orderItems: item.map((order) => toOrderItemResponse(order)),
    };
  }
}
