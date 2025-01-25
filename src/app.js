const express = require("express");
const connectDB = require("./config/database");
const morganMiddleware = require("./middleware/morgan.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

app.use(morganMiddleware);
app.use(express.json()); // Middleware to parse JSON payloads
app.use(cookieParser());

//routes
const authRoutes = require("./routes/auth.routes.js");
const profileRoutes = require("./routes/profile.route.js");
const requestRoutes = require("./routes/request.route.js");

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/request", requestRoutes);

connectDB()
  .then(() => {
    app.listen(3001, () => {
      console.log("Server running on port 3001");
    });
  })
  .catch((err) => {
    console.log(err);
  });
