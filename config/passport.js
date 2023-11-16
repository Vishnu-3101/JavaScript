const passport = require('passport');
const LocalStratergy = require('passport-local').Strategy;
const User = require('./database');
const validatePass = require('../config/cryptoPassword').validPassword;


const customFields = {
    usernameField : 'email'
};

async function verifyPassword(username,password,cb){
    const userDetails = await User.findOne({username:username})
    try{
        if(!userDetails){
            return cb(null,false,{message: 'Incorrect username'});
        }
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