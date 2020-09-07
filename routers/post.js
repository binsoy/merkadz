const router = require("express").Router();
const Post = require("../model/Post");
const auth = require("../util/auth");
const crypto = require("crypto");

/** GET ALL POSTS */
router.get("/", async (req, res) => {
  try {
    await Post.find({}, (err, posts) => {
      res.status(200).json({ doc: posts });
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

/** GET POST DETAILS */
router.get("/post/:postId", auth, async (req, res) => {
  const post = await Post.findOne({ _id: req.params.postId });
  if (!post) return res.status(400).json({ message: "Post not found" });

  res.status(200).json(post);
});

/** ADD NEW POST */
router.post("/post", auth, async (req, res) => {
  const id = crypto.randomBytes(16).toString("hex");
  const post = new Post({
    _id: id,
    userHandle: req.user.handle,
    body: req.body.body,
  });

  try {
    const savedPost = await post.save();
    res.status(201).json({ message: "New post was created", doc: savedPost });
  } catch (error) {
    res.status(400).json(error);
  }
});

/** UPDATE POST */
router.post("/post/update", auth, async (req, res) => {
  const updatedPost = await Post.findOneAndUpdate(
    { _id: req.body.postId },
    {
      body: req.body.body,
      postImages: req.body.postImages,
      updatedAt: new Date().toISOString(),
    },
    { new: true }
  );

  if (!updatedPost)
    return res.status(400).json({ message: "Failed to update post" });

  res.status(200).json({ doc: updatedPost });
});

/** DELETE A POST */
router.delete("/post/:postId", auth, async (req, res) => {
  try {
    let postToDelete;
    await Post.find({ _id: req.params.postId }, (err, posts) => {
      postToDelete = posts[0];
    });

    // check if logged in user owns the post to be deleted
    if (postToDelete.userHandle !== req.user.handle) {
      res.status(403).json({ message: "Action not allowed" });
    } else {
      Post.findByIdAndDelete({ _id: req.params.postId }, (error, doc) => {
        if (error) {
          res.status(400).json(error);
        } else {
          res.status(200).json({ message: "Delete success", doc });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ message: "Post not found" });
  }
});

module.exports = router;
