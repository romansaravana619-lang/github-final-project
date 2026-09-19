const express = require("express");
const axios = require("axios");
const { books } = require("./booksdb.js");

const general = express.Router();
const public_users = express.Router();

// GET all books
public_users.get("/", (req, res) => {
  res.status(200).json(books);
});

// GET book by ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.status(200).json(book);
});

// GET books by author (partial/case-insensitive match)
public_users.get("/author/:author", (req, res) => {
  const query = decodeURIComponent(req.params.author).toLowerCase();
  const matches = Object.values(books).filter(book =>
    book.author.toLowerCase().includes(query)
  );
  if (matches.length === 0) {
    return res.status(404).json({ message: "No books found for this author" });
  }
  res.status(200).json(matches);
});

// GET books by title (partial/case-insensitive match)
public_users.get("/title/:title", (req, res) => {
  const query = decodeURIComponent(req.params.title).toLowerCase();
  const matches = Object.values(books).filter(book =>
    book.title.toLowerCase().includes(query)
  );
  if (matches.length === 0) {
    return res.status(404).json({ message: "No books found with this title" });
  }
  res.status(200).json(matches);
});

// GET reviews for a book
public_users.get("/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.status(200).json(book.reviews);
});

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body || {};
  const users = module.exports.users;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  res.status(200).json({ message: "User registered successfully" });
});

general.use("/", public_users);
module.exports.general = general;
module.exports.users = [];

// ---------- Axios methods required by the final project ----------

// Method 1: Promise callback - retrieve all books
function getAllBooks() {
  return axios.get("http://localhost:5001/")
    .then(response => response.data)
    .catch(error => { throw error; });
}

// Method 2: Async/Await - retrieve a book by ISBN
async function getBookByISBN(isbn) {
  const response = await axios.get("http://localhost:5001/isbn/" + encodeURIComponent(isbn));
  return response.data;
}

// Method 3: Async/Await - retrieve books by author
async function getBooksByAuthor(author) {
  const response = await axios.get(
    "http://localhost:5001/author/" + encodeURIComponent(author)
  );
  return response.data;
}

// Method 4: Promise - retrieve books by title
function getBooksByTitle(title) {
  return axios.get(
    "http://localhost:5001/title/" + encodeURIComponent(title)
  ).then(response => response.data);
}

// Additional callback-based review retrieval
function getBookReviews(isbn, callback) {
  axios.get("http://localhost:5001/review/" + encodeURIComponent(isbn))
    .then(response => callback(null, response.data))
    .catch(error => callback(error, null));
}

module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
module.exports.getBookReviews = getBookReviews;
