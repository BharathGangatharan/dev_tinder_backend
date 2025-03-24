const express = require("express");
const {userAuth} = require("../middlewares/auth");
const profileRouter = express.Router();

//get profile
profileRouter.get("/profile", userAuth, async (req,res) => {

    try {

        const user = req.user;
        res.send(user);

    } catch(err) {

        res.status(400).json({
            msg: err.message
        });
    }

});

module.exports = profileRouter
