const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { Author, validateUpdateAuthor, validateCreateAuthor } = require('../models/Author');

/**
 * @desc Get all authors
 * @route /api/authors
 * @method GET
 * @access public
 */
router.get('/', asyncHandler(async (req, res) => {
  const authorList = await Author.find();
  res.status(200).json(authorList);
}));

/**
 * @desc Get author by id
 * @route /api/authors/:id
 * @method GET
 * @access public
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const author = await Author.findById(id);
  if (author) res.status(200).json(author);
  else res.status(404).json({ message: "Author is not found" });
}))

/**
 * @desc Create a new author
 * @route /api/authors
 * @method POST
 * @access public
 */
router.post('/', asyncHandler(async (req, res) => {
  const { error } = validateCreateAuthor(req.body);
  if (error) res.status(400).json({ message: error.details[0].message });

  const author = new Author({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    natinality: req.body.natinality,
    image: req.body.image
  })

  const result = await author.save();
  res.status(201).json(result);
}))

/**
 * @desc Update author by id
 * @route /api/authors/:id
 * @method PUT
 * @access public
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error } = validateUpdateAuthor(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const author = await Author.findByIdAndUpdate(id, {
    $set: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      natinality: req.body.natinality,
      image: req.body.image
    }
  }, { new: true });

  res.status(200).json(author);
}))

/**
 * @desc Delete author by id
 * @route /api/authors/:id
 * @method DELETE
 * @access public
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const author = await Author.findByIdAndDelete(id);
  if (author) {
    res.status(200).json({ message: "Author has been deleted" });
  } else {
    res.status(404).json({ message: "Author not found" });
  }
}))

module.exports = router;