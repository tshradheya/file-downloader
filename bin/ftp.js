import * as ftp from 'basic-ftp';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import { cleanup } from './utils';

/**
 * Download using FTP server
 * @param {url} url Input URL
 * @param {fileName} fileName File Name
 * @param {outputFile} outputFile Output file path
 * @param {progressBar} progressBar Progress Bar reference
 */
export const downloadFromFTP = async (url, fileName, outputFile, progressBar) => {
  const parsedURL = new URL(url);
  const ftpBar = progressBar.create(100, 0, { fileName });

  if (fs.existsSync(outputFile)) {
    userMsg = userMsg + ' (Replacing existing)';
    ftpBar.update(null, { userMsg });
  }

  try {
    if (parsedURL.username == null || parsedURL.password == null) {
      throw new Error('Username or password not present');
    }
    const ftpClient = new ftp.Client();
    await ftpClient.access({
      host: parsedURL.hostname,
      port: parsedURL.port || 21,
      user: parsedURL.username,
      password: parsedURL.password,
      secure: false,
    });

    await ftpClient.cd(path.dirname(parsedURL.pathname));

    const totalSize = await ftpClient.size(fileName);
    ftpBar.start(totalSize, 0, { userMsg });

    ftpClient.trackProgress((info) => {
      ftpBar.update(info.bytesOverall);
    });

    await ftpClient.downloadTo(outputFile, fileName);
    ftpBar.stop();
  } catch (err) {
    ftpBar.update(0, {
      userMsg: chalk.red(`Error downloading file ${fileName} due to "${err.message}". Performing cleanup`),
    });
    ftpBar.stop();
    cleanup(outputFile);
  }
};
