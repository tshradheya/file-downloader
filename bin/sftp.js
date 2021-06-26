import { cleanup } from './utils';
import sftpClient from 'ssh2-sftp-client';
import chalk from 'chalk';

export const downloadFromSFTP = async (url, fileName, outputFile, progressBar) => {
  const parsedURL = new URL(url);

  try {
    let sftp = new sftpClient();
    await sftp.connect({
      host: parsedURL.hostname,
      user: parsedURL.username,
      password: parsedURL.password,
    });

    const fileStat = await sftp.stat(parsedURL.pathname);
    const sftpBar = progressBar.create(fileStat.size, 0, {
      fileName,
    });

    await sftp.fastGet(parsedURL.pathname, outputFile, {
      concurrency: 8,
      chunkSize: 32768,
      step: (total_transferred, chunk, total) => {
        sftpBar.update(total_transferred);
      },
    });

    await sftp.end();
  } catch (err) {
    console.log(chalk.red(`Error downloading from ${url}. Performing cleanup`));
    cleanup(outputFile);
  }
};
