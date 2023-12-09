const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { newUsername, newPassword, firstName,lastName, email } = req.body;

  try {
    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser) {
      return res.render('register', { registrationError: 'Username is already taken' });
    }

    const newUser = new User({
      username: newUsername,
      password: newPassword,
      firstName: firstName,
      lastName:lastName,
      email: email,
      role: 'admin',
    });

    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
