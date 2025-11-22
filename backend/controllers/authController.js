const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const OtpToken = require("../models/OtpToken");
const { sendOtpEmail } = require("../utils/sendOtpEmail");

const JWT_EXPIRES_IN = "7d";
const OTP_EXPIRY_MINUTES = 10;

function generateToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

function sanitizeUser(user) {
  const obj = user.toObject ? user.toObject() : user;
  // eslint-disable-next-line no-unused-vars
  const { passwordHash, __v, ...rest } = obj;
  return rest;
}

// @desc    Signup
// @route   POST /api/auth/signup
// @access  Public
async function signup(req, res) {
  try {
    const { loginId, name, email, password, confirmPassword, role } = req.body;

    // Validate required fields
    if (!loginId || !name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate loginId length
    if (loginId.length < 6 || loginId.length > 12) {
      return res
        .status(400)
        .json({ message: "Login ID must be between 6-12 characters" });
    }

    // Check uniqueness
    const existingLoginId = await User.findOne({ loginId });
    if (existingLoginId) {
      return res.status(400).json({ message: "Login ID already in use" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email ID already exists in database" });
    }

    // Password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, including uppercase, lowercase, and a special character",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Role handling (default staff)
    const allowedRoles = ["manager", "staff"];
    let userRole = "staff";
    if (role) {
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role specified" });
      }
      userRole = role;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      loginId,
      name,
      email,
      passwordHash,
      role: userRole,
    });

    const token = generateToken(user);
    return res.status(201).json({ user: sanitizeUser(user), token });
  } catch (error) {
    console.error("Signup error", error);
    return res.status(500).json({ message: "Failed to create user" });
  }
}

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
async function login(req, res) {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res
        .status(400)
        .json({ message: "Login ID and password are required" });
    }

    const user = await User.findOne({ loginId });
    if (!user) {
      return res.status(401).json({ message: "Invalid Login ID or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Login ID or Password" });
    }

    const token = generateToken(user);
    return res.status(200).json({ user: sanitizeUser(user), token });
  } catch (error) {
    console.error("Login error", error);
    return res.status(500).json({ message: "Login failed" });
  }
}

async function getProfile(req, res) {
  return res.json({ user: sanitizeUser(req.user) });
}

// @desc    Forgot Password (Generate OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Do not reveal whether the email exists
      return res.json({
        message: "If an account with this email exists, an OTP has been sent.",
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(otpCode, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await OtpToken.create({
      userId: user._id,
      codeHash,
      expiresAt,
    });

    await sendOtpEmail({ to: user.email, code: otpCode });

    res.json({ message: "If an account with this email exists, an OTP has been sent." });
  } catch (error) {
    console.error("Forgot password error", error);
    res.status(500).json({ message: "Failed to initiate password reset" });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP or email" });
    }

    const tokenDoc = await OtpToken.findOne({
      userId: user._id,
      used: false,
    }).sort({ createdAt: -1 });

    if (!tokenDoc) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (tokenDoc.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const isMatch = await bcrypt.compare(otp, tokenDoc.codeHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    tokenDoc.used = true;
    await tokenDoc.save();

    return res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error", error);
    return res.status(500).json({ message: "Failed to reset password" });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
};
