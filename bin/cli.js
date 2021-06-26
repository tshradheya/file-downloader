import chalk from 'chalk';
import yargs from 'yargs';
import { getListOfFiles, triggerDownloadForFiles } from './utils';

console.log(chalk.green.bold('Hello'));

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

const filesToDownload = getListOfFiles(options.i);

if (filesToDownload.length <= 0) {
  console.log(chalk.red(`No files present in ${options.i} to download`));
}

(async () => {
  await triggerDownloadForFiles(filesToDownload, options.o);
  process.exit(0);
})();
