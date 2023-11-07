const mysql = require('mysql2');
const parser = require('body-parser')

const express = require('express');
const app = express();
const encoder = parser.urlencoded();

app.use("/assets",express.static("assets"));
app.use(express.json());
app.set('view engine','html'); 

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Mysql@21",
    database:"nodejs"
})

connection.connect(error => {
    if(error) throw error
    else console.log("Sucessfully connected to database....!");
})

app.get('/login',(req,res)=>{
    res.render(__dirname+'/views/login.ejs');
})

app.get('/register',(req,res)=>{
    res.render(__dirname+ '/views/register.ejs');
})

app.get('/welcome',(req,res)=>{
    res.render(__dirname+'/views/welcome.ejs');
})

app.post('/register',(req,res)=>{
    res.send("Sucessfully registered");
})

app.post("/login",encoder,(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    connection.query("select * from loginuser where user_name = ? and user_password=?" , [username,password],(error,results,fields) => {
        if(results.length >0){
            res.redirect("/welcome");
            console.log(results);
        }
        else{
            res.redirect("/login");
        }
        res.end();
    })
})



const port = process.env.PORT || 4000;
app.listen(4000,()=>console.log(`Listening on port ${port}....`));
