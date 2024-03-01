const express=require("express");
const bodyParser=require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs=require("fs");
let port = 3000;

const app=express();
app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost:27017/clientDB',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const clientSchema=new mongoose.Schema({
        username:String,
        email:String,
        password:String,
        files:[],
        devices:[{type:String}]
 }); 

 const Client = mongoose.model('Client',clientSchema);

app.get("/",function(req,res){
    res.sendFile(__dirname+"/HTML/Login.html");
 });
app.get("/Signup.html", function (req, res) {
    res.sendFile(__dirname + "/HTML/Signup.html");
});

app.get("/dashboard.html", function (req, res) {
    res.sendFile(__dirname + "/HTML/Dashboard.html");
})

app.post('/register', (req, res) => {
    // To post / insert data into database

    const { username,email, password } = req.body;
    Client.findOne({ username: username })
        .then(user => {
            if (user) {
                res.json("Already registered")
            }
            else {
                Client.create(req.body)
                    .then(res.render("/dashboard.html"))
                    .catch(err => res.json(err))
            }
        })
    

})

app.post('/login', (req, res) => {
    // To find record from the database
    const { username, email, password } = req.body;
    Client.findOne({ username: username })
        .then(user => {
            if (user) {
                // If user found then these 2 cases
                if (user.password === password) {
                    res.json("Success");
                }
                else {
                    res.json("Wrong password");
                }
            }
            // If user not found then 
            else {
                res.json("No records found! ");
            }
        })
})


// send code to microcontroller and saving blockly filee functionality and rendering files from ythe server



app.listen(port, function(){
    console.log("Port Started");
});







