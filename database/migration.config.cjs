module.exports = {
    development: {
      username: process.env.DB_USER,
      password: null,
      database: process.env.DB_NAME,
      host: process.env.DB_SERVER,
      dialect: "mysql",
      migrationStorageTableName: "migrations",
    },
    test: {
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      host: process.env.DB_SERVER,
      dialect: "mysql",
      migrationStorageTableName: "migrations",
    },
    production: {
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      host: process.env.DB_SERVER,
      dialect: "mysql",
      migrationStorageTableName: "migrations",
    },
  };
  