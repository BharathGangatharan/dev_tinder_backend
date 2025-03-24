const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const {userAuth} = require("./middlewares/auth");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const app = express();

//take the user input -> convert express json -> javascript obj
app.use(express.json());
app.use(cookieParser());




//user signup
app.post("/signup", async (req, res) => {

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
app.post("/login", async (req, res) => {


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


app.get("/profile", userAuth, async (req,res) => {

    try {

        const user = req.user;
        res.send(user);

    } catch(err) {

        res.status(400).json({
            msg: err.message
        });
    }
});














// //get user by email id
// app.get("/user", async (req, res) => {

//     const { emailId } = req.body;

//     const getUserByMail = await User.findOne({ emailId: emailId });

//     try {

//         if (!getUserByMail) {
//             // res.status(400).send("No user found");
//             throw new Error ("No user found")
//         } else {
//             res.send(getUserByMail);
//         }

//     } catch (err) {
//         //res.status(400).send("Something went wrong" + err.message)

//         res.status(400).json({
//             msg: "Something went wrong : " + err.message
//         });
//     }

// });

// //get all users
// app.get("/feed", async (req, res) => {

//     const getAllUsers = await User.find({});
//     try {

//         if (getAllUsers.length > 0) {
//             res.send(getAllUsers);
//         } else {
//             throw new Error ("No users found")
//         }

//     } catch (err) {
//         //res.status(400).send("Something went wrong" + err.message);

//         res.status(400).json({
//             msg: "Something went wrong" + err.message
//         });
//     }
// });

// //update users data
// app.patch("/updateData/:userId", async (req, res) => {
//     const userId = req.params?.userId;
//     const userData = req.body;

//     try {

//         const allowedUpdates = ["skills","photoUrl","about","emailId"];
//         const checkUpdates = Object.keys(userData).every((item) => allowedUpdates.includes(item));
    
//         if(!checkUpdates) {
//             throw new Error("Update Not Allowed");
//         }

//         if(userData?.skills.length > 10) {
//             throw new Error("Skills cannot be more than 10");
//         }

//         const updateUserData = await User.findByIdAndUpdate( {_id: userId}, userData, {
//             returnDocument: "after",
//             runValidators: true
//         });


//         // res.send("User Updated Successfully")

//         res.status(200).json({
//             msg: "User Updated Successfully"
//         })

//     } catch(err) {

//         res.status(400).json({
//             msg: "Update Failed : " + err.message
//         });
//     }

// });

// //delete user
// app.delete("/removeUser", async (req,res) => {

//     const removeUser = await User.findByIdAndDelete(req.body.userId);
//     console.log(removeUser)
    
//     try {
//         if(!removeUser) {
//             throw new Error ("User Id is not present")
//         } else {
//             res.status(200).json({
//                 msg: "User removed"
//             })
//         }

//     } catch (err) {
        
//         res.status(400).json({
//             msg: "Unable to remove the user : " + err.message
//         });
//     }

// });




//connect to database
connectDB()
    .then(() => {
        console.log("Database connected successfully!");
        app.listen(3000, () => {
            console.log("App is listening in port 3000")
        });
    })
    .catch((err) => {
        console.log(err);
    });
