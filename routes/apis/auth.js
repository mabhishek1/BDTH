const express = require('express')
const firebase = require('firebase')
const bodyParser = require('body-parser')

const Router = express.Router()


//Importing config of firebase
const config = require("../../config/config")
firebase.initializeApp(config)


//Calling firebase auth and putting it into Auth
const Auth = firebase.auth()

//Calling firebase database
const database = firebase.database()


//bodyparser middlewares
Router.use(bodyParser.urlencoded({ extended: false }))
var urlencodedParser = bodyParser.urlencoded({ extended: false })


Router.get("/",(req,res)=>{
    res.send("Auth route enabled")
})


//@type        POST
//@route        /apis/auth/authWithEmail
//@desc         create an acc for the user and verify it
//access        None        
Router.post("/authWithEmail",(req,res)=>{
    const email = req.body.email    //getting email from body
    const password = req.body.password  //getting password from body
    const phoneNumber = req.body.phonenumber
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    
    //Creating user with emailid and password
    Auth.createUserWithEmailAndPassword(email,password)
        .then((user)=>{

            user.user.displayName = firstName+" "+lastName
            const currentUserId = user.user.uid

            
            //make user email available on the firebase database
            database.ref('/users'+currentUserId).set({
                Name:firstName+" "+lastName,
                EmailId:email,
                Phone:phoneNumber
            })
            .then(()=>{
                user.user.sendEmailVerification()   //emailVerification
                            .then()
                            .catch()
            })
            .catch(err=>console.log("Error in userData"+err))
            
            
        })
        .catch(err=>console.log(err))
        res.send()
})



//@type          POST
//@route        /apis/auth/authwithgoogle
//@desc         signing in the user with google and saving the credentials to the firebase database
//access        None       

Router.post("/authwithgoogle",(req,res)=>{
    const provider = new firebase.auth.GoogleAuthProvider()
    Auth.signInWithPopup(provider)
        .then(obj=>console.log(obj))
        .catch()
})




module.exports = Router