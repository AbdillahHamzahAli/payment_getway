import { z, ZodType } from "zod";

export class OrderValidation {
  static readonly CREATE_ITEM: ZodType = z.object({
    userId: z.string().min(1),
    productId: z.string().min(1),
    quantity: z.number().positive(),
  });

  static readonly CREATE_ORDER: ZodType = z.object({
    userId: z.string().min(1),
    orderItemsId: z.array(z.string().uuid().min(1)),
  });
  static readonly CANCEL_ORDER: ZodType = z.object({
    userId: z.string().min(1),
    orderId: z.string().uuid().min(1),
  });
}
