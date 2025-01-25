const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not a valid status`,
      },
    },
  },
  {
    timestamps: true,
  }
);

//creating compound index in order to make the query faster ( // Check for existing request )
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.pre("save", async function (next) {
  // Check if fromUserId and toUserId are the same
  if (this.fromUserId.toString() === this.toUserId.toString()) {
    return next(new Error("Request cannot be sent to self"));
  }

  // Check if toUser exists
  const toUser = await mongoose.model("User").findById(this.toUserId);
  if (!toUser) {
    return next(new Error("Recipient user not found"));
  }

  // Check for existing request
  const existingRequest = await this.constructor.findOne({
    $or: [
      { fromUserId: this.fromUserId, toUserId: this.toUserId },
      { fromUserId: this.toUserId, toUserId: this.fromUserId },
    ],
  });

  if (existingRequest) {
    return next(new Error("Connection request already exists"));
  }

  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
