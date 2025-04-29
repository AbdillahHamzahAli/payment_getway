import { Transaction } from "@prisma/client";

export type CreateTransaction = {
  userId: string;
  orderId: string[];
  amount: number;
};

export type TransactionResponse = {
  id: string;
  transactionId: string;
  amount: number;
  status: string;
};

export function toTransactionResponse(trx: Transaction): TransactionResponse {
  return {
    id: trx.id,
    transactionId: trx.transactionId,
    amount: trx.amount,
    status: trx.status,
  };
}
