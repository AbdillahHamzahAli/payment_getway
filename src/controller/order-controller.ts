import { NextFunction, Response, Request } from "express";
import {
  CancelOrder,
  CreateOrder,
  CreateOrderItemRequest,
} from "../model/order-model";
import { OrderService } from "../service/order-service";
import { UserRequest } from "../type/user-request";
import { MidtransService } from "../service/midtrans-service";

export class OrderController {
  // =============== Order Item ====================
  static async createOrderItem(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const request: CreateOrderItemRequest =
        req.body as CreateOrderItemRequest;
      request.userId = req.user!.id;

      const response = await OrderService.createOrderItem(request);
      res.status(201).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async findUserOrderItems(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await OrderService.findOrderItem(req.user!.id);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async checkout(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateOrder = req.body as CreateOrder;
      request.userId = req.user!.id;
      const response = await OrderService.checkoutOrder(request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async cancelOrder(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const request: CancelOrder = {
        userId: req.user!.id,
        orderId: req.params.orderId,
      };
      const response = await OrderService.cancelOrder(request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async notifMidtrans(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await MidtransService.handelCallback(req.body);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
