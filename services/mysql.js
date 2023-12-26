import mysql from "mysql2";

import {
  DB_SERVER,
  DB_USER,
  DB_PASS,
  DB_NAME,
  NODE_ENV,
} from "../config/server.config.js";

const db = mysql
  .createConnection({
    host: DB_SERVER,
    user: DB_USER,
    password: NODE_ENV == "development" ? undefined : DB_PASS,
    database: DB_NAME,
  })
  .promise();

db.on("error", (error) => {
  console.error("POOL CONNECTION ERRORED OUT because: ", error.code);
});

const pool = mysql
  .createPool({
    host: DB_SERVER,
    user: DB_USER,
    password: NODE_ENV == "development" ? undefined : DB_PASS,
    database: DB_NAME,
  })
  .promise();

export const database = { db, pool };
