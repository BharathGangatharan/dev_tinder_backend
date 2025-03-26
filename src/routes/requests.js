const express = require("express");
const {userAuth} = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest =  require("../models/connectionRequest");

const requestRouter = express.Router();

//sending connection request

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignored"];

        if(!allowedStatus.includes(status)) {
            throw new Error("Invalid Status type");
        }

        //checking the toUserId is present or not

        const toUser = await User.findById(toUserId);

        if(!toUser) {
            throw new Error("User not found");
        }

        //checking if there is existing connection is present or not

        const checkExisitingConnection = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId},
                { fromUserId: toUserId, toUserId: fromUserId},
            ]
        });

        if(checkExisitingConnection) {
            throw new Error("Connection request already exists");
        }




        const connectionRequest = new ConnectionRequest({fromUserId, toUserId, status})

        const data = await connectionRequest.save();

        const sendMsg = `${status.toLowerCase() === "interested"? "Request sent successfully" : "Request rejected"}`

        res.status(200).json({
            msg: sendMsg,
            data
        });

    } catch(err) {
        res.status(400).json({
            msg: err.message
        });
    }
});

module.exports = requestRouter;