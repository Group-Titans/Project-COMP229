let mongoose = require('mongoose');

// create a model class
let Book = mongoose.Schema({
    Title: String,
    Author: String,
    Genre: String,
    Available: String,
    Return_date: String,
    Overdue_fees: Number,
    Currently_with: String
  },
{
  collection: "books"
});

module.exports = mongoose.model('Book', Book);
