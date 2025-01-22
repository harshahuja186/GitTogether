const logger = require("../config/logger");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {
  signup: async (req, res) => {
    try {
      const { firstName, lastName, email, password, ...others } = req.body;

      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        ...others,
      });

      const result = await user.save();

      res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      logger.error(err.message);
      res.status(400).json({
        status: "failed",
        error: err.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("Invalid Creadentials");
      }

      const passwordMatch = await bcrypt.compare(password, user?.password);

      if (!passwordMatch) {
        throw new Error("Invalid Creadentials");
      }

      //create jwt token
      const payload = {
        id: user._id,
        email: user.email,
      };
      const JWT_SECRET = process.env.JWT_SECRET;
      const token = await jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1d",
      });

      //add the token to the cookie and send the response back to user
      res.cookie(
        "token",
        token,
        {
          httpOnly: true,
        },
        { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) }
      );

      res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      logger.error(error.message);
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    }
  },
  logout: (req, res) => {
    const userObj = {
      firstName: "Harsh",
      lastname: "Ahuja",
      email: "F4t9o@example.com",
      age: 22,
      gender: "male",
      password: "123456",
      status: "logged out",
    };
    res.send(userObj);
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.body;
      const result = await User.findByIdAndDelete(id);

      if (!result) {
        return res.status(404).json({
          status: "failed",
          message: "User not found",
        });
      }

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: err,
      });
    }
  },
  profile: async (req, res) => {
    try {
      const { user } = req.body;

      const id = user.id;
      const result = await User.findById(id);

      if (!result) {
        return res.status(404).json({
          status: "failed",
          message: "User not found",
        });
      }

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: err,
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      const data = req.body;
      const userId = req.params.userId;

      const ALLOWED_UPDATE_FIELDS = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "password",
        "photoUrl",
        "about",
        "skills",
      ];

      const isUpdateAlowed = Object.keys(data).every((key) =>
        ALLOWED_UPDATE_FIELDS.includes(key)
      );

      if (!isUpdateAlowed) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid update fields",
        });
      }

      const result = await User.findByIdAndUpdate(userId, data, {
        new: true,
        upsert: true,
        revalidate: true,
      });

      if (!result) {
        return res.status(404).json({
          status: "failed",
          message: "User not found",
        });
      }

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: err,
      });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});

      if (users.length === 0) {
        return res.status(404).json({
          status: "failed",
          message: "No users found",
        });
      }

      res.status(200).json({
        status: "success",
        data: users,
        totalLogs: users.length,
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: err,
      });
    }
  },
};

module.exports = userController;
