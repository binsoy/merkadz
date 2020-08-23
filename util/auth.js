const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const bearer = req.header("auth-token");
  if (!bearer) return res.status(400).json({ error: "Access Denied" });
  const token = bearer.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json(err);
  }
};
