import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { corsOptions } from "./config/cors.config.js";

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
