const express = require('express')
const app = express()


const Port = process.env.Port||3000  //defining port


//importing auth apis
const auth = require("./routes/apis/auth")


app.get("/",(req,res)=>{
    res.send("Site up and running")
})


//Calling Auth Api on /api/auth
app.use("/api/auth",auth);


app.listen(Port,()=>console.log(`Server running at port ${Port}`))