import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import multer, { FileFilterCallback } from 'multer';
import ApiError from '../../errors/ApiError';
import { uploadToS3 } from '../../helpers/s3Helper';
import { processImage } from '../../helpers/imageProcessor';

const fileUploadHandler = () => {
  // Use memory storage to process images before uploading
  const storage = multer.memoryStorage();

  const filterFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    if (file.fieldname === 'image' || file.fieldname === 'photos') {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/webp'
      ) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .jpeg, .png, .jpg, .webp file supported'
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
    { name: 'photos', maxCount: 10 },
    { name: 'media', maxCount: 3 },
    { name: 'doc', maxCount: 3 },
  ]);

  // Wrapper middleware to handle processing and S3 upload
  return async (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, async (err: any) => {
      if (err) return next(err);
      if (!req.files) return next();

      try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const uploadPromises: Promise<void>[] = [];

        for (const fieldname of Object.keys(files)) {
          for (const file of files[fieldname]) {
            uploadPromises.push((async () => {
              let folderPath = 'others';
              const date = Date.now();
              const request = req as any;

              // Determine folder path
              if (fieldname === 'image' || fieldname === 'photos') {
                if (request.originalUrl?.includes('/chat')) folderPath = 'chat_image';
                else if (request.originalUrl?.includes('/user') || request.originalUrl?.includes('/profile')) folderPath = 'Profile';
                else if (request.originalUrl?.includes('/jobs')) folderPath = 'job_image';
              } else if (fieldname === 'doc') {
                folderPath = 'chat_pdf';
              } else if (fieldname === 'media') {
                folderPath = 'media';
              }

              let finalBuffer = file.buffer;
              let finalMimetype = file.mimetype;
              let extension = file.originalname.split('.').pop();

              // IMAGE PROCESSING STEP
              if (fieldname === 'image' || fieldname === 'photos') {
                const processed = await processImage(file.buffer);
                finalBuffer = processed.buffer;
                finalMimetype = 'image/webp';
                extension = 'webp';
              }

              const sanitizedName = file.originalname
                .replace(/\.[^/.]+$/, "") // remove extension
                .replace(/\s+/g, '-')
                .toLowerCase();
              
              const key = `${folderPath}/${date}-${sanitizedName}.${extension}`;

              // UPLOAD TO S3 & GET CLOUDFRONT/S3 URL
              const location = await uploadToS3(finalBuffer, key, finalMimetype);
              
              // Attach the URL to the file object so controllers can access it
              (file as any).location = location;
            })());
          }
        }

        await Promise.all(uploadPromises);
        next();
      } catch (error) {
        next(error);
      }
    });
  };
};

export default fileUploadHandler;
