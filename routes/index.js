const express = require('express');
const app =  express();

const User = require('../config/database');
const genPassword = require('../config/cryptoPassword').genPassword;
const mongoose = require('mongoose')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const flash = require('express-flash');



require('dotenv').config()
app.use("/assets",express.static("D:/JavaScript/LoginPage/assets"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(flash());

app.set('views', 'D:/JavaScript/LoginPage/views');

const db = mongoose.connect("mongodb://localhost/login-page").then(() => console.log("Database connected!"))
   .catch((err) => console.log(err));



app.use(session({
    secret: "true",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb://localhost/login-page" })
  }));

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

app.post('/register',async (req,res)=>{
    try{
        pass = genPassword(req.body.password);
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


app.post('/login',passport.authenticate("local",
                    {failureRedirect:'/login',
                    successRedirect:'/welcome',
                    failureFlash: true}),(req,res,next)=>{
                        console.log("hello");
                    });

    
const port = process.env.PORT || 3000;
app.listen(3000);