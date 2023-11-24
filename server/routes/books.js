// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let Book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  Book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/details', (req, res, next) => {
  res.render('books/details', { title: 'Add a Book', books: {} });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/details', (req, res, next) => {
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

// GET the Book Details page in order to edit an existing Book
router.get('/details/:id', (req, res, next) => {
  const id = req.params.id;

    Book.findById(id, (err, book) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            // Show Edit view
            res.render('books/details', { title: "Edit Books List", books: book });
        }
    });
});

// POST - process the information passed from the details form and update the document
router.post('/details/:id', (req, res, next) => {
  const id = req.params.id;

    const updatedBooks = {
      Title: req.body.title,
      Author: req.body.author,
      Genre: req.body.genre,
      Available: req.body.available,
      Return_date: req.body.returnDate,
      Overdue_fees: req.body.overdueFees,
      Currently_with: req.body.currentlyWith,
    };

    Book.findByIdAndUpdate(id, updatedBooks, (err, contact) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            // Refresh the Book List
            res.redirect('/books');
        }
    });
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
  const id = req.params.id;

    Book.findByIdAndRemove(id, (err) => {
      if (err) {
        console.error(err);
        // Handle the error, e.g., by rendering an error page
        res.render('error', { error: err });
      } else {
        // Redirect to the Book list page after successful deletion
        res.redirect('/books');
        }
    });
});


module.exports = router;
