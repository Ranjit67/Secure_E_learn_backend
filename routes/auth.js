const express = require("express");
const redis = require("redis");
require("dotenv").config();
const createError = require("http-errors");
const user= require("./../models/user");
const bcrypt = require("bcrypt");
const {signAccesToken, refreshToken, refreshTokenVerify} = require("../security/jwt_helper");
const {authSchema,userSignin } = require("../security/validation");

const router=express.Router();

//
const client = redis.createClient({
  
  url : process.env.REDIS_URL
})
client.auth(process.env.REDIS_PASSWORD);

client.on("connect",()=>{
   console.log("Redis is connected.");
})

client.on("error",(err)=>{
   console.log(err.message);
})

client.on("ready",()=>{
   console.log("Redis is ready to connect.");
})



client.on("end", ()=>{
   console.log("Client is disconnected from redis.");
})

process.on('SIGINT',() =>{
   client.quit()
})

//




router.post("/signup",async (req, res, next)=>{
try{
        const {name, email, github, linkdin, password,profilePic,sampuleVideo}=req.body;
   
          // console.log(name +" "+email +" "+github +" "+linkdin +" "+password +" "+rePassword +" "+profilePic +" "+sampuleVideo);
    if(!email || !name || !password || !profilePic || !sampuleVideo) throw createError.NotAcceptable()
      const result= await authSchema.validateAsync(req.body)
     
        const doExit= await user.findOne({email:result.email});
        if(doExit) throw createError.Conflict();
        const User= new user(result)
        const saver = await User.save();
        if(!saver) throw createError.BadRequest()
        const token = await signAccesToken(saver.id)
        const refresToken= await refreshToken(saver.id)
        res.send({token,refresToken});
    } catch(error){
        next(error)
    }

  
})



// Signin model

router.post("/signin", async (req, res, next)=>{
  try{
   
    const result = await userSignin.validateAsync(req.body)
   
    const doExit = await user.findOne({email:result.email})
    if(!doExit) throw createError.NotFound(result.email+" is not registred.")
    const isMatch =await bcrypt.compare(result.password,doExit.password)
    if(!isMatch) throw createError.Unauthorized()
    
    const token = await signAccesToken(doExit.id)
  const refresToken= await refreshToken(doExit.id)
   res.send({token, refresToken})

  }
  catch(error){
    next(error)
  }
})

// see data 
router.post("/show", async (req, res, next )=>{
try{
  const {id}=req.body
   await client.get(id, (err,result)=>{
    res.send({result})
  })
  // res.send({id})
}catch(error){
  next(error)
}


})

//refresh token handler


router.patch("/refreshtoken", async (req,res,next)=>{
  const {refershToken} = req.body
 
  try{

if( !refershToken ) throw createError.Unauthorized("Somthing going wrong Please login again.")
const getUserId = await refreshTokenVerify(refershToken)
const token = await signAccesToken(getUserId)
const refresToken= await refreshToken(getUserId)
res.send({ token, refresToken })

  }catch(error){
    next(error)
  }
})


// Logout
router.delete("/logout", async ( req, res, next)=>{
try{
const {refreshToken} = req.body
if(!refreshToken) throw createError.Unauthorized()
// res.send({refreshToken})
const userid = await refreshTokenVerify(refreshToken)
client.DEL(userid, (err ,token)=>{
  if(err) throw createError.InternalServerError()
  res.send({message:"Logout successfully."})
})
} catch(error){
next(error)
}

})


module.exports = router;


