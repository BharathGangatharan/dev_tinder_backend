const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        emailId: {
            type: String,
            trim: true,
            lowercase: true,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            min: 18,
            required: true
        },
        gender:  {
            type: String,
            required: true
        },
        skills: [String],
        photoUrl: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        },
        about:  {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

//getting jwt token
userSchema.methods.getJWT = async function() {

    const user = this;
    const token  = await jwt.sign({_id: user._id}, "dev_tinder@", {expiresIn : "7d"});
    return token;
}


//validating the password which is decrypted
userSchema.methods.validatePassword = async function(userInputPassword) {

    const user = this;
    const passwordHash = user.password

    const passwordValid = await bcrypt.compare(userInputPassword, passwordHash);

    return passwordValid;
}

module.exports = mongoose.model("User", userSchema);