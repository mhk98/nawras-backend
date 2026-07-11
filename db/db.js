const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 30000,
    },
    retry: {
      max: 1,
    },
    pool: {
      max: 3,
      min: 0,
      acquire: 30000,
      idle: 5000,
      evict: 5000,
    },
    logging: false,
    timezone: "+06:00",
    port: process.env.DB_PORT || 3306,
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error.message);
    console.error("DB_HOST:", process.env.DB_HOST || "NOT SET");
    console.error("DB_NAME:", process.env.DB_NAME || "NOT SET");
    console.error("DB_USER:", process.env.DB_USER || "NOT SET");
    console.error("DB_PORT:", process.env.DB_PORT || "NOT SET");
    process.exit(1);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
