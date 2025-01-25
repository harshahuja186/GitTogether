const logger = require("../config/logger");
const User = require("../models/user.model");

const profileController = {
  profileView: async (req, res) => {
    try {
      const user = req.user;

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
        message: err.message,
      });
    }
  },
  profileEdit: async (req, res) => {
    try {
      const data = req.body;
      const user = req.user;

      const ALLOWED_UPDATE_FIELDS = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
        "about",
        "skills",
      ];

      console.log(Object.keys(data));

      const isUpdateAlowed = Object.keys(data).every((key) =>
        ALLOWED_UPDATE_FIELDS.includes(key)
      );

      if (!isUpdateAlowed) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid update fields",
        });
      }

      const id = user.id;
      const result = await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
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
        message: err.message,
      });
    }
  },
  changePassword: async (req, res) => {
    try {
      const user = req.user;
      const { oldPassword, newPassword } = req.body;
      const id = user.id;

      const result = await User.findById(id);

      if (!result) {
        return res.status(404).json({
          status: "failed",
          message: "User not found",
        });
      }

      const passwordMatch = await result.comparePassword(oldPassword);

      if (!passwordMatch) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid old password",
        });
      }

      result.password = newPassword;
      await result.save();

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: err.message,
      });
    }
  },
};

module.exports = profileController;
