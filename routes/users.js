const express = require('express');
const bcrypt = require("bcryptjs");
const asyncHandler = require('express-async-handler');
const { verifyToken, verifyTokenAndAuthorization } = require('../middlewares/verifyToken');
const { validateUpdateUser, User } = require('../models/User');
const router = express.Router();

/**
 * @desc Update user
 * @route /api/users/:id
 * @method PUT
 * @access private
 */
router.patch("/:id", verifyTokenAndAuthorization, asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, {
    email: req.body.email,
    password: req.body.password,
    username: req.body.username
  }, { returnDocument: "after" }).select('-password');
  res.status(200).json(updatedUser);
}))

module.exports = router;