import { getListOfFiles } from '../bin/utils';
import chai, { expect } from 'chai';

describe('Utils Functions', () => {
  it('Get files content', () => {
    const files = getListOfFiles('./test/resources/input_file.txt');
    expect(files.length).to.equal(2);
    expect(files[0]).to.equal('abc');
    expect(files[1]).to.equal('def');
  });

  it('Get failure when file not present', () => {
    expect(() => getListOfFiles('./test/resources/file_not_present.txt')).to.throw(
      'Error when reading input'
    );
  });
});
