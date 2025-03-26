const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            enum: {
                values: ["interested", "rejected", "ignored", "accepted"],
                message: '${VALUE} is incorrect status type'
            },
            required: true
        }

    }, 
    {
        timestamps: true
    }
);

// giving index for faster Database search
connectionRequestSchema.index({fromUserId: 1, toUserId: 1});


//checking the validation if the user send request to himself before saving
connectionRequestSchema.pre("save", function(next){

    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself");
    }

    next();
});


const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;