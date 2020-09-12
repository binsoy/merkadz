const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const bearer = req.headers["authorization"];
  if (!bearer) return res.status(400).json({ error: "Access Denied" });
  const token = bearer.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = user.payload;
    next();
  } catch (err) {
    res.status(400).json(err);
  }
};
