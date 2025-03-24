const express = require("express");
const {userAuth} = require("../middlewares/auth");
const { validateProfileData } = require("../utils/validation");
const profileRouter = express.Router();

//get profile
profileRouter.get("/profile/view", userAuth, async (req,res) => {

    try {

        const user = req.user;
        res.send(user);

    } catch(err) {

        res.status(400).json({
            msg: err.message
        });
    }

});

//edit profile
profileRouter.patch("/profile/edit", userAuth, async (req,res) => {

    try {

        if(!validateProfileData(req)) {

            throw new Error("Invalid edit request");

        } else {

            const loggedInUser = req.user;
            Object.keys(req.body).forEach((key) =>  loggedInUser[key] = req.body[key])

            await loggedInUser.save();

            res.status(200).json({
                msg: loggedInUser.firstName + ", your profile updated successfully"
            });
        }

    } catch(err) {

        res.status(400).json({
            msg: err.message
        });
    }

});


module.exports = profileRouter;
