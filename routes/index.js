const express = require('express');
const app =  express();

const User = require('../config/database');
const genPassword = require('../config/cryptoPassword').genPassword;
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const flash = require('express-flash');

// We specify the path of .env file in config. By default it looks for the .env file in current directory
require('dotenv').config({path:'../.env'})
app.use("/assets",express.static("D:/JavaScript/LoginPage/assets"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(flash());


// Express look at views folder in current path for the static files like css.
// If we want to look at different location for the static files, we need to set the path to desired location

app.set('views', 'D:/JavaScript/LoginPage/views');


// Connecting to mongoose database
const db = mongoose.connect(process.env.MONGO_PROD_URI).then(() => console.log("Database connected!"))
   .catch((err) => console.log(err));

// starting the express-session to store the info related to this session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_PROD_URI })
  }));


// importing the files for password verfication using passport
require('../config/passport')

app.use(passport.initialize());
app.use(passport.session());
  


app.get('/login',(req,res)=>{
    res.render('login.ejs');
})

app.get('/register',(req,res)=>{
    res.render('register.ejs');
})

app.get('/welcome',(req,res)=>{
    res.render('welcome.ejs');
})


// Adding user details to mongodb database
app.post('/register',async (req,res)=>{
    try{
        let pass = genPassword(req.body.password);
        let user = new User({
            email: req.body.email,
            name : req.body.name,
            hash : pass.hash,
            salt : pass.salt
        });
          
        console.log(user); 
        user.save();
        res.redirect('/login');
    }
    catch(e){
        console.log(e);
        res.redirect('/register');
    }
})

// Authenicating the user using passport local stratergy
app.post('/login',passport.authenticate("local",
                    {failureRedirect:'/login',
                    successRedirect:'/welcome',
                    failureFlash: true}),(req,res,next)=>{
                        console.log("hello");
                    });

    
const port = process.env.PORT || 3000;
app.listen(3000);