//imports
require("dotenv").config({ path: require("find-config")(".env") });
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
var bodyParser = require("body-parser");
const cors = require("cors");

const axios = require("axios");
const stripe = require("stripe")(process.env.STRIPE_SECRET); //  secret live
const uri = "mongodb+srv://dcgleason:F1e2n3n4!!@yay-cluster01.lijs4.mongodb.net/?retryWrites=true&w=majority";

// app.use((req, res, next) => {
   
//     //    const allowedOrigins = ['http://localhost:3000', 'https://bundle.love', 'https://www.bundle.love', 'https://www.usebundle.co', 'https://usebunde.co', 'https://usebundle.co/messages', 'https://www.usebundle.co/messages', 'https://www.usebundle.co/'];
//     //    const origin = req.headers.origin.toString();
//     //    if (allowedOrigins.includes(origin)) {
       
//     //    }
       
//     //     console.log('origin' + origin);
//         res.header('Access-Control-Allow-Origin', 'https://www.usebundle.co');
//         res.header( 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
//         res.header("Access-Control-Allow-Headers", "Accept, Content-Type, x-requested-with");
//         next();
//       });
const allowedOrigins = ["https://www.givebundl.com", "https://givebundl.com", "http://localhost:3000", "http://localhost:3001", "https://wwww.usebundl.com", "https://usebundl.com"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set EJS as templating engine
app.set("view engine", "ejs");

// app.use((req, res, next) => {
    // const allowedOrigins = ['http://localhost:3000', 'https://bundle.love', 'https://www.bundle.love', 'https://www.usebundle.co', 'https://usebunde.co', 'https://usebundle.co/messages', 'https://www.usebundle.co/messages', 'https://www.usebundle.co/'];
  //    const origin = req.headers.origin.toString();
  //    if (allowedOrigins.includes(origin)) {

  //    }

  //     console.log('origin' + origin);
//   res.setHeader("Access-Control-Allow-Origin",  "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Accept, Content-Type, x-requested-with"
//   );
//   next();
// });

const corsOption = {
  origin:  ["https://www.givebundl.com, https://givebundl.com", "http://localhost:3000", "http://localhost:3001", "https://wwww.usebundl.com", "https://usebundl.com"],
  credentials: true
}
app.use(cors(corsOption))

/*
IMPORT ROUTE CONTROLLERS: 
Note: 
All logic relating to sending or receiving data to or from the Database
should live within the resepective file in the routes folder
*/
const users = require("./routes/users");
const gifts = require("./routes/gifts");
const beta = require("./routes/beta");
const lulu = require("./routes/lulu");
const payment = require("./routes/stripe");
const email = require("./routes/email");
const userID = require("./routes/check");
const contribution = require("./routes/contribution");
const login = require('./routes/login');
const openai = require('./routes/openai');

//initialization of variables
const port = process.env.PORT || 3001;

//middleware
app.use(express.urlencoded({ extended: true }));

// db connection - mongo atlas
const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://dcgleason:F1e2n3n4!!@yay-cluster01.lijs4.mongodb.net/?retryWrites=true&w=majority',
    { useUnifiedTopology: true, useNewUrlParser: true },
    (err) => {
      if (err) {
        console.log("could not connect to mongodb atlas" + "\n" + err);
      } else {
        console.log("connected to mongo");
      }
    }
  );
};
//execute connection
connectDB();

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

// app route controllers - app.use
app.use("/users", users);
app.use("/gifts", gifts);
app.use("/login", login);
app.use("/beta", beta);
app.use("/lulu", lulu); // for all requests that go to the print api
app.use("/stripe", payment);
app.use("/email", email);
app.use("/unique", userID);
app.use("/contribution", contribution);
app.use("/openai", openai);

// app root route app.get
app.get("/", (req, res) => {
  console.log("root");
  res.send("APP ROOT");
});

//server initialization
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


exports.connectDB = connectDB;
