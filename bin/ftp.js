import * as ftp from 'basic-ftp';
import path from 'path';
import chalk from 'chalk';
import { cleanup } from './utils';

export const downloadFromFTP = async (url, fileName, outputFile, progressBar) => {
  const parsedURL = new URL(url);
  try {
    const ftpClient = new ftp.Client();
    await ftpClient.access({
      host: parsedURL.hostname,
      user: parsedURL.username,
      password: parsedURL.password,
      secure: false,
    });

    await ftpClient.cd(path.dirname(parsedURL.pathname));

    const totalSize = await ftpClient.size(fileName);
    const ftpBar = progressBar.create(totalSize, 0, {
      fileName,
    });

    ftpClient.trackProgress((info) => {
      ftpBar.update(info.bytesOverall);
    });
    await ftpClient.downloadTo(outputFile, fileName);
  } catch (err) {
    console.log(chalk.red(`Error downloading from ${url}. Performing cleanup`));
    cleanup(outputFile);
  }
};
