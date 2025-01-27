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
  updateRequest: async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { requestId, status } = req.params;

      const isRequestExists = await connectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser?.id,
        status: "interested",
      });

      if (!isRequestExists) {
        return res.status(404).json({
          status: "failed",
          message: "Request not found",
        });
      }

      const request = await connectionRequestModel.findOneAndUpdate(
        { _id: requestId },
        { status },
        { new: true }
      );

      res.status(200).json({
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

  getAllRequest: async (req, res) => {
    try {
      //fetcing all the requests for the logged in user
      const loggedInUser = req.user;

      const requests = await connectionRequestModel
        .find({
          toUserId: loggedInUser.id,
          status: "interested",
        })
        .populate("fromUserId");

      if (!requests) {
        return res.status(404).json({
          status: "failed",
          message: "No requests found",
        });
      }

      res.status(200).json({
        status: "success",
        data: requests,
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: err.message,
      });
    }
  },
};

module.exports = requestController;
