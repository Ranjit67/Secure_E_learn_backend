// user id is fixed in the playlist postedBy



await fetch("http://localhost:9000/signup",{ method:"POST",
        body:datas,
        headers: {
            "content-type":"application/x-www-form-urlencoded"
        }
        })

    .then(res=>{
    console.log(res);
    if(res.status===200){
        console.log("Data save succesful.");
    //    return  this.props.history.push("/dashboard")
  this.toastHandler("Data save succesful.","success");
   this.routingFunction();

    } else{
       
        console.log(res.status);
        this.toastHandler("This email id is allready registerd.","warning");
    }
})
.catch((err)=>console.log(err))



// MONGO_DB=mongodb+srv://ranjitSahoo:fEOHYCyQaSOqlunJ@cluster0.omjp2.mongodb.net/LearnDB?retryWrites=true&w=majority


// ACESS_TOKEN=6df0913a6764385ebd2770fc4a7735e3712083080910ae4fa057736b9003df24f4070b35bc60aa10b2f8227dda8723b5c13341f6a989cc2e5039366d65921360


// REFERS_TOKEN=018cdf0b618c7cea2bd8d939296f4d136043589c7d04ed27eb640fbfc4b842e54e73f8d1af0f6b73f421572d7ab3e056dfca04ad8d6ae34464a455c87cad1e0b



// REDIS_PASSWORD =wSABOqg1MuuomQakw2WWxXYNGLfsZOw5


// REDIS_URL = redis://redis-18779.c14.us-east-1-2.ec2.cloud.redislabs.com:18779