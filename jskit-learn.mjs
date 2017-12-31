'use strict';
import { default as csv } from 'csvtojson';
import { default as ml } from 'ml';

export async function loadCSV(filepath) {
  const csvData = [];
  return new Promise((resolve, reject) => {
    csv()
    .fromFile(filepath)
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

export const preprocessing = {
  RawData: class RawData {
    constructor(data=[]) {
      this.data = data;
      this.labels = new Map();
      this.encoders = new Map();
    }
    columnArray(name, options) {
      const config = Object.assign({
        prefilter: () => true,
        filter: () => true,
        replace: {
          test: undefined,
          value: undefined,
        },
        parseInt: false,
        parseIntBase: 10,
        parseFloat: false,
      }, options);
      return this.data
        .filter(config.prefilter)
        .reduce((result, val, index, arr) => { 
          let objVal = val[ name ];
          let returnVal = (typeof config.replace.test === 'function')
            ? config.replace.test(objVal)
              ? typeof config.replace.value === 'function'
                ? config.replace.value(result, val, index, arr)
                : config.replace.value
              : objVal
            : objVal;
          if (config.filter(returnVal)) {
            if (config.parseInt) result.push(parseInt(returnVal, config.parseIntBase));
            else  if (config.parseFloat) result.push(parseFloat(returnVal));
            else result.push(returnVal);
          }
        return result;
      }, []);
    }
    columnReplace(name, options) {
      const config = Object.assign({
        strategy: 'mean',
        empty: true,
        arrayOptions: {
          parseFloat: true,
          filter: val => val,
        },
        labelOptions:{},
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
            value: (result, val, index, arr) => replaceVal[ index ],
          };
          break;
        default:
          replaceVal = ml.Stat.array[ config.strategy ](this.columnArray(name, config.arrayOptions));
          replace.value = replaceVal;
          break;  
      }
      return this.columnArray(name, {
        replace,
      });
    }
    labelEncoder(name, options) {
      const config = Object.assign({
        n_values: "auto",
        categorical_features: "all",
        dtype: np.float64,
        sparse: true,
        handle_unknown: 'error',
        binary: false,
      }, options);
      const labelData = config.data || this.columnArray(name, config.columnArrayOptions);
      const labels = new Map(
        Array.from(new Set(labelData).values())
          .reduce((result, val, i, arr) => {
            result.push([ val, i ]);
            result.push([ i, val ]);
            return result;
          }, [])
      );
      this.labels.set(name, labels);
      const labeledData = (config.binary)
        ? labelData.map(label => {
          // console.log(label);
          if (!label) return 0;
          switch (label) {
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
        })
        : labelData.map(label => labels.get(label));
      return labeledData;
    }
    labelDecode(name, options) {
      const config = Object.assign({
      }, options);
      const labelData = config.data || this.columnArray(name, config.columnArrayOptions);
      return labelData.map(val => this.labels.get(name).get(val));
    }
    oneHotEncoder(name, options) {
      const config = Object.assign({
        n_values: "auto",
        categorical_features: "all",
        dtype: np.float64,
        sparse: True,
        handle_unknown: 'error'
      }, options);
    }
    fitColumns(options) {
      const config = Object.assign({
        columns: [
        ],
      }, options);
      const fittedColumns = config.columns
        .reduce((result, val, index, arr) => { 
          const replacedColumn = this.columnReplace(val.name, val.options)
            .map(columnVal => ({ [ val.name ]: columnVal }));
          result[ val.name ] = replacedColumn;
          return result;
        }, {});
      if (Object.keys(fittedColumns)) {
        const columnNames = Object.keys(fittedColumns);
        const fittedData = fittedColumns[ config.columns[ 0 ].name ]
          .reduce((result, val, index, arr) => {
            const returnObj = {};
            columnNames.forEach(colName => {
              returnObj[ colName ] = fittedColumns[ colName ][ index ][colName];
            })
            result.push(returnObj)
            return result;
          }, []);
        this.data = this.data.map((val, index) => Object.assign(val,fittedData[index]));
      }
      return this.data;
    }
  }
};

// export preprocessing
