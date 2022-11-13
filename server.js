import app from "./app.js";
import Razorpay from "razorpay";

const port = process.env.PORT || 8080;

import { connectDB } from "./config/Database.js";

connectDB();

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

app.get("/", (req, res, next) => {
  res.send("Working");
  next();
});

app.listen(port, () => {
  console.log(`Server running on Port ${port} In ${process.env.NODE_ENV} Mode`);
});
