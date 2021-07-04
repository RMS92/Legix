import { v4 as uuidv4 } from 'uuid';
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

export const customStorage = async (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, destination: string) => void,
) => {
  // @ts-ignore
  const username = req.user.username;
  const mkdirAsync = promisify(fs.mkdir);
  const existsAsync = promisify(fs.exists);
  const destination = `../frontend/public/media/uploads/scans/${username}`;

  const exists = await existsAsync(destination);

  if (!exists) {
    await mkdirAsync(path.resolve(destination));
  }
  callback(null, destination);
};

export const renameFilename = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  const [, ext] = file.mimetype.split('/');
  const filename: string = `${uuidv4()}.${ext}`;
  callback(null, filename);
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
    return callback(new Error('Only jpeg image files are allowed'), false);
  }
  callback(null, true);
};
