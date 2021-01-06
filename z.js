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