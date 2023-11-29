const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/userSchema");
const pool = require("../../config/connection");

const router = express.Router();
const user = new User(pool);

// Endpoint for user sign-up
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Validate input
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    const checkUserResult = await user.getUserByEmail(email);
    if (checkUserResult) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user using the model
    const newUser = await user.createUser({name, email, phone, hashedPassword, role});

    // Generate and send JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      "your_secret_key", // Replace with a secure key in production
      { expiresIn: "1h" }
    );
    res.cookie("token", token);
    res.json({ role: newUser.role });
  } catch (error) {
    console.error("Error signing up user", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
