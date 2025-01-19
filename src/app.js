const express = require("express");
const connectDB = require("./config/database");
const morganMiddleware = require("./middleware/morgan.js");
require("dotenv").config();
const app = express();

app.use(morganMiddleware);
app.use(express.json()); // Middleware to parse JSON payloads

//routes
const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
