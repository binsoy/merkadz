const { Mongoose } = require("mongoose");

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userHandle: {
    type: String,
    required: true,
    max: 255,
  },
  body: {
    type: String,
    required: true,
    max: 1024,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  postImages: [
    {
      type: String,
      max: 1024,
    },
  ],
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  updatedAt: {
    type: String,
    max: 255,
  },
});

module.exports = mongoose.model("Post", postSchema);
