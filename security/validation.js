const joi =require("joi");


const authSchema= joi.object({
email:joi.string()
        .email()
        .lowercase()
        .required(),
password:joi.string()
            .min(8)
            .required(),
name: joi.string()
.alphanum()
.min(3)
.max(30)
.required(), 
github:  joi.string()
.alphanum(),         
linkdin:joi.string()
.alphanum(), 

profilePic:joi.string()
.min(2)
.required(),

sampuleVideo:joi.string()
.min(2)
.required()
});

const userSignin =joi.object({
    email:joi.string()
            .email()
            .lowercase()
            .required(),
    password:joi.string()
                .min(8)
                .required()
    });

module.exports={
    authSchema,
    userSignin
}