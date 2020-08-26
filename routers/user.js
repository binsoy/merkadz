const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

router.post("/signup", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    handle: req.body.handle,
    phone: req.body.phone,
    address: req.body.address,
    roles: req.body.roles,
  });
  try {
    const savedUser = await user.save();
    res.json({ user: user._id });
  } catch (err) {
    res.status(400).json({ err });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: "Email not found" });
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res
    .status(200)
    .header("authorization", `Bearer ${token}`)
    .json({ token: token });
});

module.exports = router;
