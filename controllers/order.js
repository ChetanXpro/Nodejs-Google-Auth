import { asyncError } from "../middleware/errorMiddleware.js";
import { Order } from "../models/order.js";
import { Payment } from "../models/payment.js";
import { instance } from "../server.js";
import crypto from "crypto";

export const placeOrderOnline = asyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,

    itemsPrice,
    taxPrice,
    shippingCharges,
    totalPrice,
  } = req.body;

  const user = req.user._id;

  const orderOptons = {
    shippingInfo,
    orderItems,
    paymentMethod,

    itemsPrice,
    taxPrice,
    shippingCharges,
    totalPrice,
    user,
  };
  var options = {
    amount: Number(totalPrice * 100), // amount in the smallest currency unit
    currency: "INR",
    receipt: "Receipt_001",
  };
  const order = await instance.orders.create(options);

  await Order.create(orderOptons);

  res.status(201).json({
    success: true,
    order,
    orderOptons,
  });
});

export const paymentVerification = asyncError(async (req, res, next) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature_id,
    orderOptions,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    const payment = await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature_id,
      createdAt: Date.now(),
    });

    const order = await Order.create({
      ...orderOptions,
      user: req.user._id,
      paidAt: Date.now(),
      paymentInfo: payment._id,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      // paymentId: payment.id,
    });
  } else {
    return next(new Error("Payment failed"));
  }
});

export const placeOrder = asyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,

    itemsPrice,
    taxPrice,
    shippingCharges,
    totalPrice,
  } = req.body;

  const user = req.user._id;

  const orderOptons = {
    shippingInfo,
    orderItems,
    paymentMethod,

    itemsPrice,
    taxPrice,
    shippingCharges,
    totalPrice,
    user,
  };
  await Order.create(orderOptons);

  res.status(201).json({
    success: true,
    message: "Order placed successfully via Cash On Delivery",
  });
});

export const getMyOrders = asyncError(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id }).populate(
    "user",
    "name"
  );
  res.status(200).json({
    success: true,
    order,
  });
});

export const getOrderDetails = asyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) throw new Error("Invalid order id");
  const order = await Order.findById(id).populate("user", "name");

  if (!order) return next(new Error("Invalid order id"));

  res.status(200).json({
    success: true,
    order,
  });
});

export const getAdminOrders = asyncError(async (req, res, next) => {
  const order = await Order.find({}).populate("user", "name");

  res.status(200).json({
    success: true,
    order,
  });
});
export const processOrder = asyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) throw new Error("Invalid order id");

  const order = await Order.findById(id);

  if (order.orderStatus === "Preparing") order.orderStatus = "Shipped";
  else if (order.orderStatus === "Shipped") {
    order.orderStatus = "Delivered";
    order.delveredAt = Date.now();
  } else if (order.orderStatus === "Delivered") {
    throw new Error("Food already delivered");
  }
  await order.save();
  res.status(200).json({
    success: true,
    message: "Status updated successfully",
  });
});
