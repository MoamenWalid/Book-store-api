const { required } = require('joi');
const mongoose = require('mongoose');
const Joi = require('joi');

const AuthorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200
  },
  natinality: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  image: {
    type: String,
    default: "default-image.png"
  }
}, { timestamps: true });

const Author = mongoose.model("Author", AuthorSchema);

function validateCreateAuthor(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(200).required(),
    lastName: Joi.string().trim().min(3).max(200).required(),
    natinality: Joi.string().required(),
    image: Joi.string()
  })

  return schema.validate(obj);
}

function validateUpdateAuthor(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(200),
    lastName: Joi.string().trim().min(3).max(200),
    natinality: Joi.string(),
    image: Joi.string(),
  })

  return schema.validate(obj);
}

module.exports = {
  Author,
  validateCreateAuthor,
  validateUpdateAuthor
}