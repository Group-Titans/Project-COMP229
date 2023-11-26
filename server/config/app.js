// moddules for node and express
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('./passport');
const { isLoggedIn } = require('./auth');
// import "mongoose" - required for DB Access
const mongoose = require('mongoose');
// URI
const DB = require('./db');

mongoose.connect(process.env.URI || DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });

const mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
    console.log("Connected to MongoDB...");
});


// define routers
const index = require('../routes/index'); // top level routes
const books = require('../routes/books'); // routes for books
const login = require('../routes/login'); // routes for login

const app = express();
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use((req, res, next) => {
  req.session.userRole = null;
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /client
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../client')));


// route redirects
app.use('/', index);
app.use('/login', login);
app.use('/index', isLoggedIn, index);
app.use('/books', isLoggedIn, books);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
