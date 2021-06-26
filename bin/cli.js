import chalk from 'chalk';
import yargs from 'yargs';
import Queue from 'queue-promise';
import cliProgress from 'cli-progress';
import { getDownloadLoc, getListOfFiles } from './utils';
import { downloadFromFTP } from './ftp';
import { downloadFromSFTP } from './sftp';
import { downloadFromHTTP } from './https';

console.log(chalk.green.bold('Hello User'));

const options = yargs
  .usage(chalk.keyword('purple')('Usage: file-downloader -i <file_name> -o <output_dir>'))
  .option('i', {
    alias: 'input_file',
    describe: 'Input file containing list of file to be downloaded',
    type: 'string',
    demandOption: true,
  })
  .option('o', {
    alias: 'output_dir',
    describe: 'Output directory to save all files to',
    type: 'string',
    demandOption: true,
  })
  .help(true).argv;

// console.log(chalk.yellow(`Will save ${options.i} mentioned files to ${options.o}`));

const filesToDownload = getListOfFiles(options.i);

if (filesToDownload.length <= 0) {
  console.log(chalk.red(`No files present in ${options.i} to download`));
}
let progressBar;

const queue = new Queue({
  concurrent: 4,
});

(async () => {
  for (const url of filesToDownload) {
    if (!url || url.length == 0) {
      console.log(chalk.red(`Skipping ${url}`));
      continue;
    }
    let protocol = new URL(url).protocol;
    const fileName = url.split('/').pop();
    const outputFile = getDownloadLoc(fileName, options.o);
    progressBar = new cliProgress.MultiBar(
      {
        clearOnComplete: false,
        hideCursor: true,
        format:
          `|` +
          chalk.blueBright('{bar}') +
          chalk.cyan(`| Download {fileName}`) +
          `| {percentage}% | ETA: {eta}s | {value}/{total}`,
      },
      cliProgress.Presets.shades_classic
    );

    switch (protocol) {
      case 'ftp:':
        queue.enqueue(async () => await downloadFromFTP(url, fileName, outputFile, progressBar));
        break;
      case 'sftp:':
        queue.enqueue(async () => await downloadFromSFTP(url, fileName, outputFile, progressBar));
        break;
      case 'http:':
      case 'https:':
        queue.enqueue(async () => await downloadFromHTTP(url, fileName, outputFile, progressBar));
        break;
      default:
        console.log(chalk.yellow('Protocol not supported'));
    }
  }

  queue.on('end', () => {
    progressBar.stop();
    console.log(chalk.green(`Bye`));
    process.exit(0);
  });
})();
