import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { RoleMiddleware } from "../middleware/role-middleware";
import { ProductController } from "../controller/product-controller";
import { OrderController } from "../controller/order-controller";
// import { TransactionController } from "../controller/transaction-controller";

export const apiRouter = express.Router();

apiRouter.use(authMiddleware);

// Products
apiRouter.post(
  "/api/products",
  RoleMiddleware(["ADMIN"]),
  ProductController.createProduct
);
apiRouter.put(
  "/api/products/:id",
  RoleMiddleware(["ADMIN"]),
  ProductController.updateProduct
);

apiRouter.delete(
  "/api/products/:id",
  RoleMiddleware(["ADMIN"]),
  ProductController.deleteProduct
);

// Orders
apiRouter.post("/api/orders", OrderController.createOrderItem);
apiRouter.get("/api/orders", OrderController.findUserOrderItems);
apiRouter.post("/api/orders/checkout", OrderController.checkout);
apiRouter.delete("/api/orders/checkout/:orderId", OrderController.cancelOrder);

// apiRouter.post("/api/transactions", TransactionController.createTransaction);
// apiRouter.post("/api/transactions/payment", TransactionController.payment);
