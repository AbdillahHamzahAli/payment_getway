import { AxiosRequestConfig } from "axios";
import { MYENV } from "./environment";

const key = Buffer.from(MYENV.MIDTRANS_SERVER_KEY).toString("base64");

const options: AxiosRequestConfig = {
  method: "POST",
  url: "https://app.sandbox.midtrans.com/snap/v1/transactions",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Basic ${key}`,
  },
  data: {},
};

export function createMidtransRequest(
  transactionId: string,
  amount: number,
  userId: string
) {
  const data = {
    transaction_details: {
      order_id: transactionId,
      gross_amount: amount,
    },
    credit_card: { secure: true },
    customer_details: {
      name: userId,
    },
  };
  options.data = data;

  return options;
}
