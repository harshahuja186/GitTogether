const logger = require("../config/logger");
const User = require("../models/user.model");

const profileController = {
  profileView: (req, res) => {
    res.send("profile view");
  },
  profileEdit: (req, res) => {
    res.send("profile edit");
  },
  changePassword: (req, res) => {
    res.send("change password");
  },
};

module.exports = profileController;
