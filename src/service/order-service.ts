import {
  CreateOrderRequest,
  OrderResponse,
  toOrderResponse,
} from "../model/order-model";
import { OrderRepository } from "../repository/order-repository";
import { OrderValidation } from "../validation/order-validation";
import { Validation } from "../validation/validation";

export class OrderService {
  static async createOrder(
    request: CreateOrderRequest
  ): Promise<OrderResponse> {
    const orderRequest = Validation.validate(OrderValidation.CREATE, request);
    const order = await OrderRepository.createOrder(orderRequest);

    return toOrderResponse(order);
  }

  static async findOrder(userId: string): Promise<OrderResponse[]> {
    const orders = await OrderRepository.findOrder(userId);
    return orders.map((order) => toOrderResponse(order));
  }
}
