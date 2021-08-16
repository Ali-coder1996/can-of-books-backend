'use strict';
const mongoose = require('mongoose')

let booksSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: String,
});

let userSchema = new mongoose.Schema({
    email: String,
    book: [booksSchema]
    
});

let myBooksModel = mongoose.model('book', booksSchema);
let myUserModel = mongoose.model('user', userSchema);


module.exports=myUserModel