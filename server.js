import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { corsOptions } from "./config/cors.config.js";
import { authRoutes, registerRoutes, userRoutes } from "./routes/root.js";
import { notFound } from "./helpers/responseHelper.js";
import { verifyJWT } from "./middleware/index.js";

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

app.use("/auth", authRoutes);
app.use("/register", registerRoutes);

// routes
app.use(verifyJWT);
app.use("/api/users", userRoutes);

app.all("*", (req, res) => {
  return notFound(res)({ message: "This is not a valid route" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
