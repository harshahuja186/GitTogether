const express = require("express");
const connectDB = require("./config/database");
const morganMiddleware = require("./middleware/morgan.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const cors = require("cors");

//handle cors error
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use(morganMiddleware);
app.use(express.json()); // Middleware to parse JSON payloads
app.use(cookieParser());

//routes
const authRoutes = require("./routes/auth.routes.js");
const profileRoutes = require("./routes/profile.route.js");
const requestRoutes = require("./routes/request.route.js");
const userRouter = require("./routes/user.router.js");

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/user", userRouter);

app.use("/api/health-check", (req, res) => {
  res.send("ok, it is working");
});

app.use("/health-check", (req, res) => {
  res.send("ok, it is working");
});

connectDB()
  .then(() => {
    app.listen(3001, () => {
      console.log("Server running on port 3001");
    });
  })
  .catch((err) => {
    console.log(err);
  });
