import { z, ZodType } from "zod";

export class TransactionValidation {
  static readonly CREATE: ZodType = z.object({
    userId: z.string().uuid(),
    orderId: z.array(z.string().uuid()),
  });
}
