const express= require("express");
require('dotenv').config();
const mongoose= require("mongoose");
const morgan = require("morgan");
var createError = require('http-errors')
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const request = require('request');


const app = express();
 
// app.use('/api', 
// createProxyMiddleware({ target: 'https://leacturedot.herokuapp.com',

//    changeOrigin: true }));

app.use(morgan("dev"))

// var corsOptions = {
//   origin: 'http://localhost:9000',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// app.use(cors(corsOptions))


// app.use(function (req, res, next) {


//   // Website you wish to allow to connect
//   res.header('Access-Control-Allow-Origin', '*');

//   // Request methods you wish to allow
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

//   // Pass to next layer of middleware
//   next();
// });



// my modification


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/jokes/random', (req, res) => {
  request(
    { url: 'https://leacturedot.herokuapp.com/jokes/random' },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }

      res.send({result:"success"});
    }
  )
});





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



