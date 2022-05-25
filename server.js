//imports
require('dotenv').config({ path: require('find-config')('.env') })
const express = require('express')
const app = express()
const mongoose = require('mongoose')


/*
IMPORT ROUTE CONTROLLERS: 
Note: 
All logic relating to sending or receiving data to or from the Database
should live within the resepective file in the routes folder
*/
const users = require('./routes/users')
const gifts = require('./routes/gifts')



//initialization of variables 
const port = process.env.PORT || 3001

//middleware
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



// app root route app.get
app.get("/",(req,res)=>{
    console.log('root')
    res.send("APP ROOT")
})



//server initialization
app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`)
})