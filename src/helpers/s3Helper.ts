import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import config from '../config';
import { errorLogger, logger } from '../shared/logger';

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId as string,
    secretAccessKey: config.aws.secretAccessKey as string,
  },
});

export const uploadToS3 = async (
  fileBuffer: Buffer,
  key: string,
  contentType: string
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Return CloudFront URL if configured, otherwise S3 URL
  if (config.aws.cloudFrontDomain) {
    const domain = config.aws.cloudFrontDomain.endsWith('/') 
      ? config.aws.cloudFrontDomain.slice(0, -1) 
      : config.aws.cloudFrontDomain;
    return `${domain}/${key}`;
  }

  return `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;
};

export const deleteFromS3 = async (url: string) => {
  try {
    let key = '';
    
    // Handle CloudFront or S3 URLs
    if (url.startsWith('http')) {
      if (config.aws.cloudFrontDomain && url.includes(config.aws.cloudFrontDomain)) {
        key = url.split(`${config.aws.cloudFrontDomain}/`)[1];
      } else if (url.includes('.amazonaws.com/')) {
        key = url.split('.amazonaws.com/')[1];
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
