import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImg,
    getUserChannelProfile,
    getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { veryfyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImg", maxCount: 1 },
    ]),
    registerUser
);

router.route("/login").post(loginUser);
// secured route
router.route("/logout").post(veryfyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(veryfyJWT, changeCurrentPassword);
router.route("/current-user").get(veryfyJWT, getCurrentUser);
router.route("/update-account").patch(veryfyJWT, updateAccountDetails);
router
    .route("/update-avatar")
    .patch(veryfyJWT, upload.single("avatar"), updateUserAvatar);
router
    .route("/update-cover-img")
    .patch(veryfyJWT, upload.single("coverImg"), updateUserCoverImg);
router.route("/c/:username").get(veryfyJWT, getUserChannelProfile);
router.route("/watch-history").get(veryfyJWT, getWatchHistory);

export default router;
