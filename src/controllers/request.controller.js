const connectionRequestModel = require("../models/connectionRequest.model");
const User = require("../models/user.model");

const requestController = {
  createRequest: async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = user.id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      if (!status) {
        throw new Error("Status is required");
      }

      if (!fromUserId || !toUserId) {
        throw new Error("User id is required");
      }

      const request = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      await request.save();
      res.status(201).json({
        status: "success",
        data: request,
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: err.message,
      });
    }
  },
  getRequest: (req, res) => {
    res.send("get request");
  },
  updateRequest: (req, res) => {
    res.send("update request");
  },
  deleteRequest: (req, res) => {
    res.send("delete request");
  },
};

module.exports = requestController;
