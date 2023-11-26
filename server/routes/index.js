// index.js

const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const isLoggedIn = require('../config/auth').isLoggedIn;
// Import the User model for authentication
const User = require('../models/user');
const passport = require('../config/passport');

// Remove the following line as it's not needed in this file
// const app = express();

// GET login page
router.get('/', (req, res) => {
  res.render('content/login');
});


// POST login logic
router.post('/login', (req, res, next) => {
  console.log('Received username:', req.body.username);
  console.log('Received password:', req.body.password);
  passport.authenticate('local', {
    successRedirect: '/index', // Add a slash before 'content'
    failureRedirect: '/login', // Add a slash before 'content'
    failureFlash: true, // Enable flash messages
  })(req, res,async (err) => {
    if (!err) {
      // Authentication successful
      console.log('User is authenticated');
      const user = req.user;

      // Set user role in session
      req.session.userRole = user.role;
      
      // Redirect to /index
      return res.redirect('/index');
    } else {
      // Authentication failed
      console.log('Authentication failed');
      return res.redirect('/login');
    }
  });
});

router.get('/login', (req, res) => {
  res.render('content/login', { messages: req.flash() });
});



router.get('/index', isLoggedIn, (req, res) => {
  console.log('Request to /index route');
  const userRole = req.isAuthenticated() ? req.user.role : undefined;
  console.log('User Role in /index route:', userRole);
  res.render('content/index', {
    userRole: userRole,
    title: 'Home',
    books: ''
  });
});



// GET logout logic

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error('Error during logout:', err);
      return next(err);
    }

    // Add flash messages if needed
    req.flash('info', 'Successfully logged out.');

    // Redirect to the login page
    res.redirect('/login');
  });
});




module.exports = router;

