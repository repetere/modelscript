
const ms = require('../../dist/modelscript.cjs');
const expect = require('chai').expect;
const testArray = [20, 25, 10, 33, 50, 42, 19,];
const vectors = [
  [1, 2, 3, ],
  [1, 2, 3, ],
  [3, 3, 4, ],
  [3, 3, 3, ],
];
const arrays = [
  [1, 1, 3, 3,],
  [2, 2, 3, 3,],
  [3, 3, 4, 3,],
];

describe('util', function () { 
  describe('max', () => {
    it('should return max value', () => {
      expect(ms.util).to.be.an('object');
      expect(ms.util.max(testArray)).to.equal(50);   
    });
  });
  describe('min', () => {
    it('should return min value', () => {
      expect(ms.util.min(testArray)).to.equal(10);   
    });
  });
  describe('mean', () => {
    it('should return mean value', () => {
      expect(ms.util.mean(testArray)).to.equal(ms.util.sum(testArray) / testArray.length);   
    });
  });
  describe('Log Scaler', () => { 
    it('should return log scaled values', () => {
      const logScaledTestArray = ms.util.LogScaler(testArray);
      expect(logScaledTestArray[ 0 ]).to.equal(Math.log(testArray[ 0 ]));
      expect(logScaledTestArray[ 3 ]).to.equal(Math.log(testArray[ 3 ]));
    });
  });
  describe('Exponent Scaler', () => {
    it('should return exponent scaled values', () => {
      const expScaledTestArray = ms.util.ExpScaler(testArray);
      expect(expScaledTestArray[ 0 ]).to.equal(Math.exp(testArray[ 0 ]));
      expect(expScaledTestArray[ 3 ]).to.equal(Math.exp(testArray[ 3 ]));
    });
  });
  describe('Standard Error of the Estimate', () => {
    const actuals = [2, 4, 5, 4, 5,];
    const estimates = [2.8, 3.4, 4, 4.6, 5.2,];
    it('should return the Standard Error of the Estimate', () => {
      const SE = ms.util.standardError(actuals, estimates);
      expect(SE.toFixed(2)).to.eql(0.89.toString());
    });
    it('should return an error if array lengths are not the same', () => {
      try {
        ms.util.standardError(actuals, [2,]);
      } catch (e) {
        expect(e).to.be.an('error');
      }
    });
  });
  describe('Coefficient of correlation', () => {
    const actuals = [ 39, 42, 67, 76, ];
    const estimates = [ 44, 40, 60, 84, ];
    it('should return the Coefficient of correlation', () => {
      const R = ms.util.coefficientOfCorrelation(actuals, estimates);
      expect(R.toFixed(4)).to.eql(0.9408.toString());

    });
    it('should return an error if array lengths are not the same', () => {
      try {
        ms.util.coefficientOfCorrelation(actuals, [2,]);
      } catch (e) {
        expect(e).to.be.an('error');
      }
    });
  });
  describe('rSquared', () => {
    const actuals = [ 39, 42, 67, 76, ];
    const estimates = [ 44, 40, 60, 84, ];
    it('should return r^2', () => {
      const R = ms.util.coefficientOfCorrelation(actuals, estimates);
      const rSquared = ms.util.rSquared(actuals, estimates);
      const COD = ms.util.coefficientOfDetermination(actuals, estimates);
      expect(Math.pow(R, 2)).to.eql(rSquared);
      expect(rSquared.toFixed(1)).to.eql(COD.toFixed(1));
    });
  });
  describe('Coefficient of determination', () => {
    const actuals = [2, 4, 5, 4, 5,];
    const estimates = [2.8, 3.4, 4, 4.6, 5.2,];
    it('should return the Coefficient of determination', () => {
      const r2 = ms.util.coefficientOfDetermination(actuals, estimates);
      expect(r2.toFixed(1)).to.eql(0.6.toString());
    });
    it('should return an error if array lengths are not the same', () => {
      try {
        ms.util.coefficientOfDetermination(actuals, [2,]);
      } catch (e) {
        expect(e).to.be.an('error');
      }
    });
  });
  describe('adjusted coefficient of determination', () => {
    it('should return the adjusted Coefficient of determination', () => {
      const adjr2 = ms.util.adjustedCoefficentOfDetermination({
        rSquared: 0.944346527,
        sampleSize: 8,
        independentVariables: 2,
      }); 
      expect(adjr2.toFixed(3)).to.eql(0.922.toString());
    });
  });
  describe('pivotVector', () => {
    it('should pivot vectors into arrays', () => {
      const arrays = ms.util.pivotVector(vectors); // => [ [1,2,3,3], [2,2,3,3], [3,3,4,3] ];
      expect(arrays[ 0 ]).to.be.lengthOf(4);
      expect(arrays[ 0 ]).to.eql([1, 1, 3, 3, ]);
      expect(arrays[ 1 ]).to.be.lengthOf(4);
      expect(arrays[ 1 ]).to.eql([2, 2, 3, 3, ]);
      expect(arrays[ 2 ]).to.be.lengthOf(4);
      expect(arrays[ 2 ]).to.eql([3, 3, 4, 3, ]);
    });
  });
  describe('pivotArrays', () => {
    it('should pivot arrays into vectors', () => {
      const translatedVectors = ms.util.pivotArrays(arrays);
      expect(translatedVectors).to.eql(vectors);
    });
  });
  describe('Z Scores / Standard Scores', () => {
    it('should calculate standard scores', () => {
      const observations = [
        7, 8, 8, 7.5, 9,
      ];
      const zscores = ms.util.standardScore(observations);
      const roundedZScores = zscores.map(z => parseFloat(z.toFixed(2), 10));
      expect(roundedZScores[ 3 ]).to.eql(-0.54);
      // console.log({ zscores,roundedZScores });
    });
    it('should approximate the p-value from the z score', () => { 
      const z1 = 2.87;
      const z2 = 1.96;
      const p1 = parseFloat(ms.util.approximateZPercentile(z1).toFixed(3), 10);
      const p2 = parseFloat(ms.util.approximateZPercentile(z2).toFixed(3), 10);
      const p3 = parseFloat(ms.util.approximateZPercentile(z1, false).toFixed(3), 10);
      const p4 = parseFloat(ms.util.approximateZPercentile(z2, false).toFixed(3), 10);
      expect(p1).to.eql(0.002);
      expect(p3).to.eql(0.998);
      expect(p2).to.eql(0.025);
      expect(p4).to.eql(0.975);
    });
  });
});