//imports
require('dotenv').config({ path: require('find-config')('.env') })
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const axios = require('axios')
const stripe = require('stripe')('sk_test_51KtCf1LVDYVdzLHCA31MSSlOKhe7VQtXqJJiPnJK90sRLsmYU3R5MlTljmTe5AGZTNaKzKF0Fr8BC2fNOsTBgDP100TiYqCU9k') //  secret key for test environment, to be replaced when we start taking orders



  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "");
    const allowedOrigins = ['http://localhost:3000', 'https://bundle.love'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader( 'Access-Control-Allow-Methods', '*')
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
  });


  /*
IMPORT ROUTE CONTROLLERS: 
Note: 
All logic relating to sending or receiving data to or from the Database
should live within the resepective file in the routes folder
*/
const users = require('./routes/users')
const gifts = require('./routes/gifts')
const beta = require('./routes/beta')
const lulu = require('./routes/lulu')
const payment = require('./routes/stripe')
const email = require('./routes/email')
const userID = require('./routes/user_id_check')



//initialization of variables 
const port = process.env.PORT || 3001

//middleware
app.use(express.urlencoded({ extended: true }))

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
app.use("/lulu", lulu) // for all requests that go to the print api
app.use('/stripe', payment);
app.use('/email', email);
app.use('/unique', userID);

// app root route app.get
app.get("/",(req,res)=>{
    console.log('root')
    res.send("APP ROOT")
 
})




//server initialization
app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`)
})

