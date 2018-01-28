import { get } from 'http';
import { get as get$1 } from 'https';
import validURL from 'valid-url';
import csv from 'csvtojson';
import ml from 'ml';
import Random from 'random-js';
import range from 'lodash.range';
import rangeRight from 'lodash.rangeright';

// import { default as path } from 'path';

const avg = ml.Stat.array.mean;
const mean = avg;
const sum = ml.Stat.array.sum;
const scale = (a, d) => a.map(x => (x - avg(a)) / d);
const max = a => a.concat([]).sort((x, y) => x < y)[0];
const min = a => a.concat([]).sort((x, y) => x > y)[0];
const sd = ml.Stat.array.standardDeviation; //(a, av) => Math.sqrt(avg(a.map(x => (x - av) * x)));

/**
 * Asynchronously loads a CSV from a remote URL and returns an array of objects
 * @example
 * // returns [{header:value,header2:value2}]
 * loadCSVURI('https://raw.githubusercontent.com/repetere/jskit-learn/master/test/mock/data.csv').then(csvData).catch(console.error)
 * @param {string} filepath URL to CSV path
 * @returns {Object[]} returns an array of objects from a csv where each column header is the property name  
 */
function loadCSVURI(filepath) {
  const reqMethod = (filepath.search('https', 'gi') > -1) ? get$1 : get;
  return new Promise((resolve, reject) => {
    const csvData = [];
    const req = reqMethod(filepath, res => {
      csv().fromStream(res)
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
  })
}

/**
 * Asynchronously loads a CSV from either a filepath or remote URL and returns an array of objects
 * @example
 * // returns [{header:value,header2:value2}]
 * loadCSV('../mock/invalid-file.csv').then(csvData).catch(console.error)
 * @param {string} filepath URL to CSV path
 * @returns {Object[]} returns an array of objects from a csv where each column header is the property name  
 */
function loadCSV(filepath) {
  if (validURL.isUri(filepath)) {
    return loadCSVURI(filepath);
  } else {
    return new Promise((resolve, reject) => {
      const csvData = [];
      csv().fromFile(filepath)
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
 * @namespace
 */
const util = {
  range,
  rangeRight,
  scale,
  avg,
  mean: avg,
  sum,
  max,
  min,
  sd,
  /**
   * Standardize features by removing the mean and scaling to unit variance

Centering and scaling happen independently on each feature by computing the relevant statistics on the samples in the training set. Mean and standard deviation are then stored to be used on later data using the transform method.

Standardization of a dataset is a common requirement for many machine learning estimators: they might behave badly if the individual feature do not more or less look like standard normally distributed data (e.g. Gaussian with 0 mean and unit variance)
   * @memberOf util
   * @param {number[]} z - array of integers or floats
   * @returns {number[]}
   */
  StandardScaler: (z) => scale(z, sd(z)),
  /**
   * Transforms features by scaling each feature to a given range.

This estimator scales and translates each feature individually such that it is in the given range on the training set, i.e. between zero and one.
   * @memberOf util
   * @param {number[]} z - array of integers or floats
   * @returns {number[]}
   */
  MinMaxScaler: (z) => scale(z, (max(z) - min(z))),
  LogScaler: (z) => z.map(Math.log),
  ExpScaler: (z) => z.map(Math.exp),
  squaredDifference,
  standardError,
  coefficientOfDetermination,
  rSquared: coefficientOfDetermination,
  pivotVector,
  pivotArrays,
};

/**
 * Returns an array of the squared different of two arrays
 * @memberOf util
 * @param {Number[]} left 
 * @param {Number[]} right 
 * @returns {Number[]} Squared difference of left minus right array
 */
function squaredDifference(left,right) {
  return left.reduce((result, val, index, arr) => { 
    result.push(Math.pow((right[index]-val), 2));
    return result;
  }, []);
}

/**
 * The standard error of the estimate is a measure of the accuracy of predictions made with a regression line
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
  const squaredDiff = squaredDifference(actuals,estimates);
  return Math.sqrt((sum(squaredDiff)) / (actuals.length - 2));
}

/**
 * In statistics, the coefficient of determination, denoted R2 or r2 and pronounced "R squared", is the proportion of the variance in the dependent variable that is predictable from the independent variable(s).
 * {\bar {y}}={\frac {1}{n}}\sum _{i=1}^{n}y_{i}
 * @example
const actuals = [ 2, 4, 5, 4, 5, ];
const estimates = [ 2.8, 3.4, 4, 4.6, 5.2, ];
const r2 = jsk.util.coefficientOfDetermination(actuals, estimates); 
r2.toFixed(1) // => 0.6
 * @memberOf util
 * @see {@link https://en.wikipedia.org/wiki/Coefficient_of_determination}
 * @param {Number[]} actuals - numerical samples 
 * @param {Number[]} estimates - estimates values
 * @returns {Number} r^2
 */
function coefficientOfDetermination(actuals=[], estimates=[]) {
  if (actuals.length !== estimates.length) throw new RangeError('arrays must have the same length');
  const actualsMean = mean(actuals);
  const estimatesMean = mean(estimates);
  const meanActualsDiffSquared = actuals.map(a => Math.pow(a - actualsMean,2));
  const meanEstimatesDiffSquared = estimates.map(e => Math.pow(e - estimatesMean, 2));
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
        ? (result.push([ vecVal ]))
        : (result[ i ].push(vecVal));
    });
    return result;
  }, []);
} 

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
 * Split arrays into random train and test subsets
 * @memberOf cross_validation
 * @example
 * const testArray = [20, 25, 10, 33, 50, 42, 19, 34, 90, 23, ];
// { train: [ 50, 20, 34, 33, 10, 23, 90, 42 ], test: [ 25, 19 ] }
const trainTestSplit = jsk.cross_validation.train_test_split(testArray,{ test_size:0.2, random_state: 0, });
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
  const train_size_length = (options.train_size)
    ? options.train_size * dataset.length
    : (1 - (options.test_size || 0.2)) * dataset.length;
  const train_size = options.parse_int_train_size
    ? parseInt(train_size_length, 10)
    : train_size_length;
  const dataset_copy = [].concat(dataset);

  while (training_set.length < train_size) {
    const index = Random.integer(0, (dataset_copy.length - 1))(engine);
    // console.log({ index });
    training_set.push(dataset_copy.splice(index, 1)[0]);
  }
  return (options.return_array) ? [training_set, dataset_copy] : {
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
const crossValidationArrayKFolds = jsk.cross_validation.cross_validation_split(testArray, { folds: 2, random_state: 0, });
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
 * @namespace
 * @see {@link https://machinelearningmastery.com/implement-resampling-methods-scratch-python/}
 */
const cross_validation = {
    train_test_split,
    cross_validation_split,
  };
  /**
   * class for manipulating an array of objects, typically from CSV data
   * @class DataSet
   */
class DataSet {
  /**
   * creates a new raw data instance for preprocessing data for machine learning
   * @example
   * const dataset = new jsk.DataSet(csvData);
   * @param {Object[]} dataset
   * @returns {this} 
   */
  constructor(data = []) {
      this.data = [...data];
      this.labels = new Map();
      this.encoders = new Map();
      return this;
  }
  /**
   * returns a matrix of values by combining column arrays into a matrix
   * @example const csvObj = new DataSet([{col1:1,col2:5},{col1:2,col2:6}]);
csvObj.columnMatrix([['col1',{parseInt:true}],['col2]]); // =>
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
       
    return pivotArrays(vectorArrays);
    // if (vectorArrays.length) {
    //   return vectorArrays[ 0 ].map((vectorItem, index) => {
    //     const returnArray = [];
    //     vectorArrays.forEach((v, i) => {
    //       returnArray.push(vectorArrays[ i ][ index ]);
    //     })
    //     return returnArray;
    //   })
    // } else {
    //   return vectors;
    // }
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
          return util.StandardScaler(modifiedColumn);
        case 'log':
          return util.LogScaler(modifiedColumn);
        case 'exp':
          return util.ExpScaler(modifiedColumn);
        case 'normalize':
        default:
          return util.MinMaxScaler(modifiedColumn);
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
          replaceVal = ml.Stat.array[config.strategy](this.columnArray(name, config.arrayOptions));
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
          result.push([val, i]);
          result.push([i, val]);
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
              result[oneHotLabelArrayName] = [oneHotVal];
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
            [val.name]: columnVal
          }));
          result[val.name] = replacedColumn;
        } else {
          Object.keys(replacedColumn).forEach(repColName => {
            result[repColName] = replacedColumn[repColName].map(columnVal => ({
              [repColName]: columnVal
            }));
          });
        }
        return result;
      }, {});
    if (Object.keys(fittedColumns)) {
      const columnNames = Object.keys(fittedColumns);
      const fittedData = fittedColumns[config.columns[0].name]
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
/**
 * @namespace
 */
const preprocessing = {
  DataSet,
};

export { loadCSVURI, loadCSV, util, squaredDifference, standardError, coefficientOfDetermination, pivotVector, pivotArrays, cross_validation, DataSet, preprocessing };
