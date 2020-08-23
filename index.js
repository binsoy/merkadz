const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

const userRouter = require("./handlers/user");
const postRouter = require("./handlers/post");

dotenv.config();

//connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => console.log("Connected to DB")
);

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

app.listen(3000, () => console.log("Sever up and running"));
