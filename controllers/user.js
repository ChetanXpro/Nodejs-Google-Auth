import { asyncError } from "../middleware/errorMiddleware.js";
import { User } from "../models/user.js";
import { Order } from "../models/order.js";
export const myProfile = (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid", {
      secure: process.env.NODE_ENV === "Development" ? false : true,
      httpOnly: process.env.NODE_ENV === "Development" ? false : true,
      sameSite: process.env.NODE_ENV === "Development" ? false : "none",
    });
    res.status(200).json({
      message: "Logged Out",
    });
  });
};
export const getAdminUsers = asyncError(async (req, res, next) => {
  const allUsers = await User.find({});

  res.status(200).json({
    success: true,
    allUsers,
  });
});

export const getAdminStats = asyncError(async (req, res, next) => {
  const userCount = await User.countDocuments();
  const orders = await Order.find({});

  const prepareingOrder = orders.filter(
    (order) => order.orderStatus === "Preparing"
  );
  const shippedOrder = orders.filter(
    (order) => order.orderStatus === "Shipped"
  );
  const deliveredOrder = orders.filter(
    (order) => order.orderStatus === "Delivered"
  );

  let totalIncome = 0;

  orders.forEach((i) => (totalIncome += i.totalPrice));

  res.status(200).json({
    success: true,
    userCount,
    ordersCount: {
      total: orders.length,
      preparing: prepareingOrder.length,
      shipped: shippedOrder.length,
      delivered: deliveredOrder.length,
    },
    totalIncome,
  });
});
