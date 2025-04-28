import { snap } from "../config/midtrans";

export class MidtransService {
  static async createTransaction(
    orderId: string,
    grossAmount: number,
    email: string
  ) {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        email: email,
      },
    };
    const transaction = await snap.createTransaction(parameter);
    return transaction;
  }
}
