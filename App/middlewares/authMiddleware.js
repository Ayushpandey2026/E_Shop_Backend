import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ msg: "No token provided" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ msg: "Invalid token format" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Unauthorized - Invalid token" });
    req.user = { userId: decoded.id };
    next();
  });
};


// Admin-only routes ke liye
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // ✅ Allowed
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};