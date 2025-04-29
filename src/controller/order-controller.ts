import { NextFunction, Response } from "express";
import { CreateOrderRequest } from "../model/order-model";
import { OrderService } from "../service/order-service";
import { UserRequest } from "../type/user-request";

export class OrderController {
  static async createOrder(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const request: CreateOrderRequest = req.body as CreateOrderRequest;
      request.userId = req.user!.id;

      const response = await OrderService.createOrder(request);
      res.status(201).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async findOrder(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await OrderService.findOrder(req.user!.id);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
