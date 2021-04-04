import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import AppError from '../errors/AppError';

interface FileFilterCallback {
  (error: Error): void;
  (error: null, acceptFile: boolean): void;
}

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

const directory = tmpFolder;

const storage = multer.diskStorage({
  destination: tmpFolder,
  filename(request, file, callback) {
    const fileHash = crypto.randomBytes(10).toString('hex');
    const fileName = `${fileHash}-${file.originalname}`;
    return callback(null, fileName);
  },
});

function fileFilter(
  request: Express.Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void {
  if (
    file.mimetype === 'text/csv' ||
    file.mimetype === 'application/vnd.ms-excel'
  ) {
    return callback(null, true);
  }
  return callback(null, false);
  // throw new AppError('Formato de arquivo invalido', 401);
}

export default {
  directory,
  storage,
  fileFilter,
};
