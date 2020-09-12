const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = require("../model/User");
const NotificationSchema = require("../model/Notification");
const auth = require("../util/auth");
const mongoose = require("../util/dbConnection");

// Models
const User = mongoose.model("User", UserSchema);
const Notification = mongoose.model("Notification", NotificationSchema);

/** USER SIGNUP */
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
    const token = generateAuthToken(savedUser);

    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json(error);
  }
});

/** USER LOGIN */
router.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: "Email not found" });
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).json({ message: "Invalid password" });

  const token = generateAuthToken(user);
  res.status(200).json({ token });
});

/** GET USER DETAILS */
router.get("/user/:handle", auth, async (req, res) => {
  const user = await User.findOne({ handle: req.params.handle });
  if (!user) return res.status(400).json({ message: "User not found" });

  res.status(200).json(user);
});

/** UPDATE USER DETAILS */
router.post("/user/update", auth, async (req, res) => {
  const updatedUser = await User.findOneAndUpdate(
    { handle: req.user.handle },
    { ...req.body, updatedAt: new Date().toISOString() },
    {
      new: true,
    }
  );

  if (!updatedUser)
    return res.status(400).json({ message: "Failed to update user details" });

  res.status(200).json({ doc: updatedUser });
});

/** DELETE USER DETAILS */
router.delete("/user/:userId", auth, async (req, res) => {
  const deletedUser = await User.findOneAndDelete({
    _id: req.params.userId,
  });

  if (!deletedUser)
    return res.status(400).json({ message: "Failed to delete user" });

  res.status(200).json({ doc: deletedUser });
});

/** MARK NOTIFICATION AS READ */
router.post("/user/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.body.notificationId },
      { read: true },
      { new: true }
    );

    if (!notification)
      res.status(400).json({ message: "Notification not found" });

    res.status(200).json({ message: "Successfully read notification" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// TODO: transfer this
const generateAuthToken = (payload) => {
  return jwt.sign({ payload }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = router;
