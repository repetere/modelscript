import { ml, } from './ml';
import { util as utils, } from './util';

const transformConfigMap = {
  scale: 'scaleOptions',
  descale: 'descaleOptions',
  label: 'labelOptions',
  labelEncoder: 'labelOptions',
  labeldecode: 'labelOptions',
  labelDecode: 'labelOptions',
  labelDecoder: 'labelOptions',
  onehot: 'oneHotOptions',
  oneHot: 'oneHotOptions',
  oneHotEncode: 'oneHotOptions',
  oneHotEncoder: 'oneHotOptions',
  reducer: 'reducerOptions',
  reduce: 'reducerOptions',
  merge: 'mergeData',
};

/**
 * class for manipulating an array of objects, typically from CSV data
 * @class DataSet
 * @memberOf preprocessing
 */
export class DataSet {
  /**
   * Allows for fit transform short hand notation
   * @example
DataSet.getTransforms({
  Age: ['scale',],
  Rating: ['label',],  }); //=> [
//   {
//    name: 'Age', options: { strategy: 'scale', }, },
//   },
//   { 
//    name: 'Rating', options: { strategy: 'label', }, 
//   },
// ];
   * @param {Object} transforms 
   * @returns {Array<Object>} returns fit columns, columns property
   */
  static getTransforms(transforms = {}) {
    return Object.keys(transforms).reduce((result, columnName) => {
      const transformColumnObject = transforms[ columnName ];
      const transformObject = {
        name: columnName,
        options: {
          strategy: (Array.isArray(transformColumnObject))
            ? transformColumnObject[0]
            : transformColumnObject,
        },
      };
      if (Array.isArray(transformColumnObject) && transformColumnObject.length > 1) {
        transformObject.options[ transformConfigMap[transformColumnObject[ 0 ]] ] = transformColumnObject[ 1 ];
      }
      result.push(transformObject);
      return result;
    }, []);
  }
  /**
   * returns an array of objects by applying labels to matrix of columns
   * @example
const data = [{ Age: '44', Salary: '44' },
{ Age: '27', Salary: '27' }]
const AgeDataSet = new MS.DataSet(data);
const dependentVariables = [ [ 'Age', ], [ 'Salary', ], ];
const AgeSalMatrix = AgeDataSet.columnMatrix(dependentVariables); // =>
//  [ [ '44', '72000' ],
//  [ '27', '48000' ] ];
MS.DataSet.reverseColumnMatrix({vectors:AgeSalMatrix,labels:dependentVariables}); // => [{ Age: '44', Salary: '44' },
{ Age: '27', Salary: '27' }]
   * 
   * @param {*} options 
   * @param {Array[]} options.vectors - array of vectors
   * @param {String[]} options.labels - array of labels
   * @returns {Object[]} an array of objects with properties derived from options.labels
   */
  static reverseColumnMatrix(options = {}) {
    const { vectors, labels, } = options;
    const features = (Array.isArray(labels) && Array.isArray(labels[ 0 ]))
      ? labels
      : labels.map(label => [label, ]);
    return vectors.reduce((result, val) => { 
      result.push(val.reduce((prop, value, index) => { 
        prop[ features[ index ][ 0 ] ] = val[index];
        return prop;
      }, {}));
      return result;
    }, []);
  }
  static reverseColumnVector(options = {}) {
    const { vector, labels, } = options;
    const features = (Array.isArray(labels) && Array.isArray(labels[ 0 ]))
      ? labels
      : labels.map(label => [label, ]);
    return vector.reduce((result, val) => {
      result.push(
        { [ features[ 0 ][ 0 ] ]: val, }
      );
      return result;
    }, []);
  }
  /**
   * Returns an object into an one hot encoded object
   * @example
const labels = ['apple', 'orange', 'banana',];
const prefix = 'fruit_';
const name = 'fruit';
const options = { labels, prefix, name, };
const data = {
  fruit: 'apple',
};
EncodedCSVDataSet.encodeObject(data, options); // => { fruit_apple: 1, fruit_orange: 0, fruit_banana: 0, }
   * @param {Object} data - object to encode 
   * @param {{labels:Array<String>,prefix:String,name:String}} options - encoded object options
   * @returns {Object} one hot encoded object
   */
  static encodeObject(data, options) {
    const { labels, prefix, name,  } = options;
    const encodedData = labels.reduce((encodedObj, label) => { 
      const oneHotLabelArrayName = `${prefix}${label}`;
      encodedObj[oneHotLabelArrayName] = (data[name].toString() === label.toString()) ? 1 : 0;
      return encodedObj;
    }, {});
    return encodedData;
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
  static oneHotEncoder(name, options) {
    const config = Object.assign({
    }, options);
    const labelData = config.data || this.columnArray(name, config.columnArrayOptions);
    const labels = Array.from(new Set(labelData).values());
    const prefix = config.prefix||`${name}_`;
    const encodedData = labelData.reduce(
      (result, val, index, arr) => {
        labels.forEach(encodedLabel => {
          const oneHotLabelArrayName = `${prefix}${encodedLabel}`;
          const oneHotVal = (val === encodedLabel) ? 1 : 0;
          if (Array.isArray(result[oneHotLabelArrayName])) {
            result[oneHotLabelArrayName].push(oneHotVal);
          } else {
            result[oneHotLabelArrayName] = [oneHotVal,];
          }
        });
        return result;
      }, {});
    this.encoders.set(name, {
      name,
      labels,
      prefix,
    });
    return encodedData;
  }
  /**
   * Return one hot encoded data
   * @example
const csvData = [{
    'Country': 'Brazil',
    'Age': '44',
    'Salary': '72000',
    'Purchased': 'N',
  },
  {
    'Country': 'Mexico',
    'Age': '27',
    'Salary': '48000',
    'Purchased': 'Yes',
  },
  ...
];
const EncodedCSVDataSet = new ms.preprocessing.DataSet(csvData);
EncodedCSVDataSet.fitColumns({
  columns: [
    {
      name: 'Country',
      options: { strategy: 'onehot', },
    },
  ],
});

EncodedCSVDataSet.oneHotDecoder('Country);// =>
// [ { Country: 'Brazil' },
//  { Country: 'Mexico' },
//  { Country: 'Ghana' },
//  { Country: 'Mexico' },
//   ...]
   * @param {string} name - column name 
   * @param options 
   * @returns {Array<Object>} returns an array of objects from an one hot encoded column
   */
  static oneHotDecoder(name, options) {
    const config = Object.assign({
      // handle_unknown: 'error'
    }, options);
    const encoderMap = config.encoders || this.encoders;
    const prefix = config.prefix || encoderMap.get(name).prefix;
    const labels = config.labels || encoderMap.get(name).labels;
    const encodedData = config.data || this.oneHotColumnArray(name, config.oneHotColumnArrayOptions);
    // console.log({ encodedData, encoderMap, prefix });
    return encodedData.reduce((result, val) => {
      const columnNames = Object.keys(val).filter(prop => val[ prop ] === 1 && (labels.indexOf(prop.replace(prefix, ''))!==-1 || labels.map(label=>String(label)).indexOf(prop.replace(prefix, ''))!==-1));
      const columnName = columnNames[ 0 ]||''; 
      // console.log({ columnName, columnNames, labels, val},Object.keys(val));
      const datum = {
        [ name ]: columnName.replace(prefix, ''),
      };
      result.push(datum);
      return result;
    }, []);
  }
  /**
   * returns a list of objects with only selected columns as properties
 * @example
const data = [{ Age: '44', Salary: '44' , Height: '34' },
{ Age: '27', Salary: '44' , Height: '50'  }]
const AgeDataSet = new MS.DataSet(data);
const cols = [ 'Age', 'Salary' ];
const selectedCols = CSVDataSet.selectColumns(cols); // => [{ Age: '44', Salary: '44' },
{ Age: '27', Salary: '27' }]
   * 
   * @param {String[]} names - array of selected columns
   * @param {*} options 
   * @returns {Object[]} an array of objects with properties derived from names
   */
  static selectColumns(names, options = {}) {
    const config = Object.assign({}, options);
    const data = config.data || this.data;
    return data.reduce((result, val) => {
      const selectedData = {};
      names.forEach(name => {
        selectedData[ name ] = val[ name ];
      });
      result.push(selectedData);
      return result;
    }, []);
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
  static columnArray(name, options = {}) {
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
    const data = config.data || this.data;
    const modifiedColumn = data
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
   * returns a matrix of values by combining column arrays into a matrix
   * @example const csvObj = new DataSet([{col1:1,col2:5},{col1:2,col2:6}]);
csvObj.columnMatrix([['col1',{parseInt:true}],['col2']]); // =>
//[ 
//  [1,5], 
//  [2,6], 
//]
  * @param {Array} [vectors=[]] - array of arguments for columnArray to merge columns into a matrix
  * @param {Array} [data=[]] - array of data to convert to matrix
  * @returns {Array} a matrix of column values 
  */
  static columnMatrix(vectors = [], data = []) {
    const options = (data.length) ? { data, } : {};
    const columnVectors = (Array.isArray(vectors) && Array.isArray(vectors[ 0 ]))
      ? vectors
      : vectors.map(vector => [vector, options,]);
    const vectorArrays = columnVectors
      .map(vec => DataSet.columnArray.call(this, ...vec));
        
    return utils.pivotArrays(vectorArrays);
  }
  /**
   * creates a new raw data instance for preprocessing data for machine learning
   * @example
   * const dataset = new ms.DataSet(csvData);
   * @param {Object[]} dataset
   * @returns {this} 
   */
  constructor(data = [], options) {
    this.config = Object.assign({
      debug: true,
    }, options);
    this.data = [...data,];
    this.labels = new Map();
    this.encoders = new Map();
    this.scalers = new Map();
    this.selectColumns = DataSet.selectColumns;
    this.columnArray = DataSet.columnArray;
    this.encodeObject = DataSet.encodeObject;
    this.oneHotEncoder = DataSet.oneHotEncoder;
    this.oneHotDecoder = DataSet.oneHotDecoder;
    this.columnMatrix = DataSet.columnMatrix;
    this.reverseColumnMatrix = DataSet.reverseColumnMatrix;
    this.reverseColumnVector = DataSet.reverseColumnVector;
    this.getTransforms = DataSet.getTransforms;
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
   * Returns a new array of scaled values which can be reverse (descaled). The scaling transformations are stored on the DataSet
   * @example
//dataset.columnArray('Age') => [ '44','27','30','38','40','35',38.77777777777778,'48','50','37' ]
dataset.columnScale('Age',{strategy:'log'}) // => [ 3.784189633918261,
  3.295836866004329, 3.4011973816621555, 3.6375861597263857, 3.6888794541139363, 3.5553480614894135, 3.657847344866208, 3.8712010109078907, 3.912023005428146, 3.6109179126442243 ]
dataset.scalers.get('Age').scale(45) // => 3.8066624897703196
dataset.scalers.get('Age').descale(3.8066624897703196) // => 45
//this supports, log/exponent, minmax/normalization and standardscaling
   * @param {string} name - name - csv column header, or JSON object property name 
   * @param {string} [options.strategy="log"] - strategy for scaling values 
   * @returns {number[]} returns an array of scaled values
   */
  columnScale(name, options = {}) {
    const input = (typeof options === 'string')
      ? { strategy: options, }
      : options;
    const config = Object.assign({
      strategy: 'log',
    }, input);
    let scaleData = config.data || this.columnArray(name, config.columnArrayOptions);
    let scaledData;
    let transforms;
      
    scaleData = scaleData.filter(datum => typeof datum !== 'undefined')
      .map((datum, i) => {
        if (typeof datum !== 'number') {
          if (this.config.debug) {
            console.error(TypeError(`Each value must be a number, error at index [${i}]`));
          }
          const num = Number(datum);
          if (isNaN(num)) throw TypeError('Only numerical values can be scaled i: ' + i + ' datum:' + datum);
          return num;
        } else return datum;
      });
    switch (config.strategy) {
    case 'standard':
      transforms = utils.StandardScalerTransforms(scaleData);     
      this.scalers.set(name, {
        name,
        scale: transforms.scale,
        descale: transforms.descale,
        components: transforms.components,
      });
      scaledData = transforms.values;
      break;
    case 'normalize':
    case 'minmax':
      transforms = utils.MinMaxScalerTransforms(scaleData);     
      this.scalers.set(name, {
        name,
        scale: transforms.scale,
        descale: transforms.descale,
        components: transforms.components,
      });
      scaledData = transforms.values;
      break;
    case 'log':
    default:
      this.scalers.set(name, {
        name,
        scale: Math.log,
        descale: Math.exp,
        components: {
          average : utils.avg(scaleData),
          standard_dev : utils.sd(scaleData),
          maximum : utils.max(scaleData),
          minimum : utils.min(scaleData),
        },
      });
      scaledData = utils.LogScaler(scaleData);
      break;
    }
    return scaledData;
  }
  /**
   * Returns a new array of descaled values
   * @example
//dataset.columnArray('Age') => [ '44','27','30','38','40','35',38.77777777777778,'48','50','37' ]
const scaledData = [ 3.784189633918261,
  3.295836866004329, 3.4011973816621555, 3.6375861597263857, 3.6888794541139363, 3.5553480614894135, 3.657847344866208, 3.8712010109078907, 3.912023005428146, 3.6109179126442243 ]
dataset.columnDescale('Age') // => [ '44','27','30','38','40','35',38.77777777777778,'48','50','37' ]
   * @param {string} name - name - csv column header, or JSON object property name 
   * @param {string} [options.strategy="log"] - strategy for scaling values 
   * @returns {number[]} returns an array of scaled values
   */
  columnDescale(name, options) {
    const config = Object.assign({ }, options);
    const scaledData = config.data || this.columnArray(name, config.columnArrayOptions);
    const descaleFunction = this.scalers.get(name).descale;
    return scaledData.map(descaleFunction);
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
      binary: false,
    }, options);
    const labelData = config.data || this.columnArray(name, config.columnArrayOptions);
    const labels = new Map(
      Array.from(new Set(labelData).values())
        .reduce((result, val, i, arr) => {
          result.push([val, i,]);
          result.push([i, val,]);
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
   * Return one hot encoded data
   * @example
const csvData = [{
    'Country': 'Brazil',
    'Age': '44',
    'Salary': '72000',
    'Purchased': 'N',
  },
  {
    'Country': 'Mexico',
    'Age': '27',
    'Salary': '48000',
    'Purchased': 'Yes',
  },
  ...
];
const EncodedCSVDataSet = new ms.preprocessing.DataSet(csvData);
EncodedCSVDataSet.fitColumns({
  columns: [
    {
      name: 'Country',
      options: { strategy: 'onehot', },
    },
  ],
});

EncodedCSVDataSet.oneHotColumnArray('Country);// =>
// [ { Country_Brazil: 1, Country_Mexico: 0, Country_Ghana: 0 },
//   { Country_Brazil: 0, Country_Mexico: 1, Country_Ghana: 0 },
//   { Country_Brazil: 0, Country_Mexico: 0, Country_Ghana: 1 },
//   ...]
   * @param {string} name - column name 
   * @param options 
   * @returns {Array<Object>} returns an array of objects from an one hot encoded column
   */
  oneHotColumnArray(name, options) {
    const config = Object.assign({
      // handle_unknown: 'error'
    }, options);
    const labels = config.labels || this.encoders.get(name).labels;
    const prefix = config.prefix || this.encoders.get(name).prefix;
    return this.selectColumns(labels.map(label => `${prefix}${label}`));
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
   * Inverses transform on an object
   * @example
DataSet.data; //[{
//   Age: 0.6387122698222066,
//   Salary: 72000,
//   Purchased: 0,
//   Country_Brazil: 1,
//   Country_Mexico: 0,
//   Country_Ghana: 0,
// }, ...] 
DataSet.inverseTransformObject(DataSet.data[0]); // => {
//  Country: 'Brazil', 
//  Age: 44, 
//  Salary: 72000, 
//  Purchased: 'N', 
// };
   * @param data 
   * @param options 
   * @returns {Object} returns object with inverse transformed data
   */
  inverseTransformObject(data, options) {
    const config = Object.assign({
      removeValues: false,
    }, options);
    const removedColumns = [];
    let transformedObject = Object.assign({}, data);
    const columnNames = Object.keys(this.data[ 0 ]);
    const scaledData = columnNames.reduce((scaleObject, columnName) => {
      if (this.scalers.has(columnName)){
        scaleObject[ columnName ] = this.scalers.get(columnName).descale(data[ columnName ]);
      }
      return scaleObject;
    }, {});
    const labeledData = columnNames.reduce((labelObject, columnName) => {
      if (this.labels.has(columnName)){
        labelObject[ columnName ] = this.labels.get(columnName).get(data[ columnName ]);
      }
      return labelObject;
    }, {});
    const encodedData = columnNames.reduce((encodedObject, columnName) => {
      if (this.encoders.has(columnName)) {
        const encoded = this.oneHotDecoder(columnName, {
          data: [data,],
        });
        // console.log({encoded})
        encodedObject = Object.assign({}, encodedObject, encoded[ 0 ]);
        if (config.removeValues) {
          removedColumns.push(...this.encoders.get(columnName).labels.map(label=>`${this.encoders.get(columnName).prefix}${label}`));
        }
      }
      return encodedObject;
    }, {});
    transformedObject = Object.assign(transformedObject, scaledData, labeledData, encodedData);
    if (config.removeValues && removedColumns.length) {
      transformedObject = Object.keys(transformedObject).reduce((removedObject, propertyName) => {
        if (removedColumns.indexOf(propertyName) === -1) {
          removedObject[ propertyName ] = transformedObject[ propertyName ];
        }
        return removedObject;
      }, {});
    }
    return transformedObject;
  }
  /**
   * transforms an object and replaces values that have been scaled or encoded
   * @example
DataSet.transformObject({
  'Country': 'Brazil',
  'Age': '44',
  'Salary': '72000',
  'Purchased': 'N',
}); // =>
// { 
//  Country: 'Brazil',
//  Age: 3.784189633918261,
//  Salary: '72000',
//  Purchased: 'N',
//  Country_Brazil: 1,
//  Country_Mexico: 0,
//  Country_Ghana: 0
// }
   * @param data 
   * @param options 
   * @returns {Object} 
   */
  transformObject(data, options) {
    const config = Object.assign({
      removeValues: false,
      checkColumnLength: true,
    }, options);
    const removedColumns = [];
    // if (Array.isArray(data)) return data.map(datum => this.transformObject);
    const encodedColumns = [].concat(...Array.from(this.encoders.keys())
      .map(encodedColumn => this.encoders.get(encodedColumn).labels
        .map(label=>`${this.encoders.get(encodedColumn).prefix}${label}`)
      )
    );
    const currentColumns = Object.keys(this.data[ 0 ]);
    const objectColumns = Object.keys(data).concat(encodedColumns);
    // console.log({ encodedColumns,currentColumns,objectColumns });
    const differentKeys = objectColumns.reduce((diffKeys, val) => {
      if (currentColumns.indexOf(val) === -1 && encodedColumns.indexOf(val) === -1) diffKeys.push(val);
      return diffKeys;
    }, []);
    let transformedObject = Object.assign({}, data);
    if (config.checkColumnLength && currentColumns.length !== objectColumns.length && currentColumns.length+encodedColumns.length !== objectColumns.length ) {
      throw new RangeError(`Object must have the same number of keys (${objectColumns.length}) as data in your dataset(${currentColumns.length})`);
    } else if (config.checkColumnLength && differentKeys.length) {
      throw new ReferenceError(`Object must have identical keys as data in your DataSet. Invalid keys: ${differentKeys.join(',')}`);
    } else {
      const scaledData = objectColumns.reduce((scaleObject, columnName) => {
        if (this.scalers.has(columnName)){
          scaleObject[ columnName ] = this.scalers.get(columnName).scale(data[ columnName ]);
        }
        return scaleObject;
      }, {});
      const labeledData = objectColumns.reduce((labelObject, columnName) => {
        if (this.labels.has(columnName)){
          labelObject[ columnName ] = this.labels.get(columnName).get(data[ columnName ]);
        }
        return labelObject;
      }, {});
      const encodedData = objectColumns.reduce((encodedObject, columnName) => {
        if (this.encoders.has(columnName)) {
          encodedObject = Object.assign({}, encodedObject, this.encodeObject(data, this.encoders.get(columnName)));
          if (config.removeValues) {
            removedColumns.push(columnName);
          }
        }
        return encodedObject;
      }, {});
      transformedObject = Object.assign(transformedObject, scaledData, labeledData, encodedData);
      if (config.removeValues && removedColumns.length) {
        transformedObject = Object.keys(transformedObject).reduce((removedObject, propertyName) => {
          if (removedColumns.indexOf(propertyName) === -1) removedObject[ propertyName ] = transformedObject[ propertyName ];
          return removedObject;
        }, {});
      }
    }
    return transformedObject;
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
    case 'scale':
      replaceVal = this.columnScale(name, config.scaleOptions);
      replace = {
        test: val => true,
        value: (result, val, index, arr) => replaceVal[index],
      };
      break;
    case 'descale':
      replaceVal = this.columnDescale(name, config.descaleOptions);
      replace = {
        test: val => true,
        value: (result, val, index, arr) => replaceVal[index],
      };
      break;
    case 'label':
    case 'labelEncoder':
      replaceVal = this.labelEncoder(name, config.labelOptions);
      replace = {
        test: val => true,
        value: (result, val, index, arr) => replaceVal[index],
      };
      break;
    case 'labeldecode':
    case 'labelDecode':
    case 'labelDecoder':
      replaceVal = this.labelDecode(name, config.labelOptions);
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
      // break;
    case 'reducer':
    case 'reduce':
      replaceVal = this.columnReducer(name, config.reducerOptions); 
      return replaceVal;  
    case 'merge':
      replaceVal = this.columnMerge(name, config.mergeData); 
      return replaceVal; 
    case 'parseNumber':
      replaceVal = this.columnArray(name).map(num => Number(num)); 
      return replaceVal; 
    default:
      replaceVal = ml.ArrayStat[config.strategy](this.columnArray(name, config.arrayOptions));
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
  * @param {Boolean} options.returnData - return updated DataSet data property 
  * @param {Object[]} options.columns - {name:'columnName',options:{strategy:'mean',labelOoptions:{}},}
  * @returns {Object[]}
  */
  fitColumns(options = {}) {
    const config = Object.assign({
      returnData:true,
      columns: [],
    }, options);
    if ( !options.columns || Array.isArray(options.columns) ===false) {
      config.columns = (options.columns)
        ? DataSet.getTransforms(options.columns)
        : DataSet.getTransforms(options);
    }

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
    if (Object.keys(fittedColumns) && Object.keys(fittedColumns).length) {
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
  /**
   * Mutate dataset data by inversing all transforms
   * @example
DataSet.data;
// [{ 
//  Country: 'Brazil',
//  Age: 3.784189633918261,
//  Salary: '72000',
//  Purchased: 'N',
//  Country_Brazil: 1,
//  Country_Mexico: 0,
//  Country_Ghana: 0
// },
// ...
// ]
DataSet.fitInverseTransforms(); // =>
// [{
//   'Country': 'Brazil',
//   'Age': '44',
//   'Salary': '72000',
//   'Purchased': 'N',
// },
// ...
// ]
   * @param options 
   */
  fitInverseTransforms(options = {}) {
    const config = Object.assign({
      returnData: true,
    }, options);
    this.data = this.data.map(val => {
      return (options.removeValues)
        ? this.inverseTransformObject(val, options)
        : Object.assign({}, val, this.inverseTransformObject(val, options));
    });
    return config.returnData ? this.data : this;
  }
  /**
   * Mutate dataset data with all transforms
   * @param options
   * @example
DataSet.data;
// [{
//   'Country': 'Brazil',
//   'Age': '44',
//   'Salary': '72000',
//   'Purchased': 'N',
// },
// ...
// ]
DataSet.fitTransforms(); // =>
// [{ 
//  Country: 'Brazil',
//  Age: 3.784189633918261,
//  Salary: '72000',
//  Purchased: 'N',
//  Country_Brazil: 1,
//  Country_Mexico: 0,
//  Country_Ghana: 0
// },
// ...
// ] 
   */
  fitTransforms(options = {}) {
    const config = Object.assign({
      returnData: true,
    }, options);
    this.data = this.data.map(val => {
      return (options.removeValues)
        ? this.transformObject(val, options)
        : Object.assign({}, val, this.transformObject(val, options));
    });
    return config.returnData ? this.data : this;
  }
}