const router = require("express").Router();
const Comment = require("../model/Comment");
const auth = require("../util/auth");

/** GET ALL COMMENTS OF A POST */
router.get("/:postId", auth, async (req, res) => {
  try {
    await Comment.find({ postId: req.params.postId }, (err, comments) => {
      res.status(200).json({ doc: comments });
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

/** ADD A COMMENT */
router.post("/comment", auth, async (req, res) => {
  const newComment = new Comment({
    userHandle: req.user.handle,
    postId: req.body.postId,
    body: req.body.body,
  });

  try {
    const comment = await newComment.save();
    res.status(201).json({ message: "New comment was created", doc: comment });
  } catch (error) {
    res.status(400).json(error);
  }
});

/** DELETE A COMMENT */
router.delete("/comment/:commentId", async (req, res) => {
  const deletedComment = await Comment.findByIdAndDelete({
    _id: req.params.commentId,
  });

  if (!deletedComment)
    return res.status(400).json({ message: "Failed to delete comment" });

  res.status(200).json({ doc: deletedComment });
});

module.exports = router;
