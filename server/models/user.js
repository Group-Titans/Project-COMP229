// models/user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstName : String,
  lastName : String,
  email:String,
  role : String,
  // Add other user fields as needed
},{ collection: 'user' });

module.exports = mongoose.model('user', userSchema);
