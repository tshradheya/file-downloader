import { downloadFromFTP } from '../bin/ftp';
import chai, { expect } from 'chai';
import fs from 'fs';
import cliProgress from 'cli-progress';

describe('FTP Download Integration', () => {
  const progressBar = new cliProgress.MultiBar({}, cliProgress.Presets.shades_classic);
  it('Download from FTP mock server success', async () => {
    const urlToDownload = 'ftp://demo:password@test.rebex.net/pub/example/KeyGeneratorSmall.png';
    await downloadFromFTP(
      urlToDownload,
      'KeyGeneratorSmall.png',
      './test/resources/KeyGeneratorSmall.png',
      progressBar
    );

    expect(fs.existsSync('./test/resources/KeyGeneratorSmall.png')).to.be.true;

    // Cleanup
    fs.unlinkSync('./test/resources/KeyGeneratorSmall.png');
  }).timeout(100000);

  it('Get failure when auth failed due to wrong credentials', async () => {
    const urlToDownload =
      'ftp://wronguser:password@test.rebex.net/pub/example/KeyGeneratorSmall.png';

    await downloadFromFTP(
      urlToDownload,
      'KeyGeneratorSmall.png',
      './test/resources/KeyGeneratorSmall.png',
      progressBar
    );

    expect(fs.existsSync('./test/resources/KeyGeneratorSmall.png')).to.be.false;
  }).timeout(100000);
});
