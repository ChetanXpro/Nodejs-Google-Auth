import mongoose from "mongoose";

const schema = new mongoose.Schema({
  shippingInfo: {
    hNo: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
  },
  orderItems: {
    cheeseBurger: {
      price: {
        type: Number,
        require: true,
      },
      quantity: {
        type: Number,
        require: true,
      },
    },
    vegCheeseBurger: {
      price: {
        type: Number,
        require: true,
      },
      quantity: {
        type: Number,
        require: true,
      },
    },
    burgerWithFries: {
      price: {
        type: Number,
        require: true,
      },
      quantity: {
        type: Number,
        require: true,
      },
    },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  paymentMethod: {
    type: "String",
    enum: ["COD", "Online"],
    default: "COD",
  },
  paymentInfo: {
    type: mongoose.Schema.ObjectId,
    ref: "Payment",
  },
  paidAt: Date,
  itemsPrice: {
    type: Number,
    default: 0,
  },
  taxPrice: {
    type: Number,
    default: 0,
  },
  shippingCharges: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  orderStatus: {
    type: String,
    enum: ["Preparing", "Shipped", "Delivered"],
    default: "Preparing",
  },
  delveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("Order", schema);
