//imports
require('dotenv').config({ path: require('find-config')('.env') })
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const axios = require('axios')
const queryString = require('querystring')


/*
IMPORT ROUTE CONTROLLERS: 
Note: 
All logic relating to sending or receiving data to or from the Database
should live within the resepective file in the routes folder
*/
const users = require('./routes/users')
const gifts = require('./routes/gifts')
const beta = require('./routes/beta')



//initialization of variables 
const port = process.env.PORT || 3001

//middleware
app.use(express.urlencoded({ extended: true }))
//cors


// db connection - mongo atlas
const connectDB = async ()=>{
    await mongoose.connect(
        process.env.DB_URI,
                { useUnifiedTopology: true, useNewUrlParser: true },
                (err)=> {
                    if (err) {
                        console.log("could not connect to mongodb atlas" + '\n' + err)
                    }else {
                        console.log("connected to mongo")
                    }
                    
                }
            )
            
            }
//execute connection
connectDB()


// app route controllers - app.use
app.use("/users", users);
app.use("/gifts", gifts)
app.use("/beta", beta)



// app root route app.get
app.get("/",(req,res)=>{
    console.log('root')
    res.send("APP ROOT")

    
})


/**
 * /api/token route retrieves a jwt for access to the lulu print api
 * this access_token must be sent with all subsequent requests
 */
app.get('/api/token', async (req,res)=>{
    console.log("attempting lulu api authentication.........\n")
    

    const baseurl = "https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token"
    const data = new URLSearchParams()
    data.append('client_key', process.env.CLIENT_KEY)
    data.append('client_secret', process.env.CLIENT_SECRET)
    data.append('grant_type', 'client_credentials')


await axios({
    method: 'post',
    url: baseurl,
    data: data,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': process.env.AUTH,
    },

}).then((response)=>{
    console.log(response.data)
    console.log('this is the access token....... \n' + `access token: \n ${response.data.access_token}`)
    res.send(response.data)
})




})



//server initialization
app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`)
})