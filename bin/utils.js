import fs from 'fs';

export const getListOfFiles = (inputPath) => {
  try {
    const text = fs.readFileSync(inputPath).toString('utf-8');
    return text.split('\n');
  } catch (err) {
    throw new Error('Error when reading input', err);
  }
};
