const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const Book = require('../models/books'); // Check the correct path to your Book model

router.use(express.urlencoded({ extended: true }));

router.get('/', (req, res) => {
  res.render('content/index', {
    userRole: '',
    title: 'Home',
    books: ''
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, async (err) => {
    if (!err) {
      const user = req.user;
      req.session.userRole = user.role;
      return res.redirect('/index');
    } else {
      console.log('Authentication failed');
      return res.redirect('/login');
    }
  });
});

router.get('/login', (req, res) => {
  res.render('content/login', { messages: req.flash() });
});

router.get('/index', (req, res) => {
  const userRole = req.isAuthenticated() ? req.user.role : '';
  res.render('content/index', {
    userRole: userRole,
    title: 'Home',
    books: ''
  });
});

router.get('/overduefees', (req, res) => {
  const userRole = req.isAuthenticated() ? req.user.role : '';
  res.render('content/overduefees', {
    userRole: userRole,
    title: 'Overdue Fees'
  });
});

router.get('/contact', (req, res) => {
  const userRole = req.isAuthenticated() ? req.user.role : '';
  res.render('content/contact', {
    userRole: userRole,
    title: 'Contact Us'
  });
});

router.get('/books', (req, res) => {
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

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error('Error during logout:', err);
      return next(err);
    }
    req.flash('info', 'Successfully logged out.');
    res.redirect('/');
  });
});

module.exports = router;
