import express, { urlencoded } from "express";
import dotenv from "dotenv";
import connectPassport from "./utils/Provider.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import cors from "cors";

const app = express();

export default app;
dotenv.config({
  path: "./config/config.env",
});
app.use(express.json());
app.use(cookieParser());
app.use(
  urlencoded({
    extended: true,
  })
);
app.enable("trust proxy");

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "Development" ? false : true,
      httpOnly: process.env.NODE_ENV === "Development" ? false : true,
      sameSite: process.env.NODE_ENV === "Development" ? false : "none",
    },
  })
);

app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
connectPassport();

import userRoute from "./routes/user.js";
import orderRoute from "./routes/order.js";

app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);

//Using error middleware

app.use(errorMiddleware);
