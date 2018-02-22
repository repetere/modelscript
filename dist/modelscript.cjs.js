'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var http = require('http');
var https = require('https');
var validURL = _interopDefault(require('valid-url'));
var csv = _interopDefault(require('csvtojson'));
var MachineLearning = _interopDefault(require('ml'));
var range = _interopDefault(require('lodash.range'));
var rangeRight = _interopDefault(require('lodash.rangeright'));
var nodeFpgrowth = require('node-fpgrowth');
var ObjectValues = _interopDefault(require('object.values'));
var probabilty = require('probability-distributions');
var mlRandomForest = require('ml-random-forest');
var LogisticRegression = _interopDefault(require('ml-logistic-regression'));
var mlCart = require('ml-cart');
var mlNaivebayes = require('ml-naivebayes');
var MultivariateLinearRegression = _interopDefault(require('ml-regression-multivariate-linear'));
var PCA = _interopDefault(require('ml-pca'));
var natural = _interopDefault(require('natural'));
var Random = _interopDefault(require('random-js'));
var jsGridSearchLite = require('js-grid-search-lite');

/**
 * Asynchronously loads a CSV from a remote URL and returns an array of objects
 * @example
 * // returns [{header:value,header2:value2}]
 * loadCSVURI('https://raw.githubusercontent.com/repetere/modelscript/master/test/mock/data.csv').then(csvData).catch(console.error)
 * @memberOf csv
 * @param {string} filepath - URL to CSV path
 * @param {Object} [options] - options passed to csvtojson
 * @returns {Object[]} returns an array of objects from a csv where each column header is the property name  
 */
function loadCSVURI$1(filepath, options) {
  const reqMethod = (filepath.search('https', 'gi') > -1) ? https.get : http.get;
  return new Promise((resolve, reject) => {
    const csvData = [];
    const req = reqMethod(filepath, res => {
      csv(options).fromStream(res)
        .on('json', jsonObj => {
          csvData.push(jsonObj);
        })
        .on('error', err => {
          return reject(err);
        })
        .on('done', error => {
          if (error) {
            return reject(error);
          } else {
            return resolve(csvData);
          }
        });
    });
    req.on('error', reject);
  });
}


/**
 * Asynchronously loads a CSV from either a filepath or remote URL and returns an array of objects
 * @example
 * // returns [{header:value,header2:value2}]
 * loadCSV('../mock/invalid-file.csv').then(csvData).catch(console.error)
 * @memberOf csv
 * @param {string} filepath - URL to CSV path
 * @param {Object} [options] - options passed to csvtojson
 * @returns {Object[]} returns an array of objects from a csv where each column header is the property name  
 */
function loadCSV$1(filepath, options) {
  if (validURL.isUri(filepath)) {
    return loadCSVURI$1(filepath, options);
  } else {
    return new Promise((resolve, reject) => {
      const csvData = [];
      csv(options).fromFile(filepath)
        .on('json', jsonObj => {
          csvData.push(jsonObj);
        })
        .on('error', err => {
          return reject(err);
        })
        .on('done', error => {
          if (error) {
            return reject(error);
          } else {
            return resolve(csvData);
          }
        });
    });
  }
}

/**
 * Asynchronously loads a TSV from either a filepath or remote URL and returns an array of objects
 * @example
 * // returns [{header:value,header2:value2}]
 * loadCSV('../mock/invalid-file.tsv').then(csvData).catch(console.error)
 * @memberOf csv
 * @param {string} filepath - URL to CSV path
 * @param {Object} [options] - options passed to csvtojson
 * @returns {Object[]} returns an array of objects from a csv where each column header is the property name  
 */
function loadTSV(filepath, options) {
  const tsvOptions = Object.assign({}, options, {
    delimiter: '\t',
  });
  return loadCSV$1(filepath, tsvOptions);
}


var csvUtils = Object.freeze({
	loadCSVURI: loadCSVURI$1,
	loadCSV: loadCSV$1,
	loadTSV: loadTSV
});

const avg = MachineLearning.ArrayStat.mean;
const mean = avg;
const sum = MachineLearning.ArrayStat.sum;
const scale = (a, d) => a.map(x => (x - avg(a)) / d);
const max = a => a.concat([]).sort((x, y) => x < y)[0];
const min = a => a.concat([]).sort((x, y) => x > y)[0];
const sd = MachineLearning.ArrayStat.standardDeviation; //(a, av) => Math.sqrt(avg(a.map(x => (x - av) * x)));


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
function coefficientOfDetermination(actuals=[], estimates=[]) {
  if (actuals.length !== estimates.length) throw new RangeError('arrays must have the same length');
  const actualsMean = mean(actuals);
  const meanActualsDiffSquared = actuals.map(a => Math.pow(a - actualsMean, 2));
  const meanEstimatesDiffSquared = estimates.map(e => Math.pow(e - actualsMean, 2));
  return (sum(meanEstimatesDiffSquared) / sum(meanActualsDiffSquared));
}

/**
 * The coefficent of determination is given by R2 decides how well the given data fits a line or a curve.The correlation R formula is
 * @example
const actuals = [ 39, 42, 67, 76, ];
const estimates = [ 44, 40, 60, 84, ];
const r2 = ms.util.coefficientOfCorrelation(actuals, estimates); 
r2.toFixed(3) // => 0.885
 * @memberOf util
 * @see {@link https://calculator.tutorvista.com/r-squared-calculator.html}
 * @param {Number[]} actuals - numerical samples 
 * @param {Number[]} estimates - estimates values
 * @returns {Number} r^2
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
  const rSquared = Math.pow(R, 2);
  return rSquared;
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
const util$1 = {
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
  coefficientOfCorrelation,
  rSquared: coefficientOfCorrelation,
  pivotVector,
  pivotArrays,
  standardScore,
  zScore: standardScore,
  approximateZPercentile,
  // approximatePercentileZ,
};

if (!Object.values) {
  ObjectValues.shim();
}

/**
 * Formats an array of transactions into a sparse matrix like format for Apriori/Eclat
 * @memberOf calc
 * @see {@link https://github.com/alexisfacques/Node-FPGrowth}
 * @param {Array} data - CSV data of transactions 
 * @param {Object} options 
 * @param {Boolean} [options.exludeEmptyTranscations=true] - exclude empty rows of transactions 
 * @returns {Object} {values - unique list of all values, valuesMap - map of values and labels, transactions - formatted sparse array}
 */
function getTransactions(data, options) {
  const config = Object.assign({}, {
    exludeEmptyTranscations: true,
  }, options);
  const values = new Set();
  const valuesMap = new Map();
  const transactions = data
    .map(csvRow => {
      [
        ...Object.values(csvRow),
      ].forEach(csvVal => {
        values.add(csvVal);
      });
      values.forEach(val => {
        if (!valuesMap.get(val)) {
          const index = (valuesMap.size < 0)
            ? 0
            : parseInt(valuesMap.size / 2, 10);
          valuesMap.set(val, index.toString());
          valuesMap.set(index.toString(), val);
        }
      });
      return Object.values(csvRow)
        .map(csvCell =>
          valuesMap.get(csvCell))
        .filter(val => val !== undefined);
    });
  return {
    values,
    valuesMap,
    transactions: (config.exludeEmptyTranscations)
      ? transactions.filter(csvRow => csvRow.length)
      : transactions,
  };
}

/**
 * returns association rule learning results
 * @memberOf calc
 * @see {@link https://github.com/alexisfacques/Node-FPGrowth}
 * @param {Array} transactions - sparse matrix of transactions 
 * @param {Object} options 
 * @param {Number} [options.support=0.4] - support level
 * @param {Number} [options.minLength=2] - minimum assocation array size
 * @param {Boolean} [options.summary=true] - return summarized results
 * @param {Map} [options.valuesMap=new Map()] - map of values and labels (used for summary results)
 * @returns {Object} Returns the result from Node-FPGrowth or a summary of support and strong associations
 */
function assocationRuleLearning(transactions =[], options) {
  return new Promise((resolve, reject) => {
    try {
      const config = Object.assign({}, {
        support: 0.4,
        minLength: 2,
        summary: true,
        valuesMap: new Map(),
      }, options);
      const fpgrowth = new nodeFpgrowth.FPGrowth(config.support);
      fpgrowth.exec(transactions)
        .then(results => {
          if (config.summary) {
            resolve(results.itemsets
              .map(itemset => ({
                items_labels: itemset.items.map(item => config.valuesMap.get(item)),
                items: itemset.items,
                support: itemset.support,
                support_percent: itemset.support / transactions.length,
              }))
              .filter(itemset => itemset.items.length > 1)
              .sort((a, b) => b.support - a.support));
          } else {
            resolve(results);
          }
        })
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * @namespace
 */
const calc$1 = {
  getTransactions,
  assocationRuleLearning,
};

/**
 * @namespace
 * @see {@link https://github.com/Mattasher/probability-distributions} 
 */
const PD$1 = Object.assign({}, probabilty);

/**
 * base interface class for reinforced learning
 * @class ReinforcedLearningBase
 * @memberOf ml
 */
class ReinforcedLearningBase{
  /**
   * base class for reinforced learning
   * @param {Object} [options={}]
   * @prop {Number} options.bounds - number of bounds / bandits
   * @prop {Function} options.getBound - get value of bound
   * @prop {Number} this.bounds - number of bounds / bandits
   * @prop {Array} this.last_selected - list of selections
   * @prop {Number} this.total_reward - total rewards
   * @prop {Number} this.iteration - total number of iterations
   * @returns {this} 
   */
  constructor(options = {}) {
    this.bounds = options.bounds || 5;
    this.getBound = options.getBound || function getBound(bound) {
      return bound;
    };
    this.last_selected = [];
    this.total_reward = 0;
    this.iteration = 0;
    return this;
  }
  /** 
   * interface instance method for reinforced learning step
  */
  learn() {
    throw new ReferenceError('Missing learn method implementation');
  }
  /** 
   * interface instance method for reinforced training step
  */
  train() {
    throw new ReferenceError('Missing train method implementation');
  }
  /** 
   * interface instance method for reinforced prediction step
  */
  predict() {
    throw new ReferenceError('Missing predict method implementation');
  }
}

/**
 * Implementation of the Upper Confidence Bound algorithm
 * @class UpperConfidenceBound
 * @memberOf ml
 */
class UpperConfidenceBound extends ReinforcedLearningBase{
  /**
   * creates a new instance of the Upper confidence bound(UCB) algorithm. UCB is based on the principle of optimism in the face of uncertainty, which is to choose your actions as if the environment (in this case bandit) is as nice as is plausibly possible
   * @see {@link http://banditalgs.com/2016/09/18/the-upper-confidence-bound-algorithm/}
   * @example
   * const dataset = new ms.ml.UpperConfidenceBound({bounds:10});
   * @param {Object} [options={}]
   * @prop {Map} this.numbers_of_selections - map of all bound selections
   * @prop {Map} this.sums_of_rewards - successful bound selections
   * @returns {this} 
   */
  constructor(options = {}) {
    super(options);
    this.numbers_of_selections = new Map();
    this.sums_of_rewards = new Map();
    for (let i = 0; i < this.bounds; i++){
      this.numbers_of_selections.set(i, 0);
      this.sums_of_rewards.set(i, 0);
    }
    return this;
  }
  /**
   * returns next action based off of the upper confidence bound
   * @return {number} returns bound selection
   */
  predict() {
    let ad = 0; //ad is each bandit
    let max_upper_bound = 0;
    for (let i = 0; i < this.bounds; i++){
      let upper_bound = 1e400;
      if (this.numbers_of_selections.get( i ) > 0) {
        // if selected at least once
        let average_reward = this.sums_of_rewards.get( i ) / this.numbers_of_selections.get( i );
        let delta_i = Math.sqrt(3 / 2 * Math.log(this.iteration + 1) / this.numbers_of_selections.get( i ));
        upper_bound = average_reward + delta_i;
      } 
      if (upper_bound > max_upper_bound) { //get max at each round
        max_upper_bound = upper_bound;
        ad = i;
      }
    }
    return ad;
  }
  /**
   * single step trainning method
   * @param {Object} ucbRow - row of bound selections
   * @param {Function} [getBound=this.getBound] - select value of ucbRow by selection value
   * @return {this} 
   */
  learn(options={}) {
    const { ucbRow, getBound, } = options;
    let ad = this.predict();
    this.last_selected.push(ad);
    this.numbers_of_selections.set(ad,  this.numbers_of_selections.get(ad) + 1);
    let reward = ucbRow[getBound(ad)];
    this.sums_of_rewards.set(ad,  this.sums_of_rewards.get(ad) + reward);
    this.total_reward = this.total_reward + reward;
    this.iteration++;
    return this;
  }
  /**
   * training method for upper confidence bound calculations
   * @param {Object|Object[]} ucbRow - row of bound selections
   * @param {Function} [getBound=this.getBound] - select value of ucbRow by selection value
   * @return {this} 
   */
  train(options) {
    const {
      ucbRow,
      getBound = this.getBound,
    } = options;
    if (Array.isArray(ucbRow)) {
      for (let i in ucbRow) {
        this.learn({
          ucbRow: ucbRow[i],
          getBound,
        });
      }
    } else {
      this.learn({
        ucbRow,
        getBound,
      });
    }
    return this;
  }
}

/**
 * Implementation of the Thompson Sampling algorithm
 * @class ThompsonSampling
 * @memberOf ml
 */
class ThompsonSampling extends ReinforcedLearningBase{
  /**
   * creates a new instance of the Thompson Sampling(TS) algorithm. TS a heuristic for choosing actions that addresses the exploration-exploitation dilemma in the multi-armed bandit problem. It consists in choosing the action that maximizes the expected reward with respect to a randomly drawn belief
   * @see {@link https://en.wikipedia.org/wiki/Thompson_sampling}
   * @example
   * const dataset = new ms.ml.ThompsonSampling({bounds:10});
   * @param {Object} [options={}]
   * @prop {Map} this.numbers_of_rewards_1 - map of all reward 1 selections
   * @prop {Map} this.numbers_of_rewards_0 - map of all reward 0 selections
   * @returns {this} 
   */
  constructor(options = {}) {
    super(options);
    this.numbers_of_rewards_1 = new Map();
    this.numbers_of_rewards_0 = new Map();
    for (let i = 0; i < this.bounds; i++){
      this.numbers_of_rewards_1.set(i, 0);
      this.numbers_of_rewards_0.set(i, 0);
    }
    return this;
  }
  /**
   * returns next action based off of the thompson sampling
   * @return {number} returns thompson sample
   */
  predict() {
    let ad = 0; //ad is each bandit
    let max_random = 0;
    for (let i = 0; i < this.bounds; i++){
      let random_beta = probabilty.rbeta(1, this.numbers_of_rewards_1.get(i) + 1, this.numbers_of_rewards_0.get(i) + 1);
      if (random_beta > max_random) {
        max_random = random_beta;
        ad = i;
      }
    }
    return ad;
  }
  /**
   * single step trainning method
   * @param {Object} tsRow - row of bound selections
   * @param {Function} [getBound=this.getBound] - select value of tsRow by selection value
   * @return {this} 
   */
  learn(options = {}) {
    const { tsRow, getBound, } = options;
    let ad = this.predict();
    this.last_selected.push(ad);
    let reward = tsRow[ getBound(ad) ];
    if (reward === 1) {
      this.numbers_of_rewards_1.set(ad,  this.numbers_of_rewards_1.get(ad) + 1);
    } else {
      this.numbers_of_rewards_0.set(ad,  this.numbers_of_rewards_0.get(ad) + 1);
    }
    this.total_reward = this.total_reward + reward;
    this.iteration++;
    return this;
  }
  /**
   * training method for thompson sampling calculations
   * @param {Object|Object[]} tsRow - row of bound selections
   * @param {Function} [getBound=this.getBound] - select value of tsRow by selection value
   * @return {this} 
   */
  train(options) {
    const {
      tsRow,
      getBound = this.getBound,
    } = options;
    if (Array.isArray(tsRow)) {
      for (let i in tsRow) {
        this.learn({
          tsRow: tsRow[i],
          getBound,
        });
      }
    } else {
      this.learn({
        tsRow,
        getBound,
      });
    }
    return this;
  }
}

MachineLearning.Regression = Object.assign({},
  MachineLearning.Regression);
MachineLearning.SL = Object.assign({},
  MachineLearning.SL);
MachineLearning.Stat = Object.assign({},
  MachineLearning.Stat);
MachineLearning.RL = Object.assign({},
  MachineLearning.RL, {
    ReinforcedLearningBase,
    UpperConfidenceBound,
    ThompsonSampling,
  });
MachineLearning.UpperConfidenceBound = UpperConfidenceBound;
MachineLearning.ThompsonSampling = ThompsonSampling;
MachineLearning.Regression.DecisionTreeRegression = mlCart.DecisionTreeRegression;
MachineLearning.Regression.RandomForestRegression = mlRandomForest.RandomForestRegression;
MachineLearning.Regression.MultivariateLinearRegression = MultivariateLinearRegression;

MachineLearning.SL.GaussianNB = mlNaivebayes.GaussianNB;
MachineLearning.SL.LogisticRegression = LogisticRegression;
MachineLearning.SL.DecisionTreeClassifier = mlCart.DecisionTreeClassifier;
MachineLearning.SL.RandomForestClassifier = mlRandomForest.RandomForestClassifier;

MachineLearning.Stat.PCA = PCA;

/**
 * @namespace
 * @see {@link https://github.com/mljs/ml} 
 */
const ml$1 = MachineLearning;

/**
 * class for manipulating an array of objects, typically from CSV data
 * @class DataSet
 * @memberOf preprocessing
 */
class DataSet {
  /**
   * creates a new raw data instance for preprocessing data for machine learning
   * @example
   * const dataset = new ms.DataSet(csvData);
   * @param {Object[]} dataset
   * @returns {this} 
   */
  constructor(data = []) {
    this.data = [...data, ];
    this.labels = new Map();
    this.encoders = new Map();
    return this;
  }
  /**
   * returns filtered rows of data 
   * @example const csvObj = new DataSet([{col1:1,col2:5},{col1:2,col2:6}]);
csvObj.filterColumn((row)=>row.col1>=2); // =>
//[ 
//  [2,6], 
//]
  * @param {Function} [filter=()=>true] - filter function
  * @returns {Array} filtered array of data 
  */
  filterColumn(filter = () => true) {
    return this.data.filter(filter);
  }
  /**
   * returns a matrix of values by combining column arrays into a matrix
   * @example const csvObj = new DataSet([{col1:1,col2:5},{col1:2,col2:6}]);
csvObj.columnMatrix([['col1',{parseInt:true}],['col2']]); // =>
//[ 
//  [1,5], 
//  [2,6], 
//]
  * @param {Array} [vectors=[]] - array of arguments for columnArray to merge columns into a matrix
  * @returns {Array} a matrix of column values 
  */
  columnMatrix(vectors = []) {
    const vectorArrays = vectors
      .map(vec => this.columnArray(...vec));
        
    return util$1.pivotArrays(vectorArrays);
  }
  /**
   * returns a new array of a selected column from an array of objects, can filter, scale and replace values
   * @example 
   * //column Array returns column of data by name
// [ '44','27','30','38','40','35','','48','50', '37' ]
const OringalAgeColumn = dataset.columnArray('Age'); 
  * @param {string} name - csv column header, or JSON object property name 
  * @param options 
  * @param {function} [options.prefilter=(arr[val])=>true] - prefilter values to return
  * @param {function} [options.filter=(arr[val])=>true] - filter values to return
  * @param {function} [options.replace.test=undefined] - test function for replacing values (arr[val])
  * @param {(string|number|function)} [options.replace.value=undefined] - value to replace (arr[val]) if replace test is true, if a function (result,val,index,arr,name)=>your custom value
  * @param {number} [options.parseIntBase=10] - radix value for parseInt
  * @param {boolean} [options.parseFloat=false] - convert values to floats 
  * @param {boolean} [options.parseInt=false] - converts values to ints 
  * @param {boolean} [options.scale=false] - standard or minmax feature scale values 
  * @returns {array}
  */
  columnArray(name, options = {}) {
    const config = Object.assign({
      prefilter: () => true,
      filter: () => true,
      replace: {
        test: undefined,
        value: undefined,
      },
      parseInt: false,
      parseIntBase: 10,
      parseFloat: (options.scale) ? true : false,
      scale: false,
    }, options);
    const modifiedColumn = this.data
      .filter(config.prefilter)
      .reduce((result, val, index, arr) => {
        let objVal = val[ name ];
        let returnVal = (typeof config.replace.test === 'function') ?
          config.replace.test(objVal) ?
            typeof config.replace.value === 'function' ?
              config.replace.value(result, val, index, arr, name) :
              config.replace.value :
            objVal :
          objVal;
        if (config.filter(returnVal)) {
          if (config.parseInt) result.push(parseInt(returnVal, config.parseIntBase));
          else if (config.parseFloat) result.push(parseFloat(returnVal));
          else result.push(returnVal);
        }
        return result;
      }, []);
    if (typeof config.scale==='function') {
      return modifiedColumn.map(config.scale);
    } else if (config.scale) {
      switch (config.scale) {
      case 'standard':
        return util$1.StandardScaler(modifiedColumn);
      case 'log':
        return util$1.LogScaler(modifiedColumn);
      case 'exp':
        return util$1.ExpScaler(modifiedColumn);
      case 'normalize':
      default:
        return util$1.MinMaxScaler(modifiedColumn);
      }
    } else {
      return modifiedColumn;
    }
  }
  /**
   * returns a new array of a selected column from an array of objects and replaces empty values, encodes values and scales values
   * @example
   * //column Replace returns new Array with replaced missing data
//[ '44','27','30','38','40','35',38.77777777777778,'48','50','37' ]
const ReplacedAgeMeanColumn = dataset.columnReplace('Age',{strategy:'mean'});
  * @param {string} name - csv column header, or JSON object property name 
  * @param options 
  * @param {boolean} [options.empty=true] - replace empty values 
  * @param {boolean} [options.strategy="mean"] - strategy for replacing value, any array stat method from ml.js (mean, standardDeviation, median) or (label,labelEncoder,onehot,oneHotEncoder)
  * @returns {array|Object[]}
  */
  columnReplace(name, options = {}) {
    const config = Object.assign({
      strategy: 'mean',
      empty: true,
      arrayOptions: {
        parseFloat: true,
        filter: val => val,
      },
      labelOptions: {},
    }, options);
    let replaceVal;
    let replace = {
      test: val => !val,
      value: replaceVal,
    };
    switch (config.strategy) {
    case 'label':
    case 'labelEncoder':
      replaceVal = this.labelEncoder(name, config.labelOptions);
      replace = {
        test: val => true,
        value: (result, val, index, arr) => replaceVal[index],
      };
      break;
    case 'onehot':
    case 'oneHot':
    case 'oneHotEncode':
    case 'oneHotEncoder':
      replaceVal = this.oneHotEncoder(name, config.oneHotOptions);
      replace = {
        test: val => true,
        value: (result, val, index, arr) => replaceVal[index],
      };
      return replaceVal;
      break;
    case 'reducer':
    case 'reduce':
      replaceVal = this.columnReducer(name, config.reducerOptions); 
      return replaceVal;  
    case 'merge':
      replaceVal = this.columnMerge(name, config.mergeData); 
      return replaceVal;  
    default:
      replaceVal = ml$1.ArrayStat[config.strategy](this.columnArray(name, config.arrayOptions));
      replace.value = replaceVal;
      break;
    }
    return this.columnArray(name,
      Object.assign({}, {
        replace,
        scale: options.scale,
      }, options.columnOptions));
  }
  /**
   * returns a new array and label encodes a selected column
   * @example
   * const oneHotCountryColumn = dataset.oneHotEncoder('Country'); 

// [ 'N', 'Yes', 'No', 'f', 'Yes', 'Yes', 'false', 'Yes', 'No', 'Yes' ] 
const originalPurchasedColumn = dataset.labelEncoder('Purchased');
// [ 0, 1, 0, 0, 1, 1, 1, 1, 0, 1 ]
const encodedBinaryPurchasedColumn = dataset.labelEncoder('Purchased',{ binary:true });
// [ 0, 1, 2, 3, 1, 1, 4, 1, 2, 1 ]
const encodedPurchasedColumn = dataset.labelEncoder('Purchased'); 
  * @param {string} name - csv column header, or JSON object property name 
  * @param options
  * @param {boolean} [options.binary=false] - only replace with (0,1) with binary values 
  * @see {@link http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html} 
  * @returns {array}
  */
  labelEncoder(name, options) {
    const config = Object.assign({
      // n_values: "auto",
      // categorical_features: "all",
      // // dtype: np.float64,
      // sparse: true,
      // handle_unknown: 'error',
      binary: false,
    }, options);
    const labelData = config.data || this.columnArray(name, config.columnArrayOptions);
    const labels = new Map(
      Array.from(new Set(labelData).values())
        .reduce((result, val, i, arr) => {
          result.push([val, i, ]);
          result.push([i, val, ]);
          return result;
        }, [])
    );
    this.labels.set(name, labels);
    const labeledData = (config.binary) ?
      labelData.map(label => {
        // console.log(label);
        if (!label) return 0;
        switch (label) {
        case false:
        case 'N':
        case 'n':
        case 'NO':
        case 'No':
        case 'no':
        case 'False':
        case 'F':
        case 'f':
          return 0;
        default:
          return 1;
        }
      }) :
      labelData.map(label => labels.get(label));
    return labeledData;
  }
  /**
     * returns a new array and decodes an encoded column back to the original array values
     * @param {string} name - csv column header, or JSON object property name 
     * @param options
     * @returns {array}
     */
  labelDecode(name, options) {
    const config = Object.assign({}, options);
    const labelData = config.data || this.columnArray(name, config.columnArrayOptions);
    return labelData.map(val => this.labels.get(name).get(val));
  }
  /**
 * returns a new object of one hot encoded values
 * @example
 * // [ 'Brazil','Mexico','Ghana','Mexico','Ghana','Brazil','Mexico','Brazil','Ghana', 'Brazil' ]
const originalCountry = dataset.columnArray('Country'); 

// { originalCountry:
//    { Country_Brazil: [ 1, 0, 0, 0, 0, 1, 0, 1, 0, 1 ],
//      Country_Mexico: [ 0, 1, 0, 1, 0, 0, 1, 0, 0, 0 ],
//      Country_Ghana: [ 0, 0, 1, 0, 1, 0, 0, 0, 1, 0 ] },
//     }
const oneHotCountryColumn = dataset.oneHotEncoder('Country'); 
  * @param {string} name - csv column header, or JSON object property name 
  * @param options 
  * @see {@link http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html}
  * @return {Object}
  */
  oneHotEncoder(name, options) {
    const config = Object.assign({
      // n_values: "auto",
      // categorical_features: "all",
      // prefix: true,
      // dtype: np.float64,
      // sparse: True,
      // handle_unknown: 'error'
    }, options);
    const labelData = config.data || this.columnArray(name, config.columnArrayOptions);
    const labels = Array.from(new Set(labelData).values());
    const encodedData = labelData.reduce(
      (result, val, index, arr) => {
        labels.forEach(encodedLabel => {
          const oneHotLabelArrayName = `${name}_${encodedLabel}`;
          const oneHotVal = (val === encodedLabel) ? 1 : 0;
          if (Array.isArray(result[oneHotLabelArrayName])) {
            result[oneHotLabelArrayName].push(oneHotVal);
          } else {
            result[oneHotLabelArrayName] = [oneHotVal, ];
          }
        });
        return result;
      }, {});
    this.encoders.set(name, {
      labels,
      prefix: `${name}_`,
    });
    return encodedData;
  }
  /**
 * it returns a new column that reduces a column into a new column object, this is used in data prep to create new calculated columns for aggregrate statistics
 * @example 
const reducer = (result, value, index, arr) => {
result.push(value * 2);
return result;
};
CSVDataSet.columnReducer('DoubleAge', {
columnName: 'Age',
reducer,
}); //=> { DoubleAge: [ 88, 54, 60, 76, 80, 70, 0, 96, 100, 74 ] }
  * @param {String} name - name of new Column 
  * @param {Object} options 
  * @param {String} options.columnName - name property for columnArray selection 
  * @param {Object} options.columnOptions - options property for columnArray  
  * @param {Function} options.reducer - reducer function to reduce into new array, it should push values into the resulting array  
  * @returns {Object} a new object that has reduced array as the value
  */
  columnReducer(name, options) {
    const newColumn = {
      [ name ]: this.columnArray(options.columnName, options.columnOptions).reduce(options.reducer, []),
    };
    return newColumn;
  }
  /**
   * it returns a new column that is merged onto the data set
   * @example 
CSVDataSet.columnMerge('DoubleAge', [ 88, 54, 60, 76, 80, 70, 0, 96, 100, 74 ]); //=> { DoubleAge: [ 88, 54, 60, 76, 80, 70, 0, 96, 100, 74 ] }
    * @param {String} name - name of new Column 
    * @param {Array} data - new dataset data  
    * @returns {Object} 
    */
  columnMerge(name, data=[]) {
    if (this.data.length !== data.length) throw new RangeError(`Merged data column must have the same length(${data.length}) as the DataSet's length (${this.data.length})`);
    return {
      [name]: data,
    };
  }
  /**
     * mutates data property of DataSet by replacing multiple columns in a single command
     * @example
     * //fit Columns, mutates dataset
dataset.fitColumns({
  columns:[{name:'Age',options:{ strategy:'mean'} }]
});
// dataset
// class DataSet
//   data:[
//     {
//       'Country': 'Brazil',
//       'Age': '38.77777777777778',
//       'Salary': '72000',
//       'Purchased': 'N',
//     }
//     ...
//   ]
  * @param options 
  * @param {Object[]} options.columns - {name:'columnName',options:{strategy:'mean',labelOoptions:{}},}
  * @returns {Object[]}
  */
  fitColumns(options) {
    const config = Object.assign({
      returnData:true,
      columns: [],
    }, options);
    const fittedColumns = config.columns
      .reduce((result, val, index, arr) => {
        let replacedColumn = this.columnReplace(val.name, val.options);
        if (Array.isArray(replacedColumn)) {
          replacedColumn = replacedColumn.map(columnVal => ({
            [val.name]: columnVal,
          }));
          result[val.name] = replacedColumn;
        } else {
          Object.keys(replacedColumn).forEach(repColName => {
            result[repColName] = replacedColumn[repColName].map(columnVal => ({
              [repColName]: columnVal,
            }));
          });
        }
        return result;
      }, {});
    if (Object.keys(fittedColumns)) {
      const columnNames = Object.keys(fittedColumns);
      const fittedData = fittedColumns[columnNames[0]]
        .reduce((result, val, index, arr) => {
          const returnObj = {};
          columnNames.forEach(colName => {
            returnObj[colName] = fittedColumns[colName][index][colName];
          });
          result.push(returnObj);
          return result;
        }, []);
      this.data = this.data.map((val, index) => Object.assign({}, val, fittedData[index]));
    }
    return config.returnData ? this.data : this;
  }
}

// import { ml, } from './ml';
// import { util as utils, } from './util';
/**
 * class creating sparse matrices from a corpus
 * @class ColumnVectorizer
 * @memberOf nlp
 */
class ColumnVectorizer {
  /**
   * creates a new instance for classifying text data for machine learning
   * @example
   * const dataset = new ms.nlp.ColumnVectorizer(csvData);
   * @param {Object} [options={}]
   * @prop {Object[]} this.data - Array of strings
   * @prop {Set} this.tokens - Unique collection of all tokenized strings
   * @prop {Object[]} this.vectors - Array of tokenized words with value of count of appreance in string
   * @prop {Object} this.wordMap - Object of all unique words, with value of 0
   * @prop {Object} this.wordCountMap - Object of all unique words, with value as total count of appearances
   * @prop {number} this.maxFeatures - max number of features
   * @prop {String[]} this.sortedWordCount - list of words as tokens sorted by total appearances
   * @prop {String[]} this.limitedFeatures - subset list of maxFeatures words as tokens sorted by total appearances
   * @prop {Array[]} this.matrix - words in sparse matrix
   * @prop {Function} this.replacer - clean string function
   * @returns {this} 
   */
  constructor(options = {}) {
    this.data = options.data || [];
    this.tokens = new Set();
    this.vectors = [];
    this.wordMap = {};
    this.wordCountMap = {};
    this.maxFeatures = options.maxFeatures;
    this.sortedWordCount = [];
    this.limitedFeatures = [];
    this.matrix = [];
    this.replacer = (value='') => {
      const cleanedValue = value
        .toLowerCase()
        .replace(/[^a-zA-Z]/gi, ' ');
      return nlp$1.PorterStemmer
        .tokenizeAndStem(cleanedValue)
        .join(' ');
    };
    return this;
  }
  /** 
   * Returns a distinct array of all tokens
   * @return {String[]} returns a distinct array of all tokens
  */
  get_tokens() {
    return Array.from(this.tokens);
  }
  /** 
   * Returns array of arrays of strings for dependent features from sparse matrix word map
   * @return {String[]} returns array of dependent features for DataSet column matrics
  */
  get_vector_array() {
    return this.get_tokens().map(tok => [
      tok,
    ]);
  }
  /**
   * Fits and transforms data by creating column vectors (a sparse matrix where each row has every word in the corpus as a column and the count of appearances in the corpus)
   * @param {Object} options 
   * @param {Object[]} options.data - array of corpus data 
   */
  fit_transform(options = {}) {
    const data = options.data || this.data;
    data.forEach(datum => {
      const datums = {};
      this.replacer(datum)
        .split(' ')
        .forEach(tok => {
          const token = tok.toLowerCase();
          datums[ token ] = (datums[ token ])
            ? datums[ token ] + 1
            : 1;
          this.wordCountMap[token] = (this.wordCountMap[token])
            ? this.wordCountMap[token] + 1
            : 1;
          this.tokens.add(token);
        });
      this.vectors.push(datums);
    });
    this.wordMap = Array.from(this.tokens).reduce((result, value) => { 
      result[ value ] = 0;
      return result;
    }, {});
    this.sortedWordCount = Object.keys(this.wordCountMap)
      .sort((a, b) => this.wordCountMap[ b ] - this.wordCountMap[ a ]);
    this.vectors = this.vectors.map(vector => Object.assign({}, this.wordMap, vector));
    const vectorData = new DataSet(this.vectors);
    this.limitedFeatures = this.get_limited_features(options);
    this.matrix = vectorData.columnMatrix(this.limitedFeatures);
    return this.matrix;
  }
  /**
   * Returns limited sets of dependent features or all dependent features sorted by word count
   * @param {*} options 
   * @param {number} options.maxFeatures - max number of features 
   */
  get_limited_features(options = {}) {
    const maxFeatures = options.maxFeatures || this.maxFeatures || this.tokens.size;
 
    return this.sortedWordCount
      .slice(0, maxFeatures)
      .map(feature => [ feature, ]);
  }
  /**
   * returns word map with counts
   * @example 
ColumnVectorizer.evaluateString('I would rate everything Great, views Great, food Great') => { realli: 0,
     good: 0,
     definit: 0,
     recommend: 0,
     wait: 0,
     staff: 0,
     rude: 0,
     great: 3,
     view: 1,
     food: 1,
     not: 0,
     cold: 0,
     took: 0,
     forev: 0,
     seat: 0,
     time: 0,
     prompt: 0,
     attent: 0,
     bland: 0,
     flavor: 0,
     kind: 0 }
   * @param {String} testString 
   * @return {Object} object of corpus words with accounts
   */
  evaluateString(testString = '') {
    const evalString = this.replacer(testString);
    const evalStringWordMap = evalString.split(' ').reduce((result, value) => { 
      if (this.tokens.has(value)) {
        result[ value ] = (result[ value ]!==undefined)
          ? result[ value ] + 1
          : 1;
      }
      return result;
    }, {});
    return Object.assign({}, this.wordMap, evalStringWordMap);
  }
  /**
   * returns new matrix of words with counts in columns
   * @example 
ColumnVectorizer.evaluate('I would rate everything Great, views Great, food Great') => [ [ 0, 1, 3, 0, 0, 0, 0, 0, 1 ] ]
   * @param {String} testString 
   * @return {number[][]} sparse matrix row for new classification predictions
   */
  evaluate(testString='', options) {
    const stringObj = this.evaluateString(testString);
    const limitedFeatures = this.get_limited_features(options);
    const vectorData = new DataSet([
      stringObj,
    ]);
    return vectorData.columnMatrix(limitedFeatures);
  }
}

/**
 * @namespace
 * @see {@link https://github.com/NaturalNode/natural} 
 */
const nlp$1 = Object.assign({
  ColumnVectorizer,
}, natural);

const Matrix = ml$1.Matrix;
const ConfusionMatrix = ml$1.ConfusionMatrix;

/**
 * Split arrays into random train and test subsets
 * @memberOf cross_validation
 * @example
 * const testArray = [20, 25, 10, 33, 50, 42, 19, 34, 90, 23, ];
// { train: [ 50, 20, 34, 33, 10, 23, 90, 42 ], test: [ 25, 19 ] }
const trainTestSplit = ms.cross_validation.train_test_split(testArray,{ test_size:0.2, random_state: 0, });
 * @param {array} dataset - array of data to split
 * @param {object} options
 * @param {number} [options.test_size=0.2] - represent the proportion of the dataset to include in the test split, can be overwritten by the train_size 
 * @param {number} [options.train_size=0.8] - represent the proportion of the dataset to include in the train split 
 * @param {number} [options.random_state=0] - the seed used by the random number generator
 * @param {boolean} [options.return_array=false] - will return an object {train,test} of the split dataset by default or [train,test] if returned as an array
 * @returns {(Object|array)} returns training and test arrays either as an object or arrays
 */
function train_test_split(dataset = [], options = {
  test_size: 0.2,
  train_size: 0.8,
  random_state: 0,
  return_array: false,
  parse_int_train_size: true,
}) {
  const engine = Random.engines.mt19937().seed(options.random_state || 0);
  const training_set = [];
  const parse_int_train_size = (typeof options.parse_int_train_size === 'boolean') ? options.parse_int_train_size : true;
  const train_size_length = (options.train_size)
    ? options.train_size * dataset.length
    : (1 - (options.test_size || 0.2)) * dataset.length;
  const train_size = parse_int_train_size
    ? parseInt(train_size_length, 10)
    : train_size_length;
  const dataset_copy = [].concat(dataset);

  while (training_set.length < train_size) {
    const index = Random.integer(0, (dataset_copy.length - 1))(engine);
    // console.log({ index });
    training_set.push(dataset_copy.splice(index, 1)[0]);
  }
  return (options.return_array) ? [training_set, dataset_copy, ] : {
    train: training_set,
    test: dataset_copy,
  };
}

/**
 * Provides train/test indices to split data in train/test sets. Split dataset into k consecutive folds.
Each fold is then used once as a validation while the k - 1 remaining folds form the training set.
 * @memberOf cross_validation
 * @example
 * const testArray = [20, 25, 10, 33, 50, 42, 19, 34, 90, 23, ];
// [ [ 50, 20, 34, 33, 10 ], [ 23, 90, 42, 19, 25 ] ] 
const crossValidationArrayKFolds = ms.cross_validation.cross_validation_split(testArray, { folds: 2, random_state: 0, });
 * @param {array} dataset - array of data to split
 * @param {object} options
 * @param {number} [options.folds=3] - Number of folds 
 * @param {number} [options.random_state=0] - the seed used by the random number generator
 * @returns {array} returns  dataset split into k consecutive folds
 */
function cross_validation_split(dataset = [], options = {
  folds: 3,
  random_state: 0,
}) { //kfolds
  const engine = Random.engines.mt19937().seed(options.random_state || 0);
  const folds = options.folds || 3;
  const dataset_split = [];
  const dataset_copy = [].concat(dataset);
  const foldsize = parseInt(dataset.length / (folds || 3), 10);
  for (let i in range(folds)) {
    const fold = [];
    while (fold.length < foldsize) {
      const index = Random.integer(0, (dataset_copy.length - 1))(engine);
      fold.push(dataset_copy.splice(index, 1)[0]);
    }
    dataset_split.push(fold);
  }

  return dataset_split;
}

/**
 * Used to test variance and bias of a prediction
 * @memberOf cross_validation
 * @param {object} options
 * @param {function} options.classifier - instance of classification model used for training, or function to train a model. e.g. new DecisionTreeClassifier({ gainFunction: 'gini', }) or ml.KNN
 * @param {function} options.regression - instance of regression model used for training, or function to train a model. e.g. new RandomForestRegression({ nEstimators: 300, }) or ml.MultivariateLinearRegression
 * @return {number[]} Array of accucracy calculations 
 */
function cross_validate_score(options = {}) {
  const config = Object.assign({}, {
    // classifier,
    // regression,
    // dataset,
    // testingset,
    dependentFeatures: [['X',],],
    independentFeatures: [['Y',],],
    // random_state,
    folds: 10,
    accuracy: 'standardError',
    use_train_x_matrix: true,
    use_train_y_matrix: false,
    use_train_y_vector: false,
    use_estimates_y_vector: false,
  }, options);
  const classifier = config.classifier;
  const regression = config.regression;
  const folds = cross_validation_split(config.dataset, {
    folds: config.folds,
    random_state: config.random_state,
  });
  const testingDataSet = new DataSet(config.testingset);
  const y_test_matrix = testingDataSet.columnMatrix(config.independentFeatures);
  const x_test_matrix = testingDataSet.columnMatrix(config.dependentFeatures);
  const actuals = util$1.pivotVector(y_test_matrix)[ 0 ];
  // console.log({ actuals });
  const prediction_accuracies = folds.map(fold => { 
    const trainingDataSet = new DataSet(fold);
    const x_train = trainingDataSet.columnMatrix(config.dependentFeatures);
    const y_train = trainingDataSet.columnMatrix(config.independentFeatures);
    const x_train_matrix = (config.use_train_x_matrix)
      ? new Matrix(x_train)
      : x_train;
    const y_train_matrix = (config.use_train_y_matrix)
      ? new Matrix(y_train)
      : (config.use_train_y_vector)
        ? util$1.pivotVector(y_train)[0]
        : y_train;
    if (regression) {
      let regressor;
      let pred_y_test;
      if (typeof regression.train === 'function') {
        regressor = regression.train(x_train_matrix, y_train_matrix, config.modelOptions);
        pred_y_test = regression.predict(x_test_matrix);
      } else {
        regressor = new regression(x_train_matrix, y_train_matrix, config.modelOptions);
        pred_y_test = regressor.predict(x_test_matrix);
      }
      // console.log({ x_test_matrix });
      // console.log({ pred_y_test });
      const estimates = pred_y_test;//util.pivotVector(pred_y_test)[0];
      // console.log({ estimates, actuals });
      return (config.accuracy === 'standardError')
        ? util$1.standardError(actuals, estimates)
        : util$1.rSquared(actuals, estimates);
    } else {
      let classification;
      let estimates;
      if (typeof classifier.train === 'function') {
        classifier.train(x_train_matrix, y_train_matrix, config.modelOptions);
        estimates = classifier.predict(x_test_matrix);
      } else {
        classification = new classifier(x_train_matrix, y_train_matrix, config.modelOptions);
        estimates = classification.predict(x_test_matrix);
      }
      // classification.train(x_train_matrix, y_train_matrix);
      // classifier.train(x_train_matrix, y_train_matrix);
      const compareEstimates = (config.use_estimates_y_vector)
        ? util$1.pivotVector(estimates)[ 0 ]
        : estimates;
      const CM = ConfusionMatrix.fromLabels(actuals, compareEstimates);
      return CM.getAccuracy();
    }
  });
  return prediction_accuracies;
}

/**
 * Used to test variance and bias of a prediction with parameter tuning
 * @memberOf cross_validation
 * @param {object} options
 * @param {function} options.classifier - instance of classification model used for training, or function to train a model. e.g. new DecisionTreeClassifier({ gainFunction: 'gini', }) or ml.KNN
 * @param {function} options.regression - instance of regression model used for training, or function to train a model. e.g. new RandomForestRegression({ nEstimators: 300, }) or ml.MultivariateLinearRegression
 * @return {number[]} Array of accucracy calculations 
 */
function grid_search(options = {}) {
  const config = Object.assign({}, {
    return_parameters: false,
    compare_score:'mean',
    sortAccuracyScore:'desc',
    parameters: {},
  }, options);
  const regressor = config.regression;
  const classification = config.classifier;
  const sortAccuracyScore = (!options.sortAccuracyScore && config.regression)
    ? 'asc'
    : config.sortAccuracyScore;
  
  // const scoreSorter = ;
  const gs = new jsGridSearchLite.GridSearch({
    params: config.parameters,
    run_callback: (params) => {
      if (config.regression) {
        config.regression = new regressor(params);
      } else {
        config.classifier = new classification(params);
      }
      const score = cross_validate_score(config);
      return (config.compare_score)
        ? util$1[config.compare_score](score)
        : score;
    },
  });
  gs.run();
  const accuracySorter = (sortAccuracyScore === 'desc')
    ? (a, b) => b.results - a.results
    : (a, b) => a.results - b.results;
  const results = gs._results.sort(accuracySorter);
  // GridSearch;
  return config.return_parameters
    ? results
    : results[ 0 ];
}

/**
 * @namespace
 * @see {@link https://machinelearningmastery.com/implement-resampling-methods-scratch-python/}
 */
const cross_validation$1 = {
  train_test_split,
  cross_validation_split,
  kfolds: cross_validation_split,
  cross_validate_score,
  grid_search,
  GridSearch: jsGridSearchLite.GridSearch,
};

const loadCSV = loadCSV$1;
const loadCSVURI = loadCSVURI$1;

/**
 * @namespace
 */
const preprocessing = {
  DataSet,
};
const util$$1 = util$1;
const cross_validation$$1 = cross_validation$1;
const model_selection = cross_validation$1;
const calc$$1 = calc$1;
const ml$$1 = ml$1;
const nlp$$1 = nlp$1;
const csv$1 = csvUtils;
const PD$$1 = PD$1;

exports.loadCSV = loadCSV;
exports.loadCSVURI = loadCSVURI;
exports.preprocessing = preprocessing;
exports.util = util$$1;
exports.cross_validation = cross_validation$$1;
exports.model_selection = model_selection;
exports.calc = calc$$1;
exports.ml = ml$$1;
exports.nlp = nlp$$1;
exports.csv = csv$1;
exports.PD = PD$$1;
exports.DataSet = DataSet;
