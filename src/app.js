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
const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);

connectDB()
  .then(() => {
    app.listen(3001, () => {
      console.log("Server running on port 3001");
    });
  })
  .catch((err) => {
    console.log(err);
  });
