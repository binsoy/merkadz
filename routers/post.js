const router = require("express").Router();
const Post = require("../model/Post");
const auth = require("../util/auth");

router.get("/", async (req, res) => {
  try {
    await Post.find({}, (err, posts) => {
      res.status(200).json({ doc: posts });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/post", auth, async (req, res) => {
  const post = new Post({
    userHandle: req.user.handle,
    body: req.body.body,
  });

  try {
    const savedPost = await post.save();
    res.status(201).json({ message: "New post was created", doc: savedPost });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete("/post/:postId", auth, (req, res) => {
  Post.findByIdAndDelete({ _id: req.params.postId }, (err, doc) => {
    if (!doc) {
      return res.status(400).json({ error: "Post not found" });
    } else if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res.status(200).json({ message: "Delete success", doc });
    }
  });
});

module.exports = router;
