import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmails.js";

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    const trimmedEmail = email.trim();
    const lowerEmail = trimmedEmail.toLowerCase();
    console.log("📝 Attempting signup for:", { name, email: lowerEmail });
    
    const exist = await User.findOne({ email: lowerEmail });
    if (exist) {
      console.log("❌ Account already exists:", lowerEmail);
      return res.status(400).json({ message: "Email already exists. Please login or use a different email." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: lowerEmail, password: hashed });
    console.log("✅ User created:", user.email);
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("✅ Token generated for:", lowerEmail);
    return res.status(201).json({ 
      token, 
      message: "Account created successfully", 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role,
        avatar: user.avatar || null
      } 
    });
  } catch (e) {
    console.error("❌ Signup error:", e);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;  
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const trimmedEmail = email.trim();
    const lowerEmail = trimmedEmail.toLowerCase();

    console.log("🔍 Searching for user with email:", lowerEmail);
    
    const user = await User.findOne({ email: lowerEmail });
    if (!user) {
      console.log("❌ User not found with email:", lowerEmail);
      return res.status(400).json({ message: "User not found. Please sign up first." });
    }

    console.log("✅ User found:", user.email);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch for user:", lowerEmail);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ Password verified for user:", lowerEmail);

    // Check role if provided
    if (role && user.role !== role) {
      console.log(`❌ Role mismatch: user has '${user.role}' but tried to login as '${role}'`);
      return res.status(403).json({ message: `This account is not a ${role} account` });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful for user:", lowerEmail);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
      },
    });
  } catch (err) {
    console.error("❌ Login controller error:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const trimmedEmail = email.trim();
    const lowerEmail = trimmedEmail.toLowerCase();
    const user = await User.findOne({ email: lowerEmail });
    if(!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10*60*1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "https://everbuy.vercel.app"}/reset-password/${resetToken}`;
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

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.user.id;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email required' });
    }
    
    const updateData = { name, email };
    if (phone) updateData.phone = phone;
    
    if (req.file) {
      updateData.avatar = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    
    const user = await User.findByIdAndUpdate(
      userId, 
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      message: 'Profile updated successfully', 
      user 
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try{
    const { password } = req.body;
    if (!password || password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

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

// ✅ Change password (logged in user)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    console.log("✅ Password changed for user:", userId);
    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("❌ Change password error:", err);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

