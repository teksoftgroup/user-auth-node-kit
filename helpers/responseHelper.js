import { HTTP_STATUS } from "../constants.js";

export const ok = (res) => (data) => res.status(HTTP_STATUS.OK).json(data);
export const created = (res) => (data) =>
  res.status(HTTP_STATUS.CREATED).json(data);

export const noContent = (res) => (data) =>
  res.status(HTTP_STATUS.NO_CONTENT).json(data);

export const badRequest = (res) => (data) =>
  res.status(HTTP_STATUS.BAD_REQUEST).json(data);

export const unauthorized = (res) => (data) =>
  res.status(HTTP_STATUS.UNAUTHORIZED).json(data);

export const forbidden = (res) => (data) =>
  res.status(HTTP_STATUS.FORBIDDEN).json(data);

export const notFound = (res) => (data) =>
  res.status(HTTP_STATUS.NOT_FOUND).json(data);

export const conflict = (res) => (data) =>
  res.status(HTTP_STATUS.CONFLICT).json(data);

export const serverError = (res) => (data) =>
  res.status(HTTP_STATUS.SERVER_ERROR).json(data);

export const toJson = (res) => (httpStatus, data) =>
  res.status(httpStatus).json(data);

export const toHttpCookie =
  (res) =>
  (maxAge, data, name = "jwt", isHttps = false) => {
    res.cookie(name, data, {
      httpOnly: true,
      sameSite: "none",
      maxAge,
      secure: isHttps,
    });
  };

export const clearHttpCookie =
  (res) =>
  (maxAge, isHttps = false, name = "jwt") => {
    res.clearCookie(name, {
      httpOnly: true,
      sameSite: "none",
      secure: isHttps,
    });
  };

export const sendStatus = (res, status) => res.sendStatus(status);

export const sendUnauthorized = (res) =>
  sendStatus(res, HTTP_STATUS.UNAUTHORIZED);

export const sendForbidden = (res) => sendStatus(res, HTTP_STATUS.FORBIDDEN);

export const sendNoContent = (res) => sendStatus(res, HTTP_STATUS.NO_CONTENT);
