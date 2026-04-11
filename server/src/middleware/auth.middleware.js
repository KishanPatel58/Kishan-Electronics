const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklist.model");
const ENV = require("../config/config");

const verifyAdmin = async (req, res, next) => {
  try {
    // 🔥 GET TOKEN FROM COOKIE (NOT HEADER)
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔥 CHECK BLACKLIST
    const blacklisted = await BlacklistToken.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: "Token blacklisted. Login again." });
    }

    // 🔥 VERIFY TOKEN
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    req.admin = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = verifyAdmin;