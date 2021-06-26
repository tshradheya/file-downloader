import { downloadFromSFTP } from '../bin/sftp';
import chai, { expect } from 'chai';
import fs from 'fs';
import cliProgress from 'cli-progress';

describe('SFTP Download Integration', () => {
  const progressBar = new cliProgress.MultiBar({}, cliProgress.Presets.shades_classic);
  it('Download from SFTP mock server success', async () => {
    const urlToDownload = 'sftp://demo:demo@demo.wftpserver.com:2222/download/Summer.jpg';
    await downloadFromSFTP(urlToDownload, 'Summer.jpg', './test/resources/Summer.jpg', progressBar);

    expect(fs.existsSync('./test/resources/Summer.jpg')).to.be.true;

    // Cleanup
    fs.unlinkSync('./test/resources/Summer.jpg');
  }).timeout(100000);

  it('Get failure when auth failed due to wrong credentials', async () => {
    const urlToDownload = 'sftp://demo:wrongpass@demo.wftpserver.com:2222/download/Summer.jpg';

    await downloadFromSFTP(urlToDownload, 'Summer.jpg', './test/resources/Summer.jpg', progressBar);

    expect(fs.existsSync('./test/resources/Summer.jpg')).to.be.false;
  }).timeout(100000);
});
