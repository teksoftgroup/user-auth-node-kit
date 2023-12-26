import { allowedOrigins } from "../constants.js";

export const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error(origin + " is not allowed by CORS"), false);
    }
  },
};
