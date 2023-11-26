const passport = require('passport');

function isLoggedIn(req, res, next) {
    console.log('isLoggedIn middleware called');
    if (req.isAuthenticated()) {
        console.log('Authenticated');
        const userRole = req.user ? req.user.role : null; // Access user role from req.user
        console.log('User Role:', userRole); // Pass user role to views
        return next();
    }
    res.redirect('/');
}

module.exports = { isLoggedIn };

