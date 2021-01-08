const express= require("express");
require('dotenv').config();
const mongoose= require("mongoose");
// const morgan = require("morgan");
var createError = require('http-errors')
const cors = require('cors');



const app=express();


// app.use(morgan("dev"))
app.use(cors())

app.get("/", (req,res,next)=>{
  res.send("modan marunu tu.");
})

mongoose.connect(process.env.MONGO_DB,{useNewUrlParser: true ,useUnifiedTopology: true });

mongoose.connection.on("connected",()=>{
    console.log("The data base is connected.");
})
mongoose.connection.on("error",(err)=>{
    console.log(err);
})

app.use(express.json());

//access api middelware 
app.use(async (req, res, next)=> {

  // Website you wish to allow to connect
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.header('Access-Control-Allow-Headers', 'content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.header('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(require("./routes/auth"));


app.use(require("./routes/post"));

app.use(async( req, res, next)=> {
next(createError.NotFound())
})

app.use(async(err, req,res, next) => {
  res.status(err.status || 500);
  res.send({error:{
status:err.status,
    message:err.message
  }})
})



let port = process.env.PORT || 9000;
app.listen(port,"0.0.0.0",function(){
  console.log("The port 9000 is ready to start...");
})



