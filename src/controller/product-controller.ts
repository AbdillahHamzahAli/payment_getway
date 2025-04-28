import { NextFunction, Request, Response } from "express";
import { CreateProductRequest } from "../model/product-model";
import { ProductService } from "../service/product-service";

export class ProductController {
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateProductRequest = req.body as CreateProductRequest;
      const response = await ProductService.createProduct(request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async searchProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const name = req.query.name as string;
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      const response = await ProductService.searchProduct({
        name,
        page,
        size,
      });

      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }
}
