/* global it describe */
'use strict';

const chai = require('chai');
const expect = chai.expect;
const segmentum = require('../index');

describe('segmentum require', () => {
  it('should return a function', () => {
    expect(segmentum).to.be.instanceof(Function);
  });
});
