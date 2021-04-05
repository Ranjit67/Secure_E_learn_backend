const jwt = require("jsonwebtoken");
const user = require("../models/user");
require("dotenv").config();
const createError = require("http-errors");
const redis = require("redis");
// const client = require("./int_healper");

const client = redis.createClient({
  url: process.env.REDIS_URL,
});
client.auth(process.env.REDIS_PASSWORD);

client.on("connect", () => {
  console.log("Redis is connected.");
});

client.on("error", (err) => {
  console.log(err.message);
});

client.on("ready", () => {
  console.log("Redis is ready to connect.");
});

client.on("end", () => {
  console.log("Client is disconnected from redis.");
});

process.on("SIGINT", () => {
  client.quit();
});

module.exports = {
  signAccesToken: (userid) => {
    return new Promise((resolev, reject) => {
      const palode = {
        iss: "DoteLearner.com",
        name: "Your trust.",
      };
      const secreat = process.env.ACESS_TOKEN;
      const options = {
        audience: userid,
        expiresIn: "30h",
      };
      jwt.sign(palode, secreat, options, (err, token) => {
        if (err) return console.log(err.message);

        resolev(token);
      });
    });
  },
  verifyToken: async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return next(createError.Unauthorized());

    jwt.verify(token, process.env.ACESS_TOKEN, (err, paylod) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(createError.MethodNotAllowed("Token has expired.")); //status code 407
        } else {
          return next(createError.Unauthorized("token has erase."));
        }
      }

      req.paylod = paylod.aud;
      next();
    });
  },

  refreshToken: function (userid) {
    return new Promise((resolev, reject) => {
      const palode = {
        iss: "DoteLearner.com",
        name: "Your trust.",
      };
      const secreat = process.env.REFERS_TOKEN;
      const options = {
        audience: userid,
        expiresIn: "1y",
      };
      jwt.sign(palode, secreat, options, (err, token) => {
        if (err) return console.log(err.message);
        client.set(userid, token, "EX", 24 * 60 * 60, (err, result) => {
          if (err) {
            return reject(err);
          } else {
            console.log("data inserted");
          }
        });
        resolev(token);
      });
    });
  },

  refreshTokenVerify: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFERS_TOKEN, (err, paylod) => {
        if (err) return reject(err);
        const userId = paylod.aud;

        client.GET(userId, (err, payrol) => {
          if (err) {
            console.log(err);
            reject(createError.InternalServerError());
            return;
          }
          if (payrol === refreshToken) return resolve(userId);
          reject(createError.Unauthorized());
        });
      });
    });
  },
};

//process.env.REFERS_TOKEN

// client.SET(userid, token, 'EX', 365 * 24 * 60 * 60, (err,replay)=>{
//                     if(err) {
//                         console.log(err);
//                          reject(createError.InternalServerError())
//                         }
//                         resolve(token);
//                 })

// return new Promise((resolev, reject)=>{
//     const palode={
//         iss:"DoteLearner.com",
//         name:"Your trust."
//     }
//     const secreat = process.env.REFERS_TOKEN
//     const options = {
//         audience: userid,
//         expiresIn:"1y"
//     }
//     jwt.sign(palode, secreat, options, (err, token)=>{
//         if(err) return console.log(err.message)

//         resolev(token)
//     })
// })
