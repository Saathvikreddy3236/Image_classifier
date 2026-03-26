const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AppError = require("../utils/appError");
const { findUserByName, createUser } = require("../models/authModel");

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function signToken(user) {
  return jwt.sign({ user_id: user.user_id, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
}

async function register(req, res, next) {
  try {
    const { name, password } = req.body;
    if (!name?.trim()) {
      throw new AppError("Username is required.");
    }
    if (!password?.trim()) {
      throw new AppError("Password is required.");
    }

    const existing = await findUserByName(name.trim());
    if (existing) {
      throw new AppError("User already exists. Please login instead.");
    }

    const user = await createUser(name.trim(), hashPassword(password));
    res.status(201).json({ user, token: signToken(user) });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { name, password } = req.body;
    if (!name?.trim()) {
      throw new AppError("Username is required.");
    }
    if (!password?.trim()) {
      throw new AppError("Password is required.");
    }

    const user = await findUserByName(name.trim());
    if (!user) {
      throw new AppError("User not found. Please register first.", 404);
    }
    if (user.password_hash !== hashPassword(password)) {
      throw new AppError("Invalid password.", 401);
    }

    res.json({ user: { user_id: user.user_id, name: user.name }, token: signToken(user) });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login };
