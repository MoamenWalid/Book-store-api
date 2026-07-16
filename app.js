const express = require("express");
const booksPath = require("./routes/books");
const authorsPath = require("./routes/authors");
const mongoose = require('mongoose');
const { logger } = require('./middlewares/logger');
const dotenv = require("dotenv");
const { notFound, errorHandler } = require("./middlewares/errors");
dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
})

// Connection to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB ^_^"))
  .catch((err) => console.log("Connection failed to MongoDB!", err));


// Init app
const app = express();

// Apply Middlewares
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/books', booksPath);
app.use('/api/authors', authorsPath);

// Error handler
app.use(notFound);
app.use(errorHandler);

// Runnign the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} on port ${ PORT }`));