import { default as ml, } from 'ml';
import { default as range, } from 'lodash.range';
import { default as rangeRight, } from 'lodash.rangeright';

const avg = ml.ArrayStat.mean;
const mean = avg;
const sum = ml.ArrayStat.sum;
const scale = (a, d) => a.map(x => (x - avg(a)) / d);
const max = a => a.concat([]).sort((x, y) => x < y)[0];
const min = a => a.concat([]).sort((x, y) => x > y)[0];
const sd = ml.ArrayStat.standardDeviation; //(a, av) => Math.sqrt(avg(a.map(x => (x - av) * x)));


/**
 * Returns an array of the squared different of two arrays
 * @memberOf util
 * @param {Number[]} left 
 * @param {Number[]} right 
 * @returns {Number[]} Squared difference of left minus right array
 */
function squaredDifference(left, right) {
  return left.reduce((result, val, index, arr) => { 
    result.push(Math.pow((right[index]-val), 2));
    return result;
  }, []);
}

/**
 * The standard error of the estimate is a measure of the accuracy of predictions made with a regression line. Compares the estimate to the actual value
 * @memberOf util
 * @see {@link http://onlinestatbook.com/2/regression/accuracy.html}
 * @example
  const actuals = [ 2, 4, 5, 4, 5, ];
  const estimates = [ 2.8, 3.4, 4, 4.6, 5.2, ];
  const SE = jsk.util.standardError(actuals, estimates);
  SE.toFixed(2) // => 0.89
 * @param {Number[]} actuals - numerical samples 
 * @param {Number[]} estimates - estimates values
 * @returns {Number} Standard Error of the Estimate
 */
function standardError(actuals=[], estimates=[]) {
  if (actuals.length !== estimates.length) throw new RangeError('arrays must have the same length');
  const squaredDiff = squaredDifference(actuals, estimates);
  return Math.sqrt((sum(squaredDiff)) / (actuals.length - 2));
}

/**
 * Calculates the z score of each value in the sample, relative to the sample mean and standard deviation.
 * @memberOf util
 * @see {@link https://docs.scipy.org/doc/scipy-0.14.0/reference/generated/scipy.stats.mstats.zscore.html}
 * @param {Number[]} observations - An array like object containing the sample data.
 * @returns {Number[]} The z-scores, standardized by mean and standard deviation of input array 
 */
function standardScore(observations = []) {
  const mean = avg(observations);
  const stdDev = sd(observations);
  return observations.map(x => ((x - mean) / stdDev));
}

/**
 * In statistics, the coefficient of determination, denoted R2 or r2 and pronounced "R squared", is the proportion of the variance in the dependent variable that is predictable from the independent variable(s). Compares distance of estimated values to the mean.
 * {\bar {y}}={\frac {1}{n}}\sum _{i=1}^{n}y_{i}
 * @example
const actuals = [ 2, 4, 5, 4, 5, ];
const estimates = [ 2.8, 3.4, 4, 4.6, 5.2, ];
const r2 = jsk.util.coefficientOfDetermination(actuals, estimates); 
r2.toFixed(1) // => 0.6
 * @memberOf util
 * @see {@link https://en.wikipedia.org/wiki/Coefficient_of_determination} {@link http://statisticsbyjim.com/regression/standard-error-regression-vs-r-squared/}
 * @param {Number[]} actuals - numerical samples 
 * @param {Number[]} estimates - estimates values
 * @returns {Number} r^2
 */
function coefficientOfDetermination(actuals=[], estimates=[]) {
  if (actuals.length !== estimates.length) throw new RangeError('arrays must have the same length');
  const actualsMean = mean(actuals);
  const meanActualsDiffSquared = actuals.map(a => Math.pow(a - actualsMean, 2));
  const meanEstimatesDiffSquared = estimates.map(e => Math.pow(e - actualsMean, 2));
  return (sum(meanEstimatesDiffSquared) / sum(meanActualsDiffSquared));
}

/**
 * returns an array of vectors as an array of arrays
 * @example
const vectors = [ [1,2,3], [1,2,3], [3,3,4], [3,3,3] ];
const arrays = pivotVector(vectors); // => [ [1,2,3,3], [2,2,3,3], [3,3,4,3] ];
 * @memberOf util
 * @param {Array[]} vectors 
 * @returns {Array[]}
 */
function pivotVector(vectors=[]) {
  return vectors.reduce((result, val, index/*, arr*/) => {
    val.forEach((vecVal, i) => {
      (index === 0)
        ? (result.push([vecVal, ]))
        : (result[ i ].push(vecVal));
    });
    return result;
  }, []);
} 

/**
 * returns a matrix of values by combining arrays into a matrix
 * @memberOf util
 * @example 
  const arrays = [
    [ 1, 1, 3, 3 ],
    [ 2, 2, 3, 3 ],
    [ 3, 3, 4, 3 ],
  ];
  pivotArrays(arrays); //=>
  // [
  //   [1, 2, 3,],
  //   [1, 2, 3,],
  //   [3, 3, 4,],
  //   [3, 3, 3,],
  // ];
  * @param {Array} [vectors=[]] - array of arguments for columnArray to merge columns into a matrix
  * @returns {Array} a matrix of column values 
  */
function pivotArrays(arrays = []) {
  return (arrays.length)
    ? arrays[ 0 ].map((vectorItem, index) => {
      const returnArray = [];
      arrays.forEach((v, i) => {
        returnArray.push(arrays[ i ][ index ]);
      });
      return returnArray;
    })
    : arrays;
}

/**
  * Standardize features by removing the mean and scaling to unit variance

  Centering and scaling happen independently on each feature by computing the relevant statistics on the samples in the training set. Mean and standard deviation are then stored to be used on later data using the transform method.

  Standardization of a dataset is a common requirement for many machine learning estimators: they might behave badly if the individual feature do not more or less look like standard normally distributed data (e.g. Gaussian with 0 mean and unit variance)
  * @memberOf util
  * @param {number[]} z - array of integers or floats
  * @returns {number[]}
  */
const StandardScaler = (z) => scale(z, sd(z));


/**
 * Transforms features by scaling each feature to a given range.
  This estimator scales and translates each feature individually such that it is in the given range on the training set, i.e. between zero and one.
  * @memberOf util
  * @param {number[]} z - array of integers or floats
  * @returns {number[]}
  */
const MinMaxScaler= (z) => scale(z, (max(z) - min(z)));

/**
  * Converts z-score into the probability
  * @memberOf util
  * @see {@link https://stackoverflow.com/questions/36575743/how-do-i-convert-probability-into-z-score}
  * @param {number} z - Number of standard deviations from the mean.
  * @returns {number} p  - p-value
  */
function approximateZPercentile(z, alpha=true) {
  // If z is greater than 6.5 standard deviations from the mean
  // the number of significant digits will be outside of a reasonable 
  // range.
  if (z < -6.5)
    return 0.0;

  if (z > 6.5)
    return 1.0;

  let factK    = 1;
  let sum      = 0;
  let term     = 1;
  let k        = 0;
  let loopStop = Math.exp(-23);
   
  while (Math.abs(term) > loopStop) {
    term = 0.3989422804 * Math.pow(-1, k) * Math.pow(z, k) / (2 * k + 1) /
            Math.pow(2, k) * Math.pow(z, k + 1) / factK;
    sum += term;
    k++;
    factK *= k;
  }

  sum += 0.5;

  return (alpha) ? 1 - sum : sum;
}

/**
 * @namespace
 */
export const util = {
  range,
  rangeRight,
  scale,
  avg,
  mean: avg,
  sum,
  max,
  min,
  sd,
  StandardScaler,
  MinMaxScaler,
  LogScaler: (z) => z.map(Math.log),
  ExpScaler: (z) => z.map(Math.exp),
  squaredDifference,
  standardError,
  coefficientOfDetermination,
  rSquared: coefficientOfDetermination,
  pivotVector,
  pivotArrays,
  standardScore,
  zScore: standardScore,
  approximateZPercentile,
  // approximatePercentileZ,
};