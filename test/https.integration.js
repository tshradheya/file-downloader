import { downloadFromHTTP } from '../bin/https';
import chai, { expect } from 'chai';
import fs from 'fs';
import cliProgress from 'cli-progress';

describe('HTTP Download Integration', () => {
  const progressBar = new cliProgress.MultiBar({}, cliProgress.Presets.shades_classic);
  it('Download from Github success', async () => {
    const urlToDownload =
      'http://github.com/tshradheya/currency-ranker/archive/refs/tags/v1.0.2.zip';
    await downloadFromHTTP(urlToDownload, 'v1.0.2.zip', './test/resources/v1.0.2.zip', progressBar);

    expect(fs.existsSync('./test/resources/v1.0.2.zip')).to.be.true;

    // Cleanup
    fs.unlinkSync('./test/resources/v1.0.2.zip');
  }).timeout(100000);

  it('Get failure when url is 404', async () => {
    const urlToDownload =
      'http://github.com/tshradheya/currency-ranker/archive/refs/tags/v9.0.2.zip';

    await downloadFromHTTP(urlToDownload, 'v9.0.2.zip', './test/resources/v9.0.2.zip', progressBar);

    expect(fs.existsSync('./test/resources/v9.0.2.zip')).to.be.false;
  });
});

describe('HTTPS Download Integration', () => {
  const progressBar = new cliProgress.MultiBar({}, cliProgress.Presets.shades_classic);
  it('Download from Github success', async () => {
    const urlToDownload =
      'https://github.com/tshradheya/currency-ranker/archive/refs/tags/v1.0.1.zip';
    await downloadFromHTTP(urlToDownload, 'v1.0.1.zip', './test/resources/v1.0.1.zip', progressBar);

    expect(fs.existsSync('./test/resources/v1.0.1.zip')).to.be.true;

    // Cleanup
    fs.unlinkSync('./test/resources/v1.0.1.zip');
  }).timeout(100000);

  it('Get failure when url is 404', async () => {
    const urlToDownload =
      'https://github.com/tshradheya/currency-ranker/archive/refs/tags/v9.0.2.zip';

    await downloadFromHTTP(urlToDownload, 'v9.0.2.zip', './test/resources/v9.0.2.zip', progressBar);

    expect(fs.existsSync('./test/resources/v9.0.2.zip')).to.be.false;
  });
});
