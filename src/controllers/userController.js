const logger = require("../config/logger");
const User = require("../models/user");

const userController = {
  signup: async (req, res) => {
    try {
      const { firstName, lastName, email, password, ...others } = req.body;
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          status: "failed",
          message: "Required fields are missing",
        });
      }

      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({
          status: "failed",
          error: "User already exists",
        });
      }

      const user = new User({
        firstName,
        lastName,
        email,
        password,
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

      if (!email || !password) {
        return res.status(400).json({
          status: "failed",
          message: "Required fields are missing",
        });
      }

      const user = await User.findOne({ email: email });
      if (user.password !== password) {
        return res.status(401).json({
          status: "failed",
          message: "Wrong password",
        });
      }

      res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error,
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

  updateUser: async (req, res) => {
    try {
      const { id, firstName, lastName, email, age, gender, password } =
        req.body;
      const result = await User.findByIdAndUpdate(
        id,
        {
          firstName,
          lastName,
          email,
          age,
          gender,
          password,
        },
        { new: true, upsert: true }
      );

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
