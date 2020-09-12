const { Mongoose } = require("mongoose");

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    max: 255,
  },
  lastName: {
    type: String,
    required: true,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    max: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
  },
  handle: {
    type: String,
    required: true,
    max: 255,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    max: 255,
  },
  address: {
    type: String,
    required: true,
    max: 255,
  },
  imageUrl: {
    type: String,
    max: 1024,
  },
  roles: [
    {
      type: String,
      required: true,
      max: 255,
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

module.exports = userSchema;
