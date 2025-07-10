const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "All fields required." });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "All fields required." });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password." });

    const token = crypto.randomBytes(32).toString("hex");
    user.token = token;
    await user.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user: { email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed." });
  }
});

// LOGOUT
router.post("/logout", async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    const user = await User.findOne({ token });
    if (user) {
      user.token = null;
      await user.save();
    }
  }
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

// GET PROFILE
router.get("/profile", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not logged in" });

  try {
    const user = await User.findOne({ token }).select("-password");
    if (!user) return res.status(401).json({ error: "Invalid session" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
