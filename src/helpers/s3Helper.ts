import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import config from '../config';
import { errorLogger, logger } from '../shared/logger';

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId as string,
    secretAccessKey: config.aws.secretAccessKey as string,
  },
});

export const deleteFromS3 = async (url: string) => {
  try {
    // Extract key from URL
    // Examples: 
    // https://trade-lock.s3.us-east-1.amazonaws.com/Profile/123-img.png
    // Or if it's just a path: Profile/123-img.png
    
    let key = '';
    if (url.startsWith('http')) {
      const urlParts = url.split('.amazonaws.com/');
      if (urlParts.length > 1) {
        key = urlParts[1];
      }
    } else {
      key = url;
    }

    if (!key) return;

    const command = new DeleteObjectCommand({
      Bucket: config.aws.bucket,
      Key: key,
    });

    await s3Client.send(command);
    logger.info(`Deleted from S3: ${key}`);
  } catch (error) {
    errorLogger.error('S3 Deletion Error:', error);
  }
};
