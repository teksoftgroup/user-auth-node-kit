import "dotenv/config";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../constants.js";
import { ACCESS_TOKEN_SECRET } from "../config/server.config.js";

// verifying JWT using the bearer token method
export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer "))
    return res.sendStatus(HTTP_STATUS.UNAUTHORIZED);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.sendStatus(HTTP_STATUS.FORBIDDEN);
    }
    req.user = decoded.userInfo.username;
    req.role = decoded.userInfo.role;
    next();
  });
};
