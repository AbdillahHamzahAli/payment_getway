import {
  CreateTransaction,
  toTransactionResponse,
  TransactionResponse,
} from "../model/transaction-model";
import { customAlphabet } from "nanoid";
import { MYENV } from "../config/environment";
import { TransactionRespository } from "../repository/transaction-repository";
import { Validation } from "../validation/validation";
import { TransactionValidation } from "../validation/transaction-validation";
import { OrderRepository } from "../repository/order-repository";
import { ProductRepository } from "../repository/product-repository";

export class TransacrionService {
  private static nanoid = customAlphabet(
    "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    10
  );
  private static async generateTransactionId(): Promise<string> {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = this.nanoid();
    return `${MYENV.TRX_IDENTITY}-${date}-${random}`;
  }

  static async createTransaction(
    data: CreateTransaction
  ): Promise<TransactionResponse> {
    const createRequest = Validation.validate(
      TransactionValidation.CREATE,
      data
    );
    const trxId = await this.generateTransactionId();

    let totalAmount = 0;
    for (const orderId of createRequest.orderId) {
      const order = await OrderRepository.findOrderById(orderId);
      const product = await ProductRepository.getProductById(order.productId);

      totalAmount += product.price * order.quantity;
    }

    createRequest.amount = totalAmount;

    const transaction = await TransactionRespository.createTransaction(
      createRequest,
      trxId
    );

    return toTransactionResponse(transaction);
  }
}
