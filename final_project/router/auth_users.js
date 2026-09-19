const express = require("express");
const jwt = require("jsonwebtoken");
const { books } = require("./booksdb.js");

const authenticated = express.Router();
const regd_users = express.Router();
const users = [];

function isValid(username) {
  return users.some(user => user.username === username);
}

function authenticatedUser(username, password) {
  return users.some(
    user => user.username === username && user.password === password
  );
}

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
  req.session.authorization = { accessToken };

  res.status(200).json({
    message: "Login successful",
    accessToken
  });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user && req.user.username;

  if (!username) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  books[isbn].reviews[username] = review;
  res.status(200).json({
    message: "Review added/modified successfully",
    reviews: books[isbn].reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user && req.user.username;

  if (!username) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!Object.prototype.hasOwnProperty.call(books[isbn].reviews, username)) {
    return res.status(404).json({ message: "Review not found for user" });
  }

  delete books[isbn].reviews[username];
  res.status(200).json({ message: "Review deleted successfully" });
});

authenticated.use("/", regd_users);
module.exports.authenticated = authenticated;
module.exports.users = users;
module.exports.isValid = isValid;
