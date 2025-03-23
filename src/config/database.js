const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://backend:2C2aqLVi1s12X2dr@backend.gn7ch.mongodb.net/");
};

module.exports = connectDB;

