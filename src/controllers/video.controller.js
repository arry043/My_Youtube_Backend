import Video from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinay.js";

const getAllVideos = asyncHandler(async (req, res) => {
    // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination
    let page = 1
    let limit = 10

    const videos = await Video.find({}).skip((page - 1) * limit).limit(limit);
    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    // Steps: (Algorithm)
    // get video data from frontend
    // validate video data
    // check for video file
    // upload video to cloudinary and check video upload success
    // create video object and save to db
    // check if video created successfully
    // send response to frontend

    // s-1
    const { title, description } = req.body;

    // s-2
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    // s-3
    // check for video & check for thumbnail
    const videoLocalPath = req.files?.videoFile[0]?.path;

    let thumbnailLocalPath;
    if (req.files?.thumbnail?.length > 0) {
        thumbnailLocalPath = req.files.thumbnail[0].path;
    }

    // s-4
    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    // s-5
    const videoUpload = await uploadOnCloudinary(videoLocalPath);
    const thumbUpload = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoUpload?.url) {
        throw new ApiError(500, "Video upload failed on Cloudinary");
    }
    if (!thumbUpload?.url) {
        throw new ApiError(500, "Thumbnail upload failed on Cloudinary");
    }

    if(!req?.user?._id) {
        throw new ApiError(500, "You are not authenticated");
    }

    // s-6
    const video = await Video.create({
        videoFile: videoUpload.url,
        thumbnail: thumbUpload.url,
        title,
        description,
        duration: videoUpload.duration, // Cloudinary se aata hai usually
        owner: req?.user?._id,
    });

    if (!video) {
        throw new ApiError(500, "Video upload failed");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, video, "Video uploaded successfully"));

});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: get video by id

});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
