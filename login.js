//mysql was having issues with authentication into mysql database for mysql 8.0 and above versions. So i used mysql
const mysql = require('mysql2');

//body-parser module is used to accept the user entered contents like username, password etc..
// https://www.npmjs.com/package/body-parser - go to the link to get more information
const parser = require('body-parser')

const express = require('express');
const app = express();

// We use urlencoder() if we accept the data from webiste in the form of strings. 
// parser.JSON() for json objects
const encoder = parser.urlencoded();

// It is used to serve static files. Here it is used to access all files in assets folder.
// We can use app.use(express.static(path.join(__dirname,'assets'))) to accees the files in assets folder by default
app.use("/assets",express.static("assets"));
app.use(express.json());


//Creating a connection to mysql server and accessing the database in it
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Mysql@21",
    database:"nodejs"
})


// Handling the error in connection.
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


// When we use post, we can read the values entered by user for authentication
app.post("/login",encoder,(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    // The actual authentication happens here
    // The values obtained from database using the sql query will be checked with the values mentioned in [bracket]
    // Results will be the values that are matched. If there is not matching values then no logging in happens
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

// If port 4000 is used by other process then we use the port returned by process.env.PORT
const port = process.env.PORT || 4000;
app.listen(4000,()=>console.log(`Listening on port ${port}....`));
