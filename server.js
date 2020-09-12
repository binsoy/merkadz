const express = require("express");
const dotenv = require("dotenv");
const app = express();

// for Heroku
const PORT = process.env.PORT || 8080;

const userRouter = require("./routers/user");
const postRouter = require("./routers/post");
const commentRouter = require("./routers/comment");
const uploadRouter = require("./routers/upload");

dotenv.config();
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/upload", uploadRouter);

// Step 3: for React deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.listen(PORT, () => console.log(`Sever up and running at port ${PORT}`));
