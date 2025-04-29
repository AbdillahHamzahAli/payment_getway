import axios from "axios";
import { createMidtransRequest } from "../config/midtrans";
import { ResponseError } from "../error/response-error";

export class MidtransService {
  static async createTransaction(
    orderId: string,
    grossAmount: number,
    userId: string
  ) {
    try {
      const request = createMidtransRequest(orderId, grossAmount, userId);
      const response = await axios(request);
      return response.data;
    } catch (e) {
      throw new ResponseError(400, "Failed to create transaction");
    }
  }
}
