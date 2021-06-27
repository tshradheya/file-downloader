import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import Queue from 'queue-promise';
import cliProgress from 'cli-progress';

import { downloadFromFTP } from './ftp';
import { downloadFromSFTP } from './sftp';
import { downloadFromHTTP } from './https';

/**
 * Parse input file and get the list of urls
 * @param {inputPath} inputPath File input Path (Relative/Absolute)
 * @returns array of urls
 */
export const getListOfFiles = (inputPath) => {
  try {
    const text = fs.readFileSync(inputPath).toString('utf-8');
    return text.split('\n');
  } catch (err) {
    throw new Error('Error when reading input', err);
  }
};

/**
 * Get download location path
 * @param {fileName} fileName
 * @param {outputDir} outputDir
 * @returns path of destination file
 */
export const getDownloadLoc = (fileName, outpurDir) => {
  if (path.isAbsolute(outpurDir)) {
    return path.resolve(outpurDir, fileName);
  } else {
    return path.resolve(process.cwd(), outpurDir, fileName);
  }
};

/**
 * Cleanup (delete) file
 * @param {file} file
 */
export const cleanup = (file) => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
};

/**
 * Main code which redirects to required protocol and handles cocnurrency and progress bar
 * @param {filesToDownload} filesToDownload
 * @param {outputDir} outputDir
 */
export const triggerDownloadForFiles = async (filesToDownload, outputDir) => {
  let progressBar;

  const queue = new Queue({
    concurrent: 5,
  });

  for (const url of filesToDownload) {
    if (!url || url.length == 0) {
      console.log(chalk.red(`Skipping ${url}`));
      continue;
    }
    let isUrlValid = true;
    let protocol;
    try {
      protocol = new URL(url).protocol;
    } catch (err) {
      isUrlValid = false;
    }

    if (!isUrlValid) {
      console.log(chalk.red(`Skipping ${url} as invalid URL`));
      continue;
    }

    const fileName = url.split('/').pop();
    const outputFile = getDownloadLoc(fileName, outputDir);
    progressBar = new cliProgress.MultiBar(
      {
        clearOnComplete: false,
        hideCursor: true,
        fps: 10000,
        format:
          `|` +
          chalk.greenBright('{bar}') +
          `|` +
          chalk.cyan(` {userMsg} `) +
          `| {percentage}% | ETA: {eta}s | {value}/{total}`,
      },
      cliProgress.Presets.shades_classic
    );
    let userMsg = `Downloading ${fileName}`;

    switch (protocol) {
      case 'ftp:':
        queue.enqueue(async () => await downloadFromFTP(url, fileName, outputFile, progressBar, userMsg));
        break;
      case 'sftp:':
        queue.enqueue(async () => await downloadFromSFTP(url, fileName, outputFile, progressBar, userMsg));
        break;
      case 'http:':
      case 'https:':
        queue.enqueue(async () => await downloadFromHTTP(url, fileName, outputFile, progressBar, userMsg));
        break;
      default:
        chalk.yellow('Protocol not supported');
    }
  }

  process.on('SIGINT', () => {
    console.log(chalk.red('\nAborting. Deleting all files'));
    for (const url of filesToDownload) {
      const fileName = url.split('/').pop();
      const outputFile = getDownloadLoc(fileName, outputDir);
      cleanup(outputFile);
    }
    process.exit(0);
  });

  return new Promise((resolve, reject) => {
    queue.on('end', () => {
      progressBar.stop();
      console.log(chalk.green(`Bye`));
      resolve();
    });
  });
};
