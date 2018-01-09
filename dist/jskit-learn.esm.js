import { get } from 'http';
import { get as get$1 } from 'https';
import validURL from 'valid-url';
import csv from 'csvtojson';
import ml from 'ml';
import Random from 'random-js';
import range from 'lodash.range';
import rangeRight from 'lodash.rangeright';
import path from 'path';

const avg = ml.Stat.array.mean;
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
  StandardScaler: (z) => scale(z, sd(z)), //standardization
  MinMaxScaler: (z) => scale(z, (max(z) - min(z))),
};


/**
 * Split arrays into random train and test subsets
 * @memberOf cross_validation
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
}) {
  const engine = Random.engines.mt19937().seed(options.random_state || 0);
  const training_set = [];
  const train_size =
    (options.train_size) ?
    options.train_size * dataset.length :
    (1 - (options.test_size || 0.2)) * dataset.length;
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
 * @param {array} dataset - array of data to split
 * @param {object} options
 * @param {number} [options.folds=3] - Number of folds 
 * @param {number} [options.random_state=0] - the seed used by the random number generator
 * @returns {array} returns  dataset split into k consecutive folds
 */
function kfolds(dataset = [], options = {
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
    cross_validation_split: kfolds,
  };
  /**
   * @class RawData
   */
class RawData {
  constructor(data = []) {
    this.data = [...data];
    this.labels = new Map();
    this.encoders = new Map();
    return this;
  }
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
    // console.log({name,config})
    const modifiedColumn = this.data
      .filter(config.prefilter)
      .reduce((result, val, index, arr) => {
        let objVal = val[name];
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
    return (config.scale) ?
      (config.scale === 'standard') ?
      util.StandardScaler(modifiedColumn) :
      util.MinMaxScaler(modifiedColumn) :
      modifiedColumn;
  }
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
      default:
        replaceVal = ml.Stat.array[config.strategy](this.columnArray(name, config.arrayOptions));
        replace.value = replaceVal;
        break;
    }
    return this.columnArray(name, {
      replace,
      scale: options.scale,
    });
  }
  labelEncoder(name, options) {
    const config = Object.assign({
      n_values: "auto",
      categorical_features: "all",
      // dtype: np.float64,
      sparse: true,
      handle_unknown: 'error',
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
  labelDecode(name, options) {
    const config = Object.assign({}, options);
    const labelData = config.data || this.columnArray(name, config.columnArrayOptions);
    return labelData.map(val => this.labels.get(name).get(val));
  }
  oneHotEncoder(name, options) {
    const config = Object.assign({
      // n_values: "auto",
      categorical_features: "all",
      prefix: true,
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
  fitColumns(options) {
    const config = Object.assign({
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
    return this.data;
  }
}
const preprocessing = {
  RawData,
};

export { loadCSVURI, loadCSV, util, cross_validation, RawData, preprocessing };
