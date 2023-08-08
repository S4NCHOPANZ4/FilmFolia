const express = require('express');
const cookieParser = require('cookie-parser');
const ErrorHandler = require('./middleware/error');
const bodyParser = require('body-parser');
const cors = require("cors")
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://film-folia.vercel.app",
    credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));

const user = require("./controller/user");
const movies = require("./controller/movies");
const comments = require("./controller/comments");


app.use("/api/v2/movies", movies)
app.use("/api/v2/user", user)
app.use("/api/v2/comments", comments)
app.use("/test", (req, res) => {
    res.send("hello world!");
})

if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
        path:"./config/.env" 
    })
}



  //err handling
app.use(ErrorHandler)


module.exports = app;