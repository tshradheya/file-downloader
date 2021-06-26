import { triggerDownloadForFiles } from '../bin/utils';
import chai, { expect } from 'chai';

describe('E2E Tests', () => {
  it('Download 0 files', async () => {
    const filesToDownload = [];
    const outputDir = '/tmp';

    expect(async () => await triggerDownloadForFiles(filesToDownload, outputDir)).to.not.throw;
  });

  it('Download 2 files', async () => {
    const filesToDownload = [
      'https://github.com/CS2103AUG2017-W14-B1/main/archive/refs/tags/V1.5.1.zip',
      'https://github.com/CS2103AUG2017-W14-B1/main/archive/refs/tags/V1.4.zip',
    ];
    const outputDir = '/tmp';

    expect(async () => await triggerDownloadForFiles(filesToDownload, outputDir)).to.not.throw;
  }).timeout(100000);
});
