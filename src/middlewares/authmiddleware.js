const jwt = require("jsonwebtoken");

// middleware to check if user is authenticated
const authmiddleware = (req, res, next) => {
  let token = null;
  if (["PUT", "POST", "DELETE"].includes(req.method)) {
    token = req.body?.token;
  }
  if (["GET"].includes(req.method)) {
    token = req.query?.token;
  }
  if (!token) {
    return res.status(401).json({ message: "user is not authenticated" });
  } else {
    jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {
      if (err) return res.status(401).json({ message: "invalid token" });
      else next();
    });
  }
};

module.exports = { authmiddleware };
