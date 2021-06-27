import { cleanup } from './utils';
import axios from 'axios';
import fs from 'fs';
import chalk from 'chalk';

/**
 * Download using HTTP/HTTPS protocol
 * @param {url} url Input URL
 * @param {fileName} fileName File Name
 * @param {outputFile} outputFile Output file path
 * @param {progressBar} progressBar Progress Bar reference
 */
export const downloadFromHTTP = async (url, fileName, outputFile, progressBar, userMsg) => {
  const httpBar = progressBar.create(100, 0, { userMsg });
  if (fs.existsSync(outputFile)) {
    userMsg = userMsg + ' (Replacing existing)';
    httpBar.update(null, { userMsg });
  }
  const fd = fs.openSync(outputFile, 'w');

  try {
    const { data, headers } = await axios({
      method: 'GET',
      url,
      responseType: 'stream',
    });

    let totalLength = headers['content-length'];
    let isContentLengthPresent = false;
    if (totalLength) {
      isContentLengthPresent = true;
    }
    let interval;

    if (isContentLengthPresent) {
      httpBar.start(totalLength, 0, { userMsg });
    } else {
      httpBar.start(100, 0, { userMsg });

      // Note: This is to mock for user. Hacky but this is what Firefox also does
      interval = setInterval(() => {
        httpBar.increment(1);
      }, 1000);
    }

    return new Promise((resolve, reject) => {
      data.on('data', (chunk) => {
        fs.writeSync(fd, chunk);
        if (isContentLengthPresent) {
          httpBar.increment(chunk.length);
        }
      });

      data.on('close', async () => {
        if (!isContentLengthPresent) {
          clearInterval(interval);
          httpBar.update(100);
        }
        httpBar.stop();
        fs.closeSync(fd);
        resolve();
      });

      data.on('error', () => {
        fs.closeSync(fd);
        reject();
      });
    });
  } catch (err) {
    httpBar.update(0, {
      fileName: chalk.red(`Error downloading file ${fileName} due to "${err.message}". Cleanup done`),
    });
    httpBar.stop();
    cleanup(outputFile);
  }
};
