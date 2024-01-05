import express from "express";
import { registerUser } from "../controllers/registerController.js";

const registerRoutes = express.Router();

registerRoutes.route("/").post(registerUser);

export default registerRoutes;
