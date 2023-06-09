import { Router } from "express";
import {
  forgotPassword,
  changePasswordHandler,
  deleteSessionHandler,
  getUserDetailHandler,
  updateProfileImageHandler,
  searchQueryHandler,
  createSessionHandler,
  OTPVerificationHandler,
  sendOTPHandler,
  createUserHandler,
} from "../controllers/index";
import { postVerify } from "../../middleware/post-verify";
import { uploadImage } from "../../middleware/multer";
import { verifyToken } from "../../middleware/verify-token";

const router = Router();

router.post("/", createUserHandler);
router.post("/session", createSessionHandler);
router.get("/forget-password/:email", forgotPassword);
router.put("/change-password/:token", changePasswordHandler);

router.get("/", postVerify, getUserDetailHandler);
router.delete("/delete-session", postVerify, deleteSessionHandler);
router.patch(
  "/display-image",
  postVerify,
  uploadImage,
  updateProfileImageHandler
);
router.get("/search/:role", postVerify, searchQueryHandler);
router.get("/send-otp/:email", sendOTPHandler);
router.get("/otp-verification/:token/:otp", OTPVerificationHandler);

export default router;
