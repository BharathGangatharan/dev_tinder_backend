const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        emailId: {
            type: String,
            trim: true,
            lowercase: true,
        },
        password: String,
        age: {
            type: Number,
            min: 18
        },
        gender: String,
        skills: [String],
        photoUrl: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        },
        about: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);