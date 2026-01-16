import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription
    const { channelId } = req.params;
    const userId = req.user?._id;

    if (!channelId) {
        throw new ApiError(400, "Invailid request for subscribe the channel");
    }

    // check if already subscribed
    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId,
    });

    if (existingSubscription) {
        // already subscribed → unsubscribe
        const result = await Subscription.deleteOne(
            { _id: existingSubscription._id },
            { new: true }
        );

        return res
            .status(200)
            .json(new ApiResponse(200, result, "Unsubscribed successfully"));
    }

    // not subscribed → subscribe
    const subscription = await Subscription.create(
        {
            subscriber: userId,
            channel: channelId,
        },

        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, subscription, "Subscribed successfully"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
