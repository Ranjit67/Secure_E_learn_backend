const express= require("express");
require('dotenv').config();
const mongoose= require("mongoose");
const morgan = require("morgan");
var createError = require('http-errors')
const cors = require('cors');



const app=express();


app.use(morgan("dev"))
app.use(cors())

app.get("/most", (req,res,next)=>{
  res.send({message:"modan marunu tu."});
})

mongoose.connect(process.env.MONGO_DB,{useNewUrlParser: true ,useUnifiedTopology: true });

mongoose.connection.on("connected",()=>{
    console.log("The data base is connected.");
})
mongoose.connection.on("error",(err)=>{
    console.log(err);
})

app.use(express.json());

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




app.listen(9000,function(){
  console.log("The port 9000 is ready to start...");
})



