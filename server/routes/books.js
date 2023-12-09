const express = require('express');
const router = express.Router();
const Book = require('../models/books');

// GET books List page. READ
router.get('/', (req, res) => {
  Book.find((err, books) => {
    if (err) {
      console.error(err);
      res.render('error', { error: err });
    } else {
      const userRole = req.isAuthenticated() ? req.user.role : '';
      res.render('books/index', {
        userRole: userRole,
        title: 'Books',
        books: books
      });
    }
  });
});

// GET the Book Details page to add a new Book
router.get('/details', (req, res) => {
  res.render('books/details', { title: 'Add a Book', books: {}, userRole: req.user.role });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/details', (req, res) => {
  const newBook = new Book({
    Title: req.body.title,
    Author: req.body.author,
    Genre: req.body.genre,
    Available: req.body.available,
    Return_date: req.body.returnDate,
    Overdue_fees: req.body.overdueFees,
    Currently_with: req.body.currentlyWith,
  });

  newBook.save((err) => {
    if (err) {
      console.error(err);
      res.render('error');
    } else {
      res.redirect('/books');
    }
  });
});

// GET the Book Details page to edit an existing Book
router.get('/details/:id', (req, res) => {
  const id = req.params.id;

  Book.findById(id, (err, book) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.render('books/details', { title: "Edit Books List", books: book, userRole: req.user.role });
    }
  });
});

// POST - process the information passed from the details form and update the document
router.post('/details/:id', (req, res) => {
  const id = req.params.id;
  const updatedBook = {
    Title: req.body.title,
    Author: req.body.author,
    Genre: req.body.genre,
    Available: req.body.available,
    Return_date: req.body.returnDate,
    Overdue_fees: req.body.overdueFees,
    Currently_with: req.body.currentlyWith,
  };

  Book.findByIdAndUpdate(id, updatedBook, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.redirect('/books');
    }
  });
});

// GET - process the delete by book ID
router.get('/delete/:id', (req, res) => {
  const id = req.params.id;

  Book.findByIdAndRemove(id, (err) => {
    if (err) {
      console.error(err);
      res.render('error', { error: err });
    } else {
      res.redirect('/books');
    }
  });
});

module.exports = router;
