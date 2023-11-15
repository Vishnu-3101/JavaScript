const Mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new Mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    hash: String,
    salt: String
})


userSchema.methods.genPassword = (password)=>{
    this.salt = crypto.randomBytes(32).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt,1000, 64, 'sha512').toString('hex');
}

userSchema.methods.validatePass = (password)=>{
    let hash = crypto.pbkdf2Sync(password,this.salt, 1000, 64, 'sha512').toString('hex');
    return hash===this.hash;
}

module.exports = Mongoose.model(userSchema);