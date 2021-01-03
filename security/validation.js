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
            .required()
            .min(2), 

github:  joi.string()
.allow(null).allow('').optional(),         
linkdin:joi.string()
.allow(null).allow('').optional(), 

profilePic:joi.string()
.allow(null).allow('').optional(),

sampuleVideo:joi.string()
.allow(null).allow('').optional()
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