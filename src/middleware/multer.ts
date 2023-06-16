import multer from "multer";
import fs from "fs";
import { CustomRequest } from "../interfaces/interfaces";

// Function to create the directory if it doesn't exist
const createDirectoryIfNotExists = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req: CustomRequest, file, cb) => {
    const uploadPath = "public/images";
    createDirectoryIfNotExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req: CustomRequest, file, cb) => {
    const fileName = `${Date.now()}${file.originalname}`;
    cb(null, fileName);
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

export const uploadImage = (req, res, next) => {
  createDirectoryIfNotExists("public/images");
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    req.file.path = req.file.path.replace(/\\/g, "/");
    next();
  });
};

export const uploadFiles = (req, res, next) => {
  createDirectoryIfNotExists("public/images");
  upload.array("File", 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    req.files.forEach((file) => {
      file.path = file.path.replace(/\\/g, "/");
    });
    next();
  });
};

export const uploadFile = (req, res, next) => {
  createDirectoryIfNotExists("public/images");
  upload.single("File")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    req.file.path = req.file.path.replace(/\\/g, "/");
    next();
  });
};
