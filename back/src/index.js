const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger/swagger.json");
const { log, utils } = require('./utils/utils')

const pool = require("./db/db");

const user = require('./controllers/user.controller');

const PORT = process.env.API_PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

// 미들웨어: 각 요청에 대해 페이지 제공
app.use(async (req, res, next) => {
  log(`Request URL: [${req.method}] ${req.originalUrl}`);
  if (!utils.isEmpty(req.query)) log(`Query Parameters: ${JSON.stringify(req.query)}`);
  if (!utils.isEmpty(req.params)) log(`Route Parameters: ${JSON.stringify(req.params)}`);
  if (!utils.isEmpty(req.body)) log(`Request Body: ${JSON.stringify(req.body)}`);

  // 요청에 대한 응답을 처리
  res.on("finish", () => {
    log(`Response Code: [${res.statusCode}]`);
  });

  next();
});

// Swagger 설정
app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// USER API 라우터
app.use("/user", user);

// DB 연결상태 확인
app.get("/health", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.query("SELECT 1");
    conn.release();
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});