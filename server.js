require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const db = require("./models");
const routes = require("./app/routes");

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = new Set(
  [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "https://alnawrasplus.com",
    "https://admin.alnawrasplus.com",
    ...(process.env.ALLOWED_ORIGINS || "").split(","),
  ]
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean),
);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/+$/, "");
      if (
        allowedOrigins.has(normalizedOrigin) ||
        /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(
          normalizedOrigin,
        )
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  }),
);
app.use(rateLimit({ windowMs: 60 * 1000, max: 300 }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ status: "success", message: "Nawras API server is running" });
});

app.get("/api/v1/health", async (req, res, next) => {
  try {
    await db.sequelize.query("SELECT 1");
    res.json({ status: "success", message: "API and database are reachable" });
  } catch (error) {
    next(error);
  }
});

app.use("/api/v1", routes);

app.use((req, res) => {
  res.status(404).json({ status: "error", message: "API not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    await db.ready;
    app.listen(PORT, () => {
      console.log(`Nawras API server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
