import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: toggle like on video
    if(!videoId) {
        throw new ApiError(404, "Video not found or deleted");
    }
    const video = await Video.findById(videoId);
    if(!video) {
        throw new ApiError(404, "Video not found or deleted");
    }
    video.likes += 1;
    const updatedVideo = await video.save({
        validateBeforeSave: false,
        new: true,
    });
    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    //TODO: toggle like on comment
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
