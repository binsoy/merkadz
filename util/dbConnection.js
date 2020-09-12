const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
//connect to DB
const connection = mongoose.createConnection(
  process.env.MONGODB_URI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => console.log("Connected to DB")
);

module.exports = connection;
