import mongoose, { mongo }  from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId, // one who is subscribing to a channel
        ref: "User",
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId, // channel to which the subscriber is subscribing
        ref: "User",
    }
}, { timestamps: true });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);