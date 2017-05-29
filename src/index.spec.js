import validate from './';
import chai from 'chai';

const expect = chai.expect;

describe('index', () => {
  it('should return empty object', () => {
    expect(validate({}, {})).to.be.eql({});
  });
});