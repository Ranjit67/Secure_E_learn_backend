const express= require("express");
const {verifyToken } = require("../security/jwt_helper");
const createError = require("http-errors");
const User = require("../models/user");
const playlist = require("../models/playlist");

const router=express.Router();

router.post("/dashboard", verifyToken, async (req, res, next)=>{

    try{
        const userid = req.paylod
        const doExit =await playlist.find({postedBy:userid}) 
        // if(!doExit) throw createError.Unauthorized("You are not exit.")
        res.send({dashboard: doExit})

    }catch(error){
        next(error)
    }
})


//create post for the course.
router.post("/createplaylist", verifyToken, async (req, res, next)=>{
    const {title, thumbnail} = req.body


    try{

        if(!title) throw createError.NotAcceptable()
        const userId = req.paylod
        
        const user = await User.findById(userId)
        // res.send(user)
        const doExit = await playlist.findOne({postedBy: userId, title: title})
        if(doExit) throw createError.Conflict("This title is already exit.")
       
        const Playlist = new playlist({
            title,
            thumbnail,
            postedBy:userId
        })
        const savePlaylist = await Playlist.save()
        if(!savePlaylist) throw createError.InternalServerError("check the connection.")
        res.send({savePlaylist})
                                                    //After this route it will redirect to dashboard.
    }catch(error){
        next(error)
    }
})

module.exports=router