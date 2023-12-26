import { User } from "../models/User.js";
import { ok } from "../helpers/responseHelper.js";

export const getAllUsers = async (req, res) => {
  const users = await User.findAll();
  if (users) {
    return ok(res)(users);
  }
  return ok(res)([]);
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne(id);

  if (user) {
    return ok(res)(user);
  }
  return ok(res)({});
};
