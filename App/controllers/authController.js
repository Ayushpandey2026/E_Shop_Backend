import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmails.js";

const jwtSecret = process.env.JWT_SECRET || "4297b38ddb1583e077089a57a2d527312222a63519d8661eeeef12d451ebf4f56ba1b37e6625a7bd2ab059a9b7fa4eef392bd1d130267231ecae2df56ad1c0304";

const signToken = (userId) =>
  jwt.sign({ id: userId }, jwtSecret, { expiresIn: "1h" });

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
    if (password.length < 1) return res.status(400).json({ message: "Password must be at least 1 character" });

    const trimmedEmail = email.trim();
    const lowerEmail = trimmedEmail.toLowerCase();
    const exist = await User.findOne({ email: lowerEmail });
    if (exist) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: lowerEmail, password: hashed });
     const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret,
      { expiresIn: "7d" }
    );
    return res.status(201).json({ token, message: "User created", user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;  //  role bhi frontend se ayega (user/admin)
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const trimmedEmail = email.trim();
    const lowerEmail = trimmedEmail.toLowerCase();

    console.log("Searching for email:", lowerEmail);
    const user = await User.findOne({ email: { $regex: new RegExp(`^${lowerEmail}$`, 'i') } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password); // ✅ direct bcrypt compare
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ role check karo
    if (role && user.role !== role) {
      return res.status(403).json({ message: `This account is not ${role}` });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Forgot / Reset (as you already had; kept minimal)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const trimmedEmail = email.trim();
    const lowerEmail = trimmedEmail.toLowerCase();
    const user = await User.findOne({ email: { $regex: new RegExp(`^${lowerEmail}$`, 'i') } });
    if(!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10*60*1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail({
      email: user.email,
      subject: "Password reset",
      message: `Click the link to reset your password: ${resetUrl}`,
      link: resetUrl
    });

    return res.json({ message: "Reset link sent" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try{
    const { password } = req.body;
    if (!password || password.length < 1) return res.status(400).json({ message: "Password is required and must be at least 1 character" });

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if(!user) return res.status(400).json({ message: "Token invalid/expired" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.json({ message: "Password reset successful" });
  }catch(e){
    console.error(e);
    return res.status(500).json({ message: "Server Error" });
  }
};





