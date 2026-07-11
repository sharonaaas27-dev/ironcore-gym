import multer from 'multer';
import path from 'path';
import { config } from '../config';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg|mp4|mov/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter,
});
