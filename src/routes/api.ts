import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { RoleMiddleware } from "../middleware/role-middleware";
import { ProductController } from "../controller/product-controller";
import { OrderController } from "../controller/order-controller";

export const apiRouter = express.Router();

apiRouter.use(authMiddleware);

apiRouter.post(
  "/api/products",
  RoleMiddleware(["ADMIN"]),
  ProductController.createProduct
);

apiRouter.post("/api/orders", OrderController.createOrder);
