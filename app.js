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

 app.post("/login", function(req, res) {
    var finduser = req.body.username;
    var password = req.body.password;
    Client.findOne({ username: finduser }).then(function(client) {
        if (!client) {
            return res.sendStatus(404); // Not Found
        }
        bcrypt.compare(password, client.password).then(function(result) {
            if (result) {
                return res.status(200).sendFile(__dirname + "/HTML/Dashboard.html");
            } else {
                return res.sendStatus(401); // Unauthorized
            }
        }).catch(function(err) {
            console.error(err);
            return res.sendStatus(500);
        });
    }).catch(function(err) {
        console.error(err);
        return res.sendStatus(500);
    });
});



app.post("/signup",function(req,res){
   var username=req.body.username;
   var password=req.body.password;
   var email=req.body.email;
   Client.findOne({username:username}).then(function(client){
    if (client) {
        return res.sendStatus(500);
        // return res.sendStatus(404); // Not Found
    }else{
        bcrypt.hash(password, 10, function(err, bHash) {
            const newUser = new Client({
              email: email,
              username: username,
              password: bHash
            });
        }).catch(function(err) {
            console.error(err);
            return res.sendStatus(500);
        });
            newUser.save();   
            return res.status(200).sendFile(__dirname + "/HTML/Dashboard.html"); 
    }
   }).catch(function(err) {
        console.error(err);
        return res.sendStatus(500);
    });
});

// send code to microcontroller and saving blockly filee functionality and rendering files from ythe server



app.listen(port, function(){
    console.log("Port Started");
});







