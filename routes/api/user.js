import express from "express";

import { getAllUsers, getUser } from "../../controllers/userController.js";
import { requestHandler } from "../../helpers/requestHelper.js";

const userRoutes = express.Router();

userRoutes.route("/").get(requestHandler(getAllUsers));
userRoutes.route("/:id").get(requestHandler(getUser));

export default userRoutes;
