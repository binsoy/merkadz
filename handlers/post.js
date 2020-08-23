const router = require("express").Router();
const auth = require("../util/auth");

router.get("/", auth, (req, res) => {
  res.json({
    title: "a post",
    description: "Isda for sale",
  });
});

module.exports = router;
