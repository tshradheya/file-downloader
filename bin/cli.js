import chalk from 'chalk';
import { getListOfFiles } from './utils';
import yargs, { exit } from 'yargs';
import { downloadFromFTP } from './ftp';
import { downloadFromSFTP } from './sftp';

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

if (filesToDownload.length > 0) {
  console.log(chalk.yellow(`Will save ${filesToDownload} mentioned files to ${options.o}`));
}

(async () => {
  for (const url of filesToDownload) {
    if (!url || url.length == 0) {
      console.log(chalk.red(`Skipping ${url}`));
    }
    let protocol = new URL(url).protocol;
    console.log(chalk.green(`Downloading ${url}`));

    switch (protocol) {
      case 'ftp:':
        await downloadFromSFTP(url, options.o);
        break;
      case 'sftp:':
        await downloadFromSFTP(url, options.o);
        break;
    }
  }
  console.log(chalk.green(`Bye`));
  process.exit(0);
})();
