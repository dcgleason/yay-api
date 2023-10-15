const express = require("express");
const router = express.Router();
const User = require("../models/User");

//TODO: create the following functionality

// create user : DONE
// find user by id: DONE
// update user info: DONE
// bundle.com/users/
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//GET ROUTES
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//users Home page
router.get("/", (req, res) => {
  res.send("Users home page!!!");
});
// Find user by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({
        userFound: false,
        error: true,
        message: "User not found"
      });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      userFound: false,
      error: true,
      message: "Server error"
    });
  }
});

// Update user's lastEmailed attribute
router.put("/:id/lastEmailed", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({
        userFound: false,
        error: true,
        message: "User not found"
      });
    }
    console.log("user found in lastEmailed update route", user);
    user.lastEmailed = req.body.lastEmailed;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      userFound: false,
      error: true,
      message: "Server error"
    });
  }
});

router.put("/:id/prompts", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.prompts = req.body.prompts;
    user.introNote = req.body.longMessage;
    await user.save();

    res.status(200).json({ message: "Prompts successfully updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update prompts" });
  }
});


//update the user by addign the email and name and intial contributors and prompts 
router.put('/:userId/updateUser', async (req, res) => {
  try {
    // Find the user by userId
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's full name, email, and recipient's name
    user.name = req.body.name;
    user.giftOwnerEmail = req.body.giftOwnerEmail;
    user.recipinet = req.body.rec_name;
    user.recipientFirst = req.body.rec_first_name;
    user.prompts = req.body.prompts;
    user.introNote = req.body.introNote;

    // Save the updated user
    await user.save();

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




router.put("/:id/recipient", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.recipient = req.body.recipientFullName;
    user.recipientFirst = req.body.recipientFirstName;
    await user.save();

    res.status(200).json({ message: "Recipient successfully updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update recipient" });
  }
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//POST ROUTES
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/*
CREATE USER: 
create user is a post route that will accept an object with user data 
as an object and will return the created user object for use on the front end
*/
//TODO: TEST WHETHER THE ASSOCIATEDIDS ARRAY IS ABLE TO RECEIVE INFO
router.post("/create", (req, res) => {
  User.create(req.body, (err, createdUser) => {
    if (err) {
      console.log(err.message);
      // handle error
      const error = {
        userFound: false,
        error: true,
        message: "error could not create user",
      };
    }
    console.log("created the following user in DB", createdUser);

    res.send(createdUser);
  });
});

// update user info
//when updating from the front end , must pull the original object, then
//push a new item to the gifts array and then use this route.
//this route will REPLACE VALUES especially in the associatedGifts array
router.put("/update/:id", (req, res) => {
  console.log("heres what we got..............", "\n", req.body);
  User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.log(err.message); // handle error
        const error = {
          userUpdated: false,
          error: true,
          message: "error could not update user",
        };
        res.status(400).send(error);
      }
      console.log("updated the following user in DB", updatedUser);

      res.send(updatedUser);
    }
  );
});

module.exports = router;
