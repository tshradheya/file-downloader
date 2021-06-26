import { cleanup } from './utils';
import axios from 'axios';
import fs from 'fs';
import chalk from 'chalk';

export const downloadFromHTTP = async (url, fileName, outputFile, progressBar) => {
  const fd = fs.openSync(outputFile, 'w');

  try {
    const { data, headers } = await axios({
      method: 'GET',
      url,
      responseType: 'stream',
    });

    const totalLength = headers['content-length'] || 100;

    const httpBar = progressBar.create(totalLength, 0, {
      fileName,
    });

    return new Promise((resolve, reject) => {
      data.on('data', (chunk) => {
        fs.writeSync(fd, chunk);
        httpBar.increment(chunk.length);
      });

      data.on('close', async () => {
        // httpBar.stop();
        fs.closeSync(fd);
        resolve(true);
      });

      data.on('error', reject);
    });
  } catch (err) {
    console.log(chalk.red(`Error downloading from ${url}. Performing cleanup`));
    cleanup(outputFile);
  }
};
