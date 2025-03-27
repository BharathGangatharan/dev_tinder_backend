const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest =  require("../models/connectionRequest");

const userRouter = express.Router();

const GET_USER_DATA = ["firstName", "lastName", "age", "gender", "skills"];

//get all requests
userRouter.get("/user/requests/received", userAuth, async (req,res) => {

    try {

        const loggedInUser = req.user;

        const findRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", GET_USER_DATA);

        const requestedData = findRequests.map((itm) => itm.fromUserId);

        res.json({
            msg: "Data fetched",
            data: requestedData
        });

    } catch(err) {

        res.status(400).json({
            msg: err.message
        });
    }

});


//accepted data
userRouter.get("/user/myconnections", userAuth, async (req,res) => {

    try {

        const loggedInUser = req.user;

        const findRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted"},
                { fromUserId: loggedInUser._id, status: "accepted"}
            ]
        
        })
        .populate("fromUserId", GET_USER_DATA)
        .populate("toUserId", GET_USER_DATA);

        const requestedData = findRequests.map((itm) => {
            
            if(itm.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return itm.toUserId;
            }

            return itm.fromUserId;
        });

        res.json({
            msg: "Data fetched",
            data: requestedData
        });

    } catch(err) {

        res.status(400).json({
            msg: err.message
        });
    }

});

//show feeds
userRouter.get("/feeds", userAuth, async (req,res) => {

    try {

        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 5;
        limit = limit > 50 ? 50: limit;
        const skip = (page - 1) * limit;

        const connections = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId");


        //hide the user which user sent request, received request, user himself
        const hideUsersFeed = new Set();

        connections.forEach((req) => {
            hideUsersFeed.add(req.fromUserId.toString());
            hideUsersFeed.add(req.toUserId.toString());
        });

        //show remaining users
        const showUsers = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        })
        .select(GET_USER_DATA)
        .skip(skip)
        .limit(limit);


        res.json({
            data: showUsers
        });

    } catch(err) {

        res.status(400).json({
            msg: err.message
        });
    }

});



module.exports = userRouter;