import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { conflict, serverError, created } from "../helpers/responseHelper.js";

export const registerUser = async (req, res) => {
  const { companyId, email, username, password, roleId } = req.body;

  const existingUser = await User.findByUsername(username);

  if (existingUser) {
    return conflict(res)({ message: "Username is not available" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      companyId,
      email,
      username,
      roleId: roleId ?? 1, //default to user role
      password: hashedPassword,
    };

    await User.addOne(newUser);

    return created(res)({
      message: `New user ${username} created successfully`,
    });
  } catch (error) {
    return serverError(res)({ message: "SERVER " + error.message });
  }
};
