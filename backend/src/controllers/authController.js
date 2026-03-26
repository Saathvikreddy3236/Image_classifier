const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { findUserByName, createUser } = require("../models/authModel");

function signToken(user) {
  return jwt.sign({ user_id: user.user_id, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
}

async function register(req, res, next) {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      throw new AppError("Name is required.");
    }

    const existing = await findUserByName(name.trim());
    if (existing) {
      throw new AppError("User already exists. Please login instead.");
    }

    const user = await createUser(name.trim());
    res.status(201).json({ user, token: signToken(user) });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      throw new AppError("Name is required.");
    }

    const user = await findUserByName(name.trim());
    if (!user) {
      throw new AppError("User not found. Please register first.", 404);
    }

    res.json({ user, token: signToken(user) });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login };
