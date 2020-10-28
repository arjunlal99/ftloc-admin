var express = require("express")
var app = express()
app.set('view engine', 'pug')
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended : false}))
var crypto = require('crypto')
require('dotenv').config()
var cookieParser = require('cookie-parser')
app.use(cookieParser())


// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCB94lxWzQsQXMXP7bCGUdUPv0h6KnrXRE",
    authDomain: "fortheloveofcinema-b7da3.firebaseapp.com",
    databaseURL: "https://fortheloveofcinema-b7da3.firebaseio.com",
    projectId: "fortheloveofcinema-b7da3",
    storageBucket: "fortheloveofcinema-b7da3.appspot.com",
    messagingSenderId: "474064188949",
    appId: "1:474064188949:web:56f2634b95cfcbaec2801c",
    measurementId: "G-GFPPW48W5C"
  };
firebase.initializeApp(firebaseConfig)




var mongoose = require('mongoose')
var Schema = mongoose.Schema
var conn = mongoose.createConnection(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology:true})

conn.on('connected', ()=>{
    console.log("Admin Connection successful")

})

conn.on('disconnected' , ()=>{
    console.log("Admin Connection disconnected")
})


var adminSchema = new Schema({
    username: String,
    password: String
})

var adminModel = conn.model('admin', adminSchema)

app.get("/admin", (req,res)=>{

    res.render("login")

})

app.get("/cookie", (req,res) => {
    console.log(req.cookies.abcd)
})


app.post("/login", (req,res)=>{

    firebase.auth().signInWithEmailAndPassword(req.body.username, req.body.password).then(() => {
        res.redirect("/admin/dashboard")
    }).catch((error) => console.log(error))


/*
    adminModel.find({username: req.body.username},(err,docs) => {
        if (err){
            console.log(err)
            res.redirect("/admin")
        }
        else if (docs.length == 0){
            console.log(docs)
            console.log("User not found")
            res.redirect("/admin")
        }
        else{
            //console.log(docs)
            console.log(docs.length)
            console.log(crypto.createHash('sha256').update(req.body.password).digest('hex'))
            if (docs[0].password == crypto.createHash('sha256').update(req.body.password).digest('hex')){
                
                res.redirect("/admin/dashboard")
            }
            else{
                console.log("wrong password")
                res.redirect("/admin")
            }
        }
    })

    console.log(req.body.username)
    var hash = crypto.createHash('sha256').update(req.body.username).digest('hex')
    console.log(hash)
*/
})


app.post("/logout", (req,res) => {
    firebase.auth().signOut().then(() => {
        res.redirect("/admin")
    }).catch(err => console.log(err))
})


app.get("/admin/dashboard", (req,res) => {
    var user = firebase.auth().currentUser

    if (user) {
        res.render('dashboard')
    }
    else{
        res.redirect("/admin")
    }


})


//listener

var listener = app.listen(4001, () => console.log("Admin listening at port ", listener.address().port))