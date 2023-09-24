const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/book_library", { useNewUrlParser: true });

// Middleware
app.use(bodyParser.json());

// Define Book Schema and Model using mongoose
const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
});

const Book = mongoose.model("Book", BookSchema);

// GET all books
app.get("/api/books", async (req, res) => {
  try{
    let result = await Book.find({})
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send("Internal Server Error").json(err);
  }
});


// GET a book by ID
app.get("/api/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    
    if (!book) {
      res.status(404).send("Book not found");
    } else {
      res.json(book);
    }
  } catch (err) {
    res.status(500).send("Internal Server Error").send(err);
  }
});


// POST (add) a new book
app.post("/api/books", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error").send(err);
  }
});

// Update Book
app.put("/api/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, { new: true });

    if (!updatedBook) {
      res.status(404).send("Book not found");
    } else {
      res.json(updatedBook);
    }
  } catch (err) {
    res.status(500).send("Internal Server Error").send(err);
  }
});


// DELETE a book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const removedBook = await Book.findByIdAndRemove(bookId);

    if (!removedBook) {
      res.status(404).send("Book not found");
    } else {
      res.json(removedBook);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error").send(err);
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
