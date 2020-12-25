const bcrypt= require("bcrypt");

module.exports={
    passwordHash:(password)=>{
        const cripted=bcrypt.hash(password,10);
        if(!cripted) throw console.log("not Cripted.");
        return cripted;
    },
    passwordComapare:(password,user)=>{
        return bycrypt.compare(password,user.password)
    }
}