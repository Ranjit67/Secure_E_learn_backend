const redis = require("redis");

const client = redis.createClient({
  
   url :'redis://redis-18779.c14.us-east-1-2.ec2.cloud.redislabs.com:18779'
})
client.auth("wSABOqg1MuuomQakw2WWxXYNGLfsZOw5");

client.on("connect",()=>{
    console.log("Redis is connected.");
})

client.on("error",(err)=>{
    console.log(err.message);
})

client.on("ready",()=>{
    console.log("Redis is ready to connect.");
})

// client.set("foo","Brase", (err, result)=>{
// if(err) return console.log(err)
// else return console.log("datais inserted")
// })

client.on("end", ()=>{
    console.log("Client is disconnected from redis.");
})

process.on('SIGINT',() =>{
    client.quit()
})

module.export= client;