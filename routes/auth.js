import express from "express";
import {
  handleAuth,
  handleRefreshToken,
  handleLogout,
} from "../controllers/authController.js";

const authRoutes = express.Router();

authRoutes.route("/").post(handleAuth);
authRoutes.route("/logout").get(handleLogout);
authRoutes.route("/refresh").get(handleRefreshToken);

export default authRoutes;
