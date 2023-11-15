const passport = require('passport');
const LocalStratergy = require('passport-local');
const User = require('./database');

const customFields = {
    usernameField : 'email'
};

async function verifyPassword(username,password,cb){
    const userDetails = await User.findOne({username:username})
    try{
        if(!userDetails){
            return cb(null,false,{message: 'Incorrect username or password'});
        }
        const validPass = userDetails.validatePass(password);
        if(validPass){
            return cb(null,userDetails);
        }
        else{
            return cb(null,false, {message: 'Incorrect username or password'});
        }
    }
    catch(e){
        cb(e);
        console.log(e);
    }
}

const stratergy = new LocalStratergy(customFields,verifyPassword);

passport.use(stratergy);