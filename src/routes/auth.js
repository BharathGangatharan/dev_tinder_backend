const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

//user signup
authRouter.post("/signup", async (req, res) => {

    const { firstName, lastName, emailId, password, skills, about, age, gender } = req.body;

    try {

        const existingUser = await User.findOne({ emailId: emailId });

        //checking the unique mail id
        if (existingUser) {
            throw new Error("Email Id is already present.")
        }

        //encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            skills,
            age,
            about,
            gender,
            password: passwordHash
        });

        await user.save();
        // res.send("User created successfully!");

        res.status(200).json({
            msg:"User created successfully"
        });

    } catch (err) {
        // res.status(400).send("Error in saving the user" + err.message);

        res.status(400).json({
            msg: "Error in saving the user : " + err.message
        });
    }

});


//user login
authRouter.post("/login", async (req, res) => {


    try {

        const {emailId, password} = req.body;

        const validUser = await User.findOne({emailId: emailId});

        if(!validUser) {
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await validUser.validatePassword(password);

        if(!isPasswordValid) {

            throw new Error("Invalid Credentials");

        } else {

            const token = await validUser.getJWT();

            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000,)
            });

            res.status(200).json({
                msg: "Login Success",
                emailId: validUser.emailId
            });
        }


    } catch(err) {
        // res.status(400).send("Login Error"+ err.message);

        res.status(400).json({
            msg: err.message
        });
    }

});


module.exports = authRouter;