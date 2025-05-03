import { AxiosRequestConfig } from "axios";
import { MYENV } from "./environment";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

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

export async function createMidtransRequest(
  transactionId: string,
  amount: number,
  userId: string
) {
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  const data = {
    transaction_details: {
      order_id: transactionId,
      gross_amount: amount,
    },
    credit_card: { secure: true },
    customer_details: {
      email: user.email,
    },
  };
  options.data = data;

  return options;
}
