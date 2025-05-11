import { OrderStatus, Payment } from "@prisma/client";
import { CreatePayment } from "../model/payment-model";
import { prismaClient } from "../application/database";

export class PaymentRepository {
  static async createPayment(data: CreatePayment): Promise<Payment> {
    return await prismaClient.payment.create({
      data: {
        ...data,
        status: OrderStatus.PENDING,
      },
    });
  }

  static async updatePaymentStatus(
    trxId: string,
    status: OrderStatus
  ): Promise<Payment> {
    if (status == OrderStatus.PAID || status == OrderStatus.CANCELLED) {
      await prismaClient.order.update({
        where: {
          transactionId: trxId,
        },
        data: {
          status: status,
          orderItems: {
            updateMany: {
              where: {
                status: OrderStatus.PENDING,
              },
              data: {
                status: status,
              },
            },
          },
        },
      });
    }
    return await prismaClient.payment.update({
      where: {
        transactionId: trxId,
      },
      data: {
        status,
      },
    });
  }
}
