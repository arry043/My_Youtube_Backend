import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinay.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // Steps: (Algorithm)
    // get user data from frontend
    // validate user data
    // check if user already exists (by email or username)
    // check for images & check for avatar
    // upload images to cloudinary and check avatar upload success
    // create user object and save to db
    // remove password and refresh token from response
    // check if user created successfully
    // send response

    const { username, email, fullName, password } = req.body;
    console.log("password: ", password);

    // validate user data
    // if(fullName == "" ){
    //     throw new ApiError(400, 'Full name is required')
    // }
    if (
        [fullName, username, email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // check if user already exists
    const existedUser = await User.findOne({
        $or: [{ email }, { username }],
    });
    if (existedUser) {
        throw new ApiError(
            409,
            "User already exists with this email or username"
        );
    }

    // check for images & check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImgLocalPath = req.files?.coverImg[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    // upload images to cloudinary and check avatar upload success
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImg = await uploadOnCloudinary(coverImgLocalPath);

    if (!avatar?.url) {
        throw new ApiError(500, "Failed to upload avatar image");
    }

    // create user object and save to db
    const user = User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatar.url,
        coverImg: coverImg?.url || "",
    });

    // Check if user created successfully
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Failed to register user");
    }

    // send response
    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User registered successfully")
        );
});

export { registerUser };
