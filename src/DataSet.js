import { default as ml, } from 'ml';
import { util as utils, } from './util';

/**
 * class for manipulating an array of objects, typically from CSV data
 * @class DataSet
 */
export class DataSet {
  /**
   * creates a new raw data instance for preprocessing data for machine learning
   * @example
   * const dataset = new jsk.DataSet(csvData);
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
        
    return utils.pivotArrays(vectorArrays);
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
        return utils.StandardScaler(modifiedColumn);
      case 'log':
        return utils.LogScaler(modifiedColumn);
      case 'exp':
        return utils.ExpScaler(modifiedColumn);
      case 'normalize':
      default:
        return utils.MinMaxScaler(modifiedColumn);
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