const { Mongoose } = require("mongoose");

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true,
    max: 255,
  },
  sender: {
    type: String,
    max: 255,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
    default: false,
  },
  postId: {
    type: String,
    max: 1024,
    required: true,
  },
  type: {
    type: String,
    max: 255,
    required: true,
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
