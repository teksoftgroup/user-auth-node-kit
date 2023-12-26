import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { corsOptions } from "./config/cors.config.js";

import { userRoutes } from "./routes/index.js";
import { notFound } from "./helpers/responseHelper.js";

// Instantiate express
const app = express();
const PORT = 8300;

// handle CORS in the request
app.use(cors(corsOptions));

// handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// handle json in the request
app.use(express.json());

// handle cookies in the request
app.use(cookieParser());

// routes
app.use("/api/users", userRoutes);

app.all("*", (req, res) => {
  return notFound(res)({ message: "This is not a valid route" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
