import { serverError } from "./responseHelper.js";

export const requestHandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    const errorMessage = `ERR::Request failed: ${error}`;
    return serverError(res)(errorMessage);
  }
};
