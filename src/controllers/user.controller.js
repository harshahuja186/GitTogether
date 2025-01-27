const ConnectionRequest = require("../models/connectionRequest.model");
const User = require("../models/user.model");
const logger = require("../config/logger");

const AllConnectionPopulatedList = "firstName lastName photoUrl";

const userController = {
  getAllRequests: async (req, res) => {
    try {
      const loggedInUser = req.user;

      const requests = await ConnectionRequest.find({
        toUserId: loggedInUser.id,
        status: "interested",
      }).populate("fromUserId", ["firstName", "lastName", "photoUrl"]);

      return res.status(200).json({
        status: "success",
        data: requests,
      });
    } catch (err) {
      logger.error(err.message);
      return res.status(500).json({
        status: "failed",
        message: err.message,
      });
    }
  },

  getAllConnections: async (req, res) => {
    try {
      const loggedInUser = req.user;

      const connections = await ConnectionRequest.find({
        $or: [
          { fromUserId: loggedInUser.id, status: "accepted" },
          { toUserId: loggedInUser.id, status: "accepted" },
        ],
      })
        .populate("toUserId", AllConnectionPopulatedList)
        .populate("fromUserId", AllConnectionPopulatedList);

      //filtering out data that do not contain the logged in user data
      const ConnectionData = connections.map((connection) => {
        if (
          loggedInUser.id.toString() === connection.fromUserId._id.toString()
        ) {
          return connection.toUserId;
        }
        return connection.fromUserId;
      });

      return res.status(200).json({
        status: "success",
        data: ConnectionData,
      });
    } catch (err) {
      res.status(500).json({
        status: "failed",
        message: err.message,
      });
    }
  },

  getFeed: async (req, res) => {
    try {
      const loggedInUser = req.user;

      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      limit = limit > 50 ? 50 : limit;

      // user should not see all the user cards except
      //0: his own card
      //1: his connections
      //2: ignored people
      //3: people he is interested in (already sent a connection request)

      const connections = await ConnectionRequest.find({
        $or: [{ fromUserId: loggedInUser.id }, { toUserId: loggedInUser.id }],
      })
        .select("toUserId fromUserId")
        .populate("toUserId", AllConnectionPopulatedList)
        .populate("fromUserId", AllConnectionPopulatedList);

      const hideUsers = new Set();

      connections.forEach((connection) => {
        hideUsers.add(connection.toUserId._id.toString());
        hideUsers.add(connection.fromUserId._id.toString());
      });

      // const users = await User.find({ _id: { $nin: Array.from(hideUsers) } });
      const users = await User.find({ _id: { $nin: [...hideUsers] } })
        .select(AllConnectionPopulatedList)
        .skip((page - 1) * limit)
        .limit(limit);

      return res.status(200).json({
        status: "success",
        data: users,
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({
        status: "failed",
        message: err.message,
      });
    }
  },
};

module.exports = userController;
