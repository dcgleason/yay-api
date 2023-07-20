const express = require('express');
const router = express.Router();
const Contribution = require("../models/Contribution");
const User = require("../models/User");
const multer = require("multer");
const upload = multer();
const axios = require("axios");
const aws = require("aws-sdk");
require("dotenv").config({ path: require("find-config")(".env") });
const uuid = require("uuid");




module.exports = router;