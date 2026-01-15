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
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
