import { NextFunction, Response } from "express";
import { TransacrionService } from "../service/transaction-service";
import { UserRequest } from "../type/user-request";
import { CreateTransaction } from "../model/transaction-model";
import { MidtransService } from "../service/midtrans-service";

export class TransactionController {
  static async createTransaction(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const request: CreateTransaction = req.body as CreateTransaction;
      request.userId = req.user!.id;

      const response = await TransacrionService.createTransaction(request);
      res.status(201).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async payment(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await MidtransService.createTransaction(
        req.body.TransactionId,
        req.body.amount,
        req.user!.id
      );

      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
