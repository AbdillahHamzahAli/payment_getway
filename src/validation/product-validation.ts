import { z, ZodType } from "zod";

export class ProductValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1),
    price: z.number().positive(),
    stock: z.number().positive(),
  });
  static readonly SEARCH: ZodType = z.object({
    name: z.string().optional(),
    page: z.number().positive(),
    size: z.number().positive(),
  });
  static readonly GET: ZodType = z.object({
    id: z.string().uuid(),
  });
  static readonly UPDATE: ZodType = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    price: z.number().positive(),
    stock: z.number().positive(),
  });
  static readonly DELETE: ZodType = z.object({
    id: z.string().uuid(),
  });
}
