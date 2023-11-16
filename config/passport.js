const passport = require('passport');
const LocalStratergy = require('passport-local').Strategy;
const User = require('./database');
const validatePass = require('../config/cryptoPassword').validPassword;

// LocalStratery takes username and password as default parameters 
// We need to declare the username field with our custom name if are using different ones
const customFields = {
    usernameField : 'email'
};


// This is where the actual password verification takes place
async function verifyPassword(username,password,cb){
    // Finding the user with the specified username
    const userDetails = await User.findOne({username:username})
    try{
        if(!userDetails){
            return cb(null,false,{message: 'Incorrect username'});
        }
        // If the username is correct, we validate the password using crypto
        // The message is send to flash module and can be accessed in html file to display the error in webpage
        const validPass = validatePass(password,userDetails.hash,userDetails.salt);
        if(validPass){
            return cb(null,userDetails);
        }
        else{
            return cb(null,false, {message: 'Incorrect password'});
        }
    }
    catch(e){
        cb(e);
        console.log(e);
    }
}

// Declaring a new LocalStratergy
const stratergy = new LocalStratergy(customFields,verifyPassword);

passport.use(stratergy);

passport.serializeUser((user,done)=>done(null,user.id));
passport.deserializeUser((id, done) => {
    User.findById(id).then((user)=>{
        done(null, user);
    })
    .catch((err)=>{
        done(err);
    });
});