// middleware/auth.js
import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    console.log("req.user set to:", req.user);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Only Admin Access
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admin only" });
  }
  next();
};
