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

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    const token = generateToken(user);

    return res.status(201).json({ user: sanitizeUser(user), token });
  } catch (error) {
    console.error("Signup error", error);
    return res.status(500).json({ message: "Failed to create user" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    return res.json({ user: sanitizeUser(user), token });
  } catch (error) {
    console.error("Login error", error);
    return res.status(500).json({ message: "Failed to login" });
  }
}

async function getProfile(req, res) {
  return res.json({ user: sanitizeUser(req.user) });
}

async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Do not reveal whether the email exists
      return res.json({
        message: "If an account with this email exists, an OTP has been sent.",
      });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(otpCode, 10);

    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await OtpToken.create({
      userId: user._id,
      codeHash,
      expiresAt,
    });

    await sendOtpEmail({ to: user.email, code: otpCode });

    return res.json({
      message: "If an account with this email exists, an OTP has been sent.",
    });
  } catch (error) {
    console.error("Request password reset error", error);
    return res
      .status(500)
      .json({ message: "Failed to initiate password reset" });
  }
}

async function resetPassword(req, res) {
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
}

module.exports = {
  signup,
  login,
  getProfile,
  requestPasswordReset,
  resetPassword,
};
