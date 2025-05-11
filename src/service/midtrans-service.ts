import axios from "axios";
import { createMidtransRequest } from "../config/midtrans";
import crypto from "crypto";
import { MYENV } from "../config/environment";
import { ResponseError } from "../error/response-error";
import { PaymentRepository } from "../repository/payment-repository";
import { OrderStatus } from "@prisma/client";
interface MidtransTransactionResponse {
  token: string;
  redirect_url: string;
}

export class MidtransService {
  static async createTransaction(
    orderId: string,
    grossAmount: number,
    userId: string
  ): Promise<MidtransTransactionResponse> {
    const request = await createMidtransRequest(orderId, grossAmount, userId);
    const response = await axios(request);

    return response.data;
  }

  static async handelCallback(data: any) {
    const trxId = data.order_id;
    const signatureKey = this.generateSignatureKey(
      data.order_id,
      data.gross_amount,
      MYENV.MIDTRANS_SERVER_KEY,
      data.status_code
    );

    if (signatureKey !== data.signature_key) {
      throw new ResponseError(400, "Invalid signature key");
    }

    console.log("data", data);

    const status = data.transaction_status as keyof typeof statusMap;
    const statusMap = {
      capture: data.fraud_status === "accept" ? OrderStatus.PAID : null,
      settlement: OrderStatus.PAID,
      cancel: OrderStatus.CANCELLED,
      deny: OrderStatus.CANCELLED,
      expire: OrderStatus.EXPIRED,
      pending: OrderStatus.PENDING,
    };

    const newStatus = statusMap[status];
    if (newStatus) {
      await PaymentRepository.updatePaymentStatus(trxId, newStatus);
    }
  }

  private static generateSignatureKey(
    orderId: string,
    grossAmount: number,
    serverKey: string,
    statusCode: number
  ): string {
    const stringToSign = `${orderId}${statusCode}${grossAmount}${serverKey}`;
    return crypto.createHash("sha512").update(stringToSign).digest("hex");
  }
}
