const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          return false;
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
      default: "This is about me",
    },
    skills: {
      type: [String],
    },
    //   createdAt: {
    //     type: Date,
    //     default: Date.now,
    //   },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
