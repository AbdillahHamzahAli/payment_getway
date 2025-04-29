import { Transaction } from "@prisma/client";
import { prismaClient } from "../application/database";
import { CreateTransaction } from "../model/transaction-model";

export class TransactionRespository {
  static async createTransaction(
    data: CreateTransaction,
    trxId: string
  ): Promise<Transaction> {
    return await prismaClient.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          userId: data.userId,
          amount: data.amount,
          status: "PENDING",
          transactionId: trxId,
        },
      });

      const order = await tx.order.updateMany({
        where: {
          id: {
            in: data.orderId,
          },
          userId: data.userId,
        },
        data: {
          transactionId: transaction.id,
          status: "CHECKOUT",
        },
      });

      return transaction;
    });
  }
}
