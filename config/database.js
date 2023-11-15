const Mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Mongoose.Schema({
    email: String,
    password: String,
    name: String
})

module.exports = Mongoose.model(userSchema);