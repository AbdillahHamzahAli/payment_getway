import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { RoleMiddleware } from "../middleware/role-middleware";
import { ProductController } from "../controller/product-controller";
import { OrderController } from "../controller/order-controller";
import { TransactionController } from "../controller/transaction-controller";

export const apiRouter = express.Router();

apiRouter.use(authMiddleware);

apiRouter.post(
  "/api/products",
  RoleMiddleware(["ADMIN"]),
  ProductController.createProduct
);

apiRouter.post("/api/orders", OrderController.createOrder);
apiRouter.get("/api/orders", OrderController.findOrder);

apiRouter.post("/api/transactions", TransactionController.createTransaction);
apiRouter.post("/api/transactions/payment", TransactionController.payment);
