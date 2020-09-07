const { Mongoose } = require("mongoose");

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userHandle: {
    type: String,
    required: true,
    max: 255,
  },
  postId: {
    type: String,
    max: 1024,
    required: true,
  },
  body: {
    type: String,
    required: true,
    max: 1024,
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  updatedAt: {
    type: String,
    max: 255,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
