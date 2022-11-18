const express = require('express')
const router = express.Router()


//users Home page
router.get('/',(req, res)=>{
    res.send("Users home page!!!")
})

//find user by id
router.get("/:id", async (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      console.log(err.message);
      const error = {
        userFound: false,
        error: true,
        message: "error could not find user",
      };
      res.status(400).send(error);
    } else {
      res.send(user);
    }
  });
});


    // implications of this is that a requester could select the questions he wants to ask, along with prompts. 
})

router.get('/about', (req,res)=>{
    res.send("About Users page")
})

module.exports = router