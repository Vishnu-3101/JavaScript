const Mongoose = require('mongoose');

const userSchema = new Mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hash: String,
    salt: String
},{collection: 'users_collection'})


module.exports = Mongoose.model('User',userSchema);