import express from "express";
import { UserController } from "../controller/user-controller";
import { ProductController } from "../controller/product-controller";

export const publicRouter = express.Router();

publicRouter.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

publicRouter.post("/api/user", UserController.register);
publicRouter.post("/api/user/login", UserController.login);

publicRouter.get("/api/products", ProductController.searchProduct);
