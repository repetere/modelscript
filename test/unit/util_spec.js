'use strict';
const jsk = require('../../dist/jskit-learn.cjs');
const expect = require('chai').expect;
const testArray = [20, 25, 10, 33, 50, 42, 19, ];
const vectors = [
  [1, 2, 3,],
  [1, 2, 3,],
  [3, 3, 4,],
  [3, 3, 3,],
];
const arrays = [
  [ 1, 1, 3, 3 ],
  [ 2, 2, 3, 3 ],
  [ 3, 3, 4, 3 ],
];

describe('util', function () { 
  describe('max', () => {
    it('should return max value', () => {
      expect(jsk.util).to.be.an('object');
      expect(jsk.util.max(testArray)).to.equal(50);   
    });
  });
  describe('min', () => {
    it('should return min value', () => {
      expect(jsk.util.min(testArray)).to.equal(10);   
    });
  });
  describe('mean', () => {
    it('should return mean value', () => {
      expect(jsk.util.mean(testArray)).to.equal(jsk.util.sum(testArray) / testArray.length);   
    });
  });
  describe('Log Scaler', () => { 
    it('should return log scaled values', () => {
      const logScaledTestArray = jsk.util.LogScaler(testArray);
      expect(logScaledTestArray[ 0 ]).to.equal(Math.log(testArray[ 0 ]));
      expect(logScaledTestArray[ 3 ]).to.equal(Math.log(testArray[ 3 ]));
    });
  });
  describe('Exponent Scaler', () => {
    it('should return exponent scaled values', () => {
      const expScaledTestArray = jsk.util.ExpScaler(testArray);
      expect(expScaledTestArray[ 0 ]).to.equal(Math.exp(testArray[ 0 ]));
      expect(expScaledTestArray[ 3 ]).to.equal(Math.exp(testArray[ 3 ]));
    });
  });
  describe('Standard Error of the Estimate', () => {
    const actuals = [2, 4, 5, 4, 5, ];
    const estimates = [2.8, 3.4, 4, 4.6, 5.2, ];
    it('should return the Standard Error of the Estimate', () => {
      const SE = jsk.util.standardError(actuals, estimates);
      expect(SE.toFixed(2)).to.eql(0.89.toString());
    });
    it('should return an error if array lengths are not the same', () => {
      try {
        jsk.util.standardError(actuals, [2, ]);
      } catch (e) {
        expect(e).to.be.an('error');
      }
    });
  });
  describe('Coefficient of determination', () => {
    const actuals = [2, 4, 5, 4, 5, ];
    const estimates = [2.8, 3.4, 4, 4.6, 5.2, ];
    it('should return the Coefficient of determination(r squared)', () => {
      const r2 = jsk.util.coefficientOfDetermination(actuals, estimates);
      expect(r2.toFixed(1)).to.eql(0.6.toString());
    });
    it('should return an error if array lengths are not the same', () => {
      try {
        jsk.util.coefficientOfDetermination(actuals, [2, ]);
      } catch (e) {
        expect(e).to.be.an('error');
      }
    });
  });
  describe('pivotVector', () => {
    it('should pivot vectors into arrays', () => {
      const arrays = jsk.util.pivotVector(vectors); // => [ [1,2,3,3], [2,2,3,3], [3,3,4,3] ];
      expect(arrays[ 0 ]).to.be.lengthOf(4);
      expect(arrays[ 0 ]).to.eql([1, 1, 3, 3,]);
      expect(arrays[ 1 ]).to.be.lengthOf(4);
      expect(arrays[ 1 ]).to.eql([2, 2, 3, 3,]);
      expect(arrays[ 2 ]).to.be.lengthOf(4);
      expect(arrays[ 2 ]).to.eql([3, 3, 4, 3,]);
    });
  });
  describe('pivotArrays', () => {
    it('should pivot arrays into vectors', () => {
      const translatedVectors = jsk.util.pivotArrays(arrays);
      expect(translatedVectors).to.eql(vectors);
    });
  });
  describe('Z Scores / Standard Scores', () => {
    it('should calculate standard scores', () => {
      const observations = [
        7, 8, 8, 7.5, 9
      ];
      const zscores = jsk.util.standardScore(observations);
      const roundedZScores = zscores.map(z => parseFloat(z.toFixed(2), 10));
      expect(roundedZScores[ 3 ]).to.eql(-0.54);
      // console.log({ zscores,roundedZScores });
    })
  })
});