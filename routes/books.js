const express = require('express');
const asyncHandler = require('express-async-handler');
const { Book, validateCreateBook, validateUpdateBook } = require('../models/Book');

const router = express.Router();

/**
 * @desc Get all books
 * @route /api/books
 * @method GET
 * @access public
 */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.find().populate('author', '_id firstName lastName');
  res.status(200).json(books);
}));

/**
 * @desc Get book by id
 * @route /api/books/:id
 * @method GET
 * @access public
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const book = await Book.findById(id).populate('author', '_id firstName lastName');
  if (book) res.status(200).json(book);
  else res.status(404).json({ message: "Book is not found" });
}))

/**
 * @desc Create a new book
 * @route /api/books
 * @method POST
 * @access public
 */
router.post('/', asyncHandler(async (req, res) => {
  const { error } = validateCreateBook(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const book = await Book.create({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    price: req.body.price,
    cover: req.body.cover
  });

  res.status(201).json(book);
}))

/**
 * @desc  Update a book
 * @route /api/books/:id
 * @method PUT
 * @access public
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error } = validateUpdateBook(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const updatedBook = await Book.findByIdAndUpdate(id, {
    $set: {
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      cover: req.body.cover
    }
  }, { new: true });

  res.status(200).json(updatedBook);
}));

/**
 * @desc  Delete a book
 * @route /api/books/:id
 * @method DELETE
 * @access public
 */
router.delete("/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const book = await Book.findByIdAndDelete(id);
  if (book) res.status(200).json({ message: "Book has been deleted" });
  else res.status(404).json({ message: "Book is not found" });
}));

module.exports = router;