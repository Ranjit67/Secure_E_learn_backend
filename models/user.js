const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema= new mongoose.Schema({
name:{require:true,
type:String
},
email:{
    require:true,
    type:String
},
profilePic:{
    type:String,
    require:true
},
sampuleVideo:{
    require:true,
    type:String
},
github:{
    type:String
},
linkdin:{
    type:String
},
password:{
    type:String,
    required:true
}

});

userSchema.pre("save", async function(next){
    try{
        const salt = await bcrypt.genSalt(10);
        const hasPassword = await bcrypt.hash(this.password, salt);
        this.password= hasPassword;
        next();
    } catch(error){
        next(error)
    }
})


const user =mongoose.model("User",userSchema);

module.exports=user