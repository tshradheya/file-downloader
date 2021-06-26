import fs from 'fs';
import path from 'path';

export const getListOfFiles = (inputPath) => {
  try {
    const text = fs.readFileSync(inputPath).toString('utf-8');
    return text.split('\n');
  } catch (err) {
    throw new Error('Error when reading input', err);
  }
};

export const getProtocolFromUrl = (url) => {
  return url.split(':')[0];
};

export const getDownloadLoc = (fileName, outpurDir) => {
  if (path.isAbsolute(outpurDir)) {
    return path.resolve(outpurDir, fileName);
  } else {
    return path.resolve(process.cwd(), outpurDir, fileName);
  }
};

export const cleanup = (file) => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
};
