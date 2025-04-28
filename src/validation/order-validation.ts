import { z, ZodType } from "zod";

export class OrderValidation {
  static readonly CREATE: ZodType = z.object({
    userId: z.string().min(1),
    productId: z.string().min(1),
    quantity: z.number().positive(),
  });
}
