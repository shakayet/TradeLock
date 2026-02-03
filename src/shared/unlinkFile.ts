import fs from 'fs';
import path from 'path';
import { deleteFromS3 } from '../helpers/s3Helper';

const unlinkFile = (file: string | undefined) => {
  if (!file) return;

  if (file.startsWith('http')) {
    // S3 URL
    deleteFromS3(file);
  } else {
    // Local File
    const filePath = path.join('uploads', file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

export default unlinkFile;
