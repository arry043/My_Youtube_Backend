import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body;

    if(!content) {
        throw new ApiError(400, "Content is required");
    }

    const user = req?.user;

    if(!user) {
        throw new ApiError(401, "User is not authenticated");
    }

    const owner = await User.findById(user?._id).select(
        "-password -refreshToken -watchHistory -coverImg -email -createdAt -updatedAt"
    )

    const tweet = await Tweet.create({
        content,
        owner: owner
    })

    await tweet.save();

    return res
    .status(200)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.params?.userId;

    const tweets = await Tweet.find({ owner: userId })
    .populate("owner", "-password -refreshToken -watchHistory -coverImg -email -createdAt -updatedAt")
    .sort({ createdAt: -1 });

    // console.log("all tweets: ",tweets)

    if(tweets.length === 0) {
        throw new ApiError(404, "No tweets found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    const { content } = req.body;

    if(!content) {
        throw new ApiError(400, "Content is required");
    }

    if(!tweetId) {
        throw new ApiError(400, "Tweet id is required");
    }

    const tweet = await Tweet.findByIdAndUpdate(tweetId, { content }, { new: true });

    if(!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;

    if(!tweetId) {
        throw new ApiError(400, "Tweet id is required");
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId);

    if(tweet?.owner?._id.toString() !== req?.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet");
    }

    if(!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
