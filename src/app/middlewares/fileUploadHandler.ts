import { S3Client } from '@aws-sdk/client-s3';
import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import multer, { FileFilterCallback } from 'multer';
import multerS3 from 'multer-s3';
import config from '../../config';
import ApiError from '../../errors/ApiError';

const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId as string,
    secretAccessKey: config.aws.secretAccessKey as string,
  },
});

const fileUploadHandler = () => {
  const storage = multerS3({
    s3: s3,
    bucket: config.aws.bucket as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      let folderPath = '';
      const date = Date.now();
      
      if (file.fieldname === 'image') {
        const request = req as any;
        // Check URL to distinguish between Chat and User Profile images
        if (request.originalUrl && request.originalUrl.includes('/chat')) {
          folderPath = 'chat_image';
        } else if (request.originalUrl && (request.originalUrl.includes('/user') || request.originalUrl.includes('/profile'))) {
          folderPath = 'Profile';
        } else {
          folderPath = 'others';
        }
      } else if (file.fieldname === 'media') {
        folderPath = 'media';
      } else if (file.fieldname === 'doc') {
        folderPath = 'chat_pdf';
      } else {
        folderPath = 'others';
      }

      // Sanitize filename
      const sanitizedFileName = file.originalname.replace(/\s+/g, '-').toLowerCase();
      const fileName = `${folderPath}/${date}-${sanitizedFileName}`;
      
      cb(null, fileName);
    },
  });

  const filterFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    if (file.fieldname === 'image') {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
      ) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .jpeg, .png, .jpg file supported'
          )
        );
      }
    } else if (file.fieldname === 'media') {
      if (file.mimetype === 'video/mp4' || file.mimetype === 'audio/mpeg') {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .mp4, .mp3, file supported'
          )
        );
      }
    } else if (file.fieldname === 'doc') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new ApiError(StatusCodes.BAD_REQUEST, 'Only pdf supported'));
      }
    } else {
      cb(new ApiError(StatusCodes.BAD_REQUEST, 'This file is not supported'));
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: filterFilter,
  }).fields([
    { name: 'image', maxCount: 3 },
    { name: 'media', maxCount: 3 },
    { name: 'doc', maxCount: 3 },
  ]);

  return upload;
};

export default fileUploadHandler;
