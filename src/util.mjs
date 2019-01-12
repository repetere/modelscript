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
  const SE = ms.util.standardError(actuals, estimates);
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
const r2 = ms.util.coefficientOfDetermination(actuals, estimates); 
r2.toFixed(1) // => 0.6
 * @memberOf util
 * @see {@link https://en.wikipedia.org/wiki/Coefficient_of_determination} {@link http://statisticsbyjim.com/regression/standard-error-regression-vs-r-squared/}
 * @param {Number[]} actuals - numerical samples 
 * @param {Number[]} estimates - estimates values
 * @returns {Number} r^2
 */
function coefficientOfDetermination(actuals = [], estimates = []) {
  if (actuals.length !== estimates.length) throw new RangeError('arrays must have the same length');
  const actualsMean = mean(actuals);

  const totalVariation = sum(actuals.reduce((result, val, index) => {
    result.push(Math.pow((actuals[index]-actualsMean), 2));
    return result;
  }, []));
  const unexplainedVariation = sum(actuals.reduce((result, val, index) => {
    result.push(Math.pow((actuals[ index ] - estimates[ index ]), 2));
    return result;
  }, []));
  const rSquared = ((totalVariation - unexplainedVariation) / totalVariation);

  return rSquared;
  /*
  @see  {@link https://math.tutorvista.com/statistics/coefficient-of-determination.html}
  Some Properties of Coefficient of Determination are as follow:
  It helps to provide the proportion of the variance of one variable which is predictable from the other variable.
  It is a way of measurement which allows determining how clear it can be in making predictions from a certain data provided.
  It can be taken as a ratio of the explained variation to the total variation.
  It denotes the strength of the linear association between the variables.
  The square of the coefficient of determination will always b e between 0 and1, which is 0 ≤
  ≤
  r2 ≤
  ≤
  1. Here r2 will always be a positive value.
  As r2 gets close to 1, the Y data values get close to the regression line.
  As r2 gets close to 0, the Y data values get further from the regression line.
  It helps to provide the proportion of the variance of one variable which is predictable from the other variable.
  It is a way of measurement which allows determining how clear it can be in making predictions from a certain data provided.
  It can be taken as a ratio of the explained variation to the total variation.
  It denotes the strength of the linear association between the variables.
  */  
}

/**
 * You can use the adjusted coefficient of determination to determine how well a multiple regression equation “fits” the sample data. The adjusted coefficient of determination is closely related to the coefficient of determination (also known as R2) that you use to test the results of a simple regression equation.
 * @example
const adjr2 = ms.util.adjustedCoefficentOfDetermination({
  rSquared: 0.944346527,
  sampleSize: 8,
  independentVariables: 2,
}); 
r2.toFixed(3) // => 0.922
 * @memberOf util
 * @see {@link http://www.dummies.com/education/math/business-statistics/how-to-calculate-the-adjusted-coefficient-of-determination/}
 * @param {Object} [options={}] 
 * @param {Number[]} [options.actuals] - numerical samples 
 * @param {Number[]} [options.estimates] - estimate values 
 * @param {Number} [options.rSquared] - coefficent of determination 
 * @param {Number} [options.sampleSize] - the sample size 
 * @param {Number} options.independentVariables - the number of independent variables in the regression equation
 * @returns {Number} adjusted r^2 for multiple linear regression
 */
function adjustedCoefficentOfDetermination(options = {}) {
  const { actuals, estimates, rSquared, independentVariables, sampleSize, } = options;
  const r2 = rSquared || coefficientOfDetermination(actuals, estimates);
  const n = sampleSize || actuals.length;
  const k = independentVariables;

  return (1 - (1 - r2) * ((n - 1) / (n - (k + 1))));
}

/**
 * The coefficent of Correlation is given by R decides how well the given data fits a line or a curve.
 * @example
const actuals = [ 39, 42, 67, 76, ];
const estimates = [ 44, 40, 60, 84, ];
const R = ms.util.coefficientOfCorrelation(actuals, estimates); 
R.toFixed(4) // => 0.9408
 * @memberOf util
 * @see {@link https://calculator.tutorvista.com/r-squared-calculator.html}
 * @param {Number[]} actuals - numerical samples 
 * @param {Number[]} estimates - estimates values
 * @returns {Number} R
 */
function coefficientOfCorrelation(actuals = [], estimates = []) {
  if (actuals.length !== estimates.length) throw new RangeError('arrays must have the same length');
  const sumX = sum(actuals);
  const sumY = sum(estimates);
  const sumProdXY = actuals.reduce((result, val, index) => { 
    result = result + (actuals[ index ] * estimates[ index ]);
    return result;
  }, 0);
  const sumXSquared = actuals.reduce((result, val) => { 
    result = result + (val * val);
    return result;
  }, 0);
  const sumYSquared = estimates.reduce((result, val) => { 
    result = result + (val * val);
    return result;
  }, 0);
  const N = actuals.length;
  const R = (
    (N * sumProdXY - sumX * sumY) /
    Math.sqrt(
      (N * sumXSquared - Math.pow(sumX, 2)) * (N * sumYSquared - Math.pow(sumY, 2))
    )
  );
  return R;
}

/**
 * The coefficent of determination is given by r^2 decides how well the given data fits a line or a curve.
 * 
 * @param {Number[]} [actuals=[]] 
 * @param {Number[]}  [estimates=[]]  
 * @returns {Number} r^2
 */
function rSquared(actuals = [], estimates=[]) {
  return Math.pow(coefficientOfCorrelation(actuals, estimates), 2);
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


/** This function returns two functions that can standard scale new inputs and reverse scale new outputs
 * @param {Number[]} values - array of numbers
 * @returns {Object} - {scale[ Function ], descale[ Function ]}
*/
function StandardScalerTransforms(vector = [], nan_value = -1, return_nan=false) {
  const average = avg(vector);
  const standard_dev = sd(vector);
  const maximum = max(vector);
  const minimum = min(vector);
  const scale = (z) => {
    const scaledValue = (z - average) / standard_dev;
    if (isNaN(scaledValue) && return_nan) return scaledValue;
    else if (isNaN(scaledValue) && return_nan === false) return (isNaN(standard_dev)) ? z : standard_dev;
    else return scaledValue;
  }; // equivalent to MinMaxScaler(z)
  const descale = (scaledZ) => {
    const descaledValue = (scaledZ * standard_dev) + average;
    if (isNaN(descaledValue) && return_nan) return descaledValue;
    else if (isNaN(descaledValue) && return_nan === false) return (isNaN(standard_dev)) ? scaledZ : standard_dev;
    else return descaledValue;
  };
  const values = vector.map(scale)
    .map(val => {
      if (isNaN(val)) return nan_value;
      else return val;
    });
  return {
    components: {
      average,
      standard_dev,
      maximum,
      minimum,
    },
    scale,
    descale,
    values,
  };
}

/**
 * Transforms features by scaling each feature to a given range.
  This estimator scales and translates each feature individually such that it is in the given range on the training set, i.e. between zero and one.
  * @memberOf util
  * @param {number[]} z - array of integers or floats
  * @returns {number[]}
  */
const MinMaxScaler= (z) => scale(z, (max(z) - min(z)));

/** This function returns two functions that can mix max scale new inputs and reverse scale new outputs
 * @param {Number[]} values - array of numbers
 * @returns {Object} - {scale[ Function ], descale[ Function ]}
*/
function MinMaxScalerTransforms(vector = [], nan_value = -1, return_nan=false) {
  const average = avg(vector);
  const standard_dev = sd(vector);
  const maximum = max(vector);
  const minimum = min(vector);
  const scale = (z) => {
    const scaledValue = (z - average) / (maximum - minimum);
    if (isNaN(scaledValue) && return_nan) return scaledValue;
    else if (isNaN(scaledValue) && return_nan === false) return (isNaN(standard_dev)) ? z : standard_dev;
    else return scaledValue;
  }; // equivalent to MinMaxScaler(z)
  const descale = (scaledZ) => {
    const descaledValue = (scaledZ * (maximum - minimum)) + average;
    if (isNaN(descaledValue) && return_nan) return descaledValue;
    else if (isNaN(descaledValue) && return_nan === false) return (isNaN(standard_dev)) ? scaledZ : standard_dev;
    else return descaledValue;
  };
  const values = vector.map(scale)
    .map(val => {
      if (isNaN(val)) return nan_value;
      else return val;
    });
  return {
    components: {
      average,
      standard_dev,
      maximum,
      minimum,
    },
    scale,
    descale,
    values,
  };
}

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
 * returns a safe column name / url slug from a string
 * @param {String} name 
 * @returns {String}
 */
function getSafePropertyName(name) {
  return name.replace(/[^\w\s]/gi, '_');
}

/**
 * The errors (residuals) from acutals and estimates
 * @memberOf util
 * @example
  const actuals = [ 45, 38, 43, 39 ];
  const estimates = [ 41, 43, 41, 42 ];
  const errors = ms.util.forecastErrors(actuals, estimates); // => [ 4, -5, 2, -3 ]
 * @param {Number[]} actuals - numerical samples 
 * @param {Number[]} estimates - estimates values
 * @returns {Number[]} errors (residuals)
 */
function forecastErrors(actuals, estimates) {
  if (actuals.length !== estimates.length) throw new Error(`Actuals length (${actuals.length}) must equal Estimates length (${estimates.length})`);
  return actuals.map((act, i) => act - estimates[ i ]);
}

/**
 * The bias of forecast accuracy
 * @memberOf util
 * @see {@link https://scm.ncsu.edu/scm-articles/article/measuring-forecast-accuracy-approaches-to-forecasting-a-tutorial}
 * @example
  const actuals = [ 45, 38, 43, 39 ];
  const estimates = [ 41, 43, 41, 42 ];
  const MFE = ms.util.meanForecastError(actuals, estimates); // =>  -0.5
 * @param {Number[]} actuals - numerical samples 
 * @param {Number[]} estimates - estimates values
 * @returns {Number} MFE (bias)
 */
function meanForecastError(actuals, estimates) { 
  const errors = forecastErrors(actuals, estimates);
  return avg(errors);
}

/**
 * Mean Absolute Deviation (MAD) indicates the absolute size of the errors
 * @memberOf util
 * @see {@link https://scm.ncsu.edu/scm-articles/article/measuring-forecast-accuracy-approaches-to-forecasting-a-tutorial}
 * @example
  const actuals = [ 45, 38, 43, 39 ];
  const estimates = [ 41, 43, 41, 42 ];
  const MAD = ms.util.meanAbsoluteDeviation(actuals, estimates); // =>  3.5
 * @param {Number[]} actuals - numerical samples 
 * @param {Number[]} estimates - estimates values
 * @returns {Number} MAD
 */
function meanAbsoluteDeviation(actuals, estimates) { 
  const errors = forecastErrors(actuals, estimates).map(e=>Math.abs(e));
  return avg(errors);
}

/**
 * Tracking Signal - Used to pinpoint forecasting models that need adjustment
 * @memberOf util
 * @see {@link https://scm.ncsu.edu/scm-articles/article/measuring-forecast-accuracy-approaches-to-forecasting-a-tutorial}
 * @example
  const actuals = [ 45, 38, 43, 39 ];
  const estimates = [ 41, 43, 41, 42 ];
  const trackingSignal = ms.util.trackingSignal(actuals, estimates); 
  trackingSignal.toFixed(2) // =>  -0.57
 * @param {Number[]} actuals - numerical samples 
 * @param {Number[]} estimates - estimates values
 * @returns {Number} trackingSignal
 */
function trackingSignal(actuals, estimates) {
  const runningSumOfForecastErrors = sum(forecastErrors(actuals, estimates));
  const MAD = meanAbsoluteDeviation(actuals, estimates);
  return runningSumOfForecastErrors / MAD;
}

/**
 * The standard error of the estimate is a measure of the accuracy of predictions made with a regression line. Compares the estimate to the actual value
 * @memberOf util
 * @see {@link http://onlinestatbook.com/2/regression/accuracy.html}
 * @example
  const actuals = [ 45, 38, 43, 39 ];
  const estimates = [ 41, 43, 41, 42 ];   
  const MSE = ms.util.meanSquaredError(actuals, estimates); // => 13.5
 * @param {Number[]} actuals - numerical samples 
 * @param {Number[]} estimates - estimates values
 * @returns {Number} MSE
 */
function meanSquaredError(actuals, estimates) {
  const squaredErrors = forecastErrors(actuals, estimates).map(e=>e*e);
  return avg(squaredErrors);
}

/**
 * MAD over Mean Ratio - The MAD/Mean ratio is an alternative to the MAPE that is better suited to intermittent and low-volume data. As stated previously, percentage errors cannot be calculated when the actual equals zero and can take on extreme values when dealing with low-volume data. These issues become magnified when you start to average MAPEs over multiple time series. The MAD/Mean ratio tries to overcome this problem by dividing the MAD by the Mean—essentially rescaling the error to make it comparable across time series of varying scales
 * @memberOf util
 * @see {@link https://www.forecastpro.com/Trends/forecasting101August2011.html}
 * @example
  const actuals = [ 45, 38, 43, 39 ];
  const estimates = [ 41, 43, 41, 42 ];
  const MMR = ms.util.MADMeanRatio(actuals, estimates);
  MAPE.toFixed(2) // => 0.08
 * @param {Number[]} actuals - numerical samples 
 * @param {Number[]} estimates - estimates values
 * @returns {Number} MMR
 */
function MADMeanRatio(actuals, estimates) {
  const MAD = meanAbsoluteDeviation(actuals, estimates);
  const mean = avg(actuals);
  return MAD / mean;
}

/**
 * MAPE (Mean Absolute Percent Error) measures the size of the error in percentage terms
 * @memberOf util
 * @see {@link https://www.forecastpro.com/Trends/forecasting101August2011.html}
 * @example
  const actuals = [ 45, 38, 43, 39 ];
  const estimates = [ 41, 43, 41, 42 ];
  const MAPE = ms.util.meanAbsolutePercentageError(actuals, estimates);
  MAPE.toFixed(2) // => 0.86
 * @param {Number[]} actuals - numerical samples 
 * @param {Number[]} estimates - estimates values
 * @returns {Number} MAPE
 */
function meanAbsolutePercentageError(actuals, estimates) {
  const errors = forecastErrors(actuals, estimates).map(e=>Math.abs(e));
  const absErrorPercent = errors.map((e, i) => e / actuals[ i ]);
  return avg(absErrorPercent);
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
  StandardScalerTransforms,
  MinMaxScaler,
  MinMaxScalerTransforms,
  LogScaler: (z) => z.map(Math.log),
  ExpScaler: (z) => z.map(Math.exp),
  squaredDifference,
  standardError,
  coefficientOfDetermination,
  coefficientOfCorrelation,
  r: coefficientOfCorrelation,
  rSquared,
  adjustedCoefficentOfDetermination,
  rBarSquared: adjustedCoefficentOfDetermination,
  adjustedRSquared: adjustedCoefficentOfDetermination,
  pivotVector,
  pivotArrays,
  standardScore,
  zScore: standardScore,
  approximateZPercentile,
  // approximatePercentileZ,
  getSafePropertyName,
  forecastErrors,
  meanForecastError,
  MFE: meanForecastError,
  meanAbsoluteDeviation,
  MAD: meanAbsoluteDeviation,
  trackingSignal,
  TS: trackingSignal,
  meanSquaredError,
  MSE: meanSquaredError,
  MADMeanRatio,
  MMR: MADMeanRatio,
  meanAbsolutePercentageError,
  MAPE: meanAbsolutePercentageError,
};