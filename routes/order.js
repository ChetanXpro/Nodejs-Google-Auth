import express from "express";
import {
  getAdminOrders,
  getMyOrders,
  getOrderDetails,
  paymentVerification,
  placeOrder,
  placeOrderOnline,
  processOrder,
} from "../controllers/order.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/createorder", isAuthenticated, placeOrder);
router.post("/createorderonline", isAuthenticated, placeOrderOnline);
router.post("/paymentverification", isAuthenticated, paymentVerification);

router.get("/myorders", isAuthenticated, getMyOrders);

router.get("/order/:id", isAuthenticated, getOrderDetails);

// Admin Middleware

router.get("/admin/orders", isAuthenticated, isAdmin, getAdminOrders);
router.get("/admin/order/:id", isAuthenticated, isAdmin, processOrder);

export default router;
