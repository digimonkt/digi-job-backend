import multer from "multer";
import fs from "fs";
import path from "path";
import { CustomRequest } from "../interfaces/interfaces";

const storage = multer.diskStorage({
  destination: (req: CustomRequest, file, cb) => {
    const uploadPath = path.join(__dirname, "../../public", "images");
    console.log({ uploadPath });

    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      }
      cb(null, uploadPath);
    });
  },
  filename: (req: CustomRequest, file, cb) => {
    const uploadPath = path.join(
      __dirname,
      "../../public",
      "images",
      `${req.user._id}`
    );
    console.log({ uploadPath });
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error({ err });
      }
      cb(
        null,
        `${req.user._id}/${Date.now()}${path.extname(file.originalname)}`
      );
    });
  },
});

const fileFilter = (req: CustomRequest, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
  fileFilter,
});

export const uploadImage = upload.single("image");
export const uploadFiles = upload.array("File", 10);
export const uploadFile = upload.single("File");
