import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import {
  ok,
  toHttpCookie,
  unauthorized,
  sendForbidden,
  sendUnauthorized,
  sendNoContent,
} from "../helpers/responseHelper.js";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../config/server.config.js";
import { DAY } from "../constants.js";

export const handleAuth = async (req, res) => {
  const { username, password } = req.body;

  const userCreds = await User.getCredentials(username);

  if (!userCreds) {
    return unauthorized(res)({
      message: "Invalid username/password combination",
    });
  }

  const result = await handlePasswordMatch({
    username: username,
    roleId: userCreds.roleId,
    providedPassword: password,
    userPassword: userCreds.password,
  });

  if (result.isValid) {
    toHttpCookie(res)(1 * DAY, result.refreshToken);
    ok(res)({
      accessToken: result.accessToken,
    });
  } else {
    unauthorized(res)({ message: "Invalid username/password combination" });
  }
};

export const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return sendUnauthorized(res);
  }

  const refreshToken = cookies.jwt;
  const foundUser = await User.findByRefreshToken(refreshToken);
  if (!foundUser) return sendForbidden(res);

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return sendForbidden(res);
    }

    const accessToken = jwt.sign(
      {
        userInfo: {
          username: decoded.username,
          role: foundUser.roleId,
        },
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    ok(res)({ accessToken });
  });
};

export const handleLogout = async (req, res) => {
  // TODO: delete access token from the client side as well
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return sendNoContent(res);
  }

  const refreshToken = cookies.jwt;

  const foundUser = await User.findByRefreshToken(refreshToken);
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return sendNoContent(res);
  }

  await User.clearRefreshToken(foundUser.id);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  return sendNoContent(res);
};

const handlePasswordMatch = async (requestInfo) => {
  const match = await bcrypt.compare(
    requestInfo.providedPassword,
    requestInfo.userPassword
  );

  if (!match) {
    return {
      accessToken: "",
      refreshToken: "",
      isValid: false,
    };
  }

  //create JWT
  const accessToken = jwt.sign(
    {
      userInfo: {
        username: requestInfo.username,
        role: requestInfo.roleId,
      },
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m",
    }
  );

  const refreshToken = jwt.sign(
    { username: requestInfo.username },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  // save the refresh token of the user here
  await User.updateByUsername(requestInfo.username, { refreshToken });

  return {
    accessToken,
    refreshToken,
    isValid: true,
  };
};
