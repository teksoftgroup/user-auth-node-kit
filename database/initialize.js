const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/migration.config.js")[env];

const sequelize = new Sequelize("", config.username, config.password, {
  dialect: config.dialect,
});

sequelize
  .query(`CREATE DATABASE IF NOT EXISTS ${config.database};`)
  .then((data) => {
    console.log(`Database ${config.database} was created successfully`);
  })
  .catch((err) => {
    console.error("Creation failed because ", err);
  });
