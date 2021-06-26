import { cleanup } from './utils';
import sftpClient from 'ssh2-sftp-client';
import chalk from 'chalk';
import fs from 'fs';

export const downloadFromSFTP = async (url, fileName, outputFile, progressBar, userMsg) => {
  const parsedURL = new URL(url);
  let sftpBar = progressBar.create(100, 0, {
    userMsg,
  });
  if (fs.existsSync(outputFile)) {
    userMsg = userMsg + ' (Replacing existing)';
    sftpBar.update(null, { userMsg });
  }

  try {
    if (parsedURL.username == null || parsedURL.password == null) {
      throw new Error('Username or password not present');
    }
    let sftp = new sftpClient();
    await sftp.connect({
      host: parsedURL.hostname,
      port: parsedURL.port || 22,
      user: parsedURL.username,
      password: parsedURL.password,
    });

    const fileStat = await sftp.stat(parsedURL.pathname);
    sftpBar.start(fileStat.size, 0, {
      userMsg,
    });

    await sftp.fastGet(parsedURL.pathname, outputFile, {
      concurrency: 8,
      chunkSize: 32768,
      step: (total_transferred, chunk, total) => {
        sftpBar.update(total_transferred);
      },
    });

    await sftp.end();
    sftpBar.stop();
  } catch (err) {
    sftpBar.update(0, {
      userMsg: chalk.red(
        `Error downloading file ${fileName} due to "${err.message}". Performing cleanup`
      ),
    });
    sftpBar.stop();
    cleanup(outputFile);
  }
};
