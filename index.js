const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

// for Heroku
const PORT = process.env.PORT || 8080;

const userRouter = require("./handlers/user");
const postRouter = require("./handlers/post");

dotenv.config();

//connect to DB
mongoose.connect(
  process.env.MONGODB_URI,
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

// Step 3: for React deployment
// if(process.env.NODE_ENV === 'production'){
//   app.use(express.static('client/build'))
// }

app.listen(PORT, () => console.log("Sever up and running"));
