const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { validateRegisterUser, User, validateLoginUser } = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @desc Register new user
 * @route /api/auth/register
 * @method POST
 * @access public
 */
router.post("/register", asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "This user already registered" });
  }

  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  user = await User.create({
    email: req.body.email,
    username: req.body.username,
    password: hash,
    isAdmin: req.body.isAdmin
  });
  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY);
  const { password, ...other } = user._doc;

  res.status(201).json({ ...other, token });
}));

/**
 * @desc Login new user
 * @route /api/auth/login
 * @method POST
 * @access public
 */
router.post("/login", asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY);
  const { password, ...other } = user._doc;

  res.status(200).json({ ...other, token });
}));

module.exports = router;