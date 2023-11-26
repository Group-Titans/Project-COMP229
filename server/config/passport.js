const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const expressSession = require('express-session');
const bcrypt = require('bcrypt');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log("Received username:", username);
      console.log("Received password:", password);
      
      const user = await User.findOne({ username: username }).exec();
      if (user) {
        console.log("User found:", user);
        if (user.password === password) {
          console.log("User isMatch",user.password);
          const userRole = user ? user.role : null;
          console.log("User isMatch",JSON.stringify(user.role));
          return done(null, user, userRole);
        } else {
       
          console.log("User is not Match.");
          return done(null, false, { message: 'Invalid password' });
        }
      } else {
        console.log("User not found.");
        return done(null, false, { message: 'Invalid username' });
      }
    } catch (err) {
      console.error('Error while finding user:', err);
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) {
      return done(err);
    }

    // Set user role in session
    const userRole = user ? user.role : null;

    done(null, { ...user.toObject(), role: userRole });
  });
});



passport.deserializeUser((user, done) => {
  done(null, user);
});


module.exports = passport;
