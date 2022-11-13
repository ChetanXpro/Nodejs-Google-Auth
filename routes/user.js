import express from "express";

import passport from "passport";
import {
  getAdminStats,
  getAdminUsers,
  logout,
  myProfile,
} from "../controllers/user.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/googleAuth",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

router.get(
  "/login",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URL,
  })
);
router.get("/me", isAuthenticated, myProfile);
router.get("/logout", logout);
router.get("/admin/users", isAuthenticated, isAdmin, getAdminUsers);
router.get("/admin/stats", isAuthenticated, isAdmin, getAdminStats);

export default router;
