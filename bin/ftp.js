import * as ftp from 'basic-ftp';
import path from 'path';
import { cleanup, getDownloadLoc } from './utils';
import cliProgress from 'cli-progress';

export const downloadFromFTP = async (url, outputDir) => {
  const fileName = url.split('/').pop();
  const outputFile = getDownloadLoc(fileName, outputDir);
  const parsedURL = new URL(url);
  const ftpBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  try {
    const ftpClient = new ftp.Client();
    await ftpClient.access({
      host: parsedURL.hostname,
      user: 'demo',
      password: 'password',
      secure: false,
    });

    await ftpClient.cd(path.dirname(parsedURL.pathname));

    const totalSize = await ftpClient.size(fileName);
    ftpBar.start(totalSize, 0);

    ftpClient.trackProgress((info) => {
      ftpBar.update(info.bytesOverall);
    });
    await ftpClient.downloadTo(outputFile, fileName);
    ftpBar.stop();
  } catch (err) {
    console.log(err);
    console.log(`Error downloading from ${url}. Performing cleanup`);
    cleanup(outputFile);
  }
};
