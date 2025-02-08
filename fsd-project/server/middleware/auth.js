const jwt = require("jsonwebtoken");

const auth = (role) => {
  return (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (role && verified.role !== role) return res.status(403).json({ message: "Forbidden" });

      req.user = verified;
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid Token" });
    }
  };
};

module.exports = auth;
