const express= require("express");
const {verifyToken } = require("../security/jwt_helper");
const createError = require('http-errors');
const user = require("../models/user");

const router=express.Router();

router.post("/dashboard", verifyToken, async (req, res, next)=>{

    try{
        const id = req.paylod
        const doExit =await user.findById(id) 
        if(!doExit) throw necreateError.Unauthorized("You are not exit.")
        res.send("protected boared "+ doExit)

    }catch(error){
        next(error)
    }

   

})


module.exports=router