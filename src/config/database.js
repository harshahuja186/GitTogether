const mongoose = require("mongoose");

async function connectDB() {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(`${MONGO_URI}`);
    console.log("Database connected successfully");
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectDB;
