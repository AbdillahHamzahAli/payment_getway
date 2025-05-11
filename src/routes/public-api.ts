import express from "express";
import { UserController } from "../controller/user-controller";
import { ProductController } from "../controller/product-controller";
import { OrderController } from "../controller/order-controller";

export const publicRouter = express.Router();

publicRouter.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

publicRouter.post("/api/user", UserController.register);
publicRouter.post("/api/user/login", UserController.login);

// Products
publicRouter.get("/api/products", ProductController.searchProduct);
publicRouter.get("/api/products/:id", ProductController.getProduct);

// Callback order
publicRouter.get("/api/orders/finish", (req, res) => {
  res.status(200).json({ data: req.body, message: "callback success" });
});

publicRouter.get("/api/orders/err", (req, res) => {
  res.status(200).json({ message: "callback error" });
});

// Webbhook
publicRouter.post("/api/webhook/midtrans", OrderController.notifMidtrans);
