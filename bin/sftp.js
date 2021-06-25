import path from 'path';
import { cleanup, getDownloadLoc } from './utils';
import sftpClient from 'ssh2-sftp-client';
import cliProgress from 'cli-progress';

export const downloadFromSFTP = async (url, outputDir) => {
  const fileName = url.split('/').pop();
  const outputFile = getDownloadLoc(fileName, outputDir);
  const parsedURL = new URL(url);

  const sftpBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  try {
    let sftp = new sftpClient();
    await sftp.connect({
      host: parsedURL.hostname,
      user: 'demo',
      password: 'password',
    });

    const fileStat = await sftp.stat(parsedURL.pathname);
    sftpBar.start(fileStat.size, 0);

    await sftp.fastGet(parsedURL.pathname, outputFile, {
      concurrency: 8,
      chunkSize: 32768,
      step: (total_transferred, chunk, total) => {
        sftpBar.update(total_transferred);
      },
    });

    sftpBar.stop();

    await sftp.end();
  } catch (err) {
    console.log(err);
    console.log(`Error downloading from ${url}. Performing cleanup`);
    cleanup(outputFile);
  }
};
