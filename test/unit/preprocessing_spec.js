'use strict';
const ms = require('../../dist/modelscript.cjs');
const ml = require('ml');
const expect = require('chai').expect;
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
{
  'Country': 'Ghana',
  'Age': '30',
  'Salary': '54000',
  'Purchased': 'No',
},
{
  'Country': 'Mexico',
  'Age': '38',
  'Salary': '61000',
  'Purchased': 'f',
},
{
  'Country': 'Ghana',
  'Age': '40',
  'Salary': '',
  'Purchased': 'Yes',
},
{
  'Country': 'Brazil',
  'Age': '35',
  'Salary': '58000',
  'Purchased': 'Yes',
},
{
  'Country': 'Mexico',
  'Age': '',
  'Salary': '52000',
  'Purchased': 'false',
},
{
  'Country': 'Brazil',
  'Age': '48',
  'Salary': '79000',
  'Purchased': 'Yes',
},
{
  'Country': 'Ghana',
  'Age': '50',
  'Salary': '83000',
  'Purchased': 'No',
},
{
  'Country': 'Brazil',
  'Age': '37',
  'Salary': '67000',
  'Purchased': 'Yes',
},
];
const unmodifiedCSVData = [...csvData,];

describe('preprocessing', function() {
  describe('DataSet class', () => {
    const CSVDataSet = new ms.preprocessing.DataSet(csvData);
    describe('constructor', () => {
      it('should instantiate a new DataSet Class', () => {
        expect(ms.preprocessing).to.be.an('object');
        expect(ms.preprocessing.DataSet).to.be.a('function');
        expect(CSVDataSet).to.be.instanceof(ms.preprocessing.DataSet);
      });
    });
    describe('filterColumn', () => {
      it('should by default return full dataset', () => {
        expect(CSVDataSet.filterColumn()).to.eql(CSVDataSet.data);
      });
      it('should filter data by a filter function', () => {
        expect(CSVDataSet.filterColumn(row => row.Salary.toString() === '83000')).to.have.lengthOf(1);
      });
    })
    describe('columnMatrix', () => { 
      it('should create a matrix of values from columns', () => {
        const AgeSalMatrix = CSVDataSet.columnMatrix([ [ 'Age', ], [ 'Salary', ], ]);
        const AgeArray = CSVDataSet.columnArray('Age');
        expect(AgeSalMatrix).to.be.lengthOf(AgeArray.length);
        expect(AgeSalMatrix[ 0 ][0]).to.eql(AgeArray[0]);
      });
      it('should handle invalid columns', () => {
        const invalidMatrix = CSVDataSet.columnMatrix([
          ['iojf',],
        ]);
        expect(invalidMatrix).to.be.an('Array');
        expect(invalidMatrix[ 0 ][ 0 ]).to.be.undefined;
      });
    });
    describe('static reverseColumnMatrix', () => {
      it('should reverse a matrix of values into labeled object', () => {
        const dependentVariables = [ [ 'Age', ], [ 'Salary', ], ];
        const AgeSalMatrix = CSVDataSet.columnMatrix(dependentVariables);
        const AgeArray = CSVDataSet.columnArray('Age');
        const reversedAgeSalMatrix = ms.DataSet.reverseColumnMatrix({ vectors: AgeSalMatrix, labels: dependentVariables, });
        const selectedCols = CSVDataSet.selectColumns([ 'Age', 'Salary' ]);
        expect(AgeSalMatrix).to.be.lengthOf(AgeArray.length);
        expect(reversedAgeSalMatrix).to.be.lengthOf(AgeArray.length);
        expect(reversedAgeSalMatrix).to.eql(selectedCols);
      });
    });
    describe('static reverseColumnVector', () => {
      it('should reverse a vector of values into labeled object', () => {
        const dependentVariables = [ [ 'Age', ], [ 'Salary', ], ];
        const AgeArray = CSVDataSet.columnArray('Age');
        const reversedAgeSalVector = ms.DataSet.reverseColumnVector({ vector: AgeArray, labels: dependentVariables, });
        const selectedCols = CSVDataSet.selectColumns([ 'Age', ]);
        expect(reversedAgeSalVector).to.be.lengthOf(AgeArray.length);
        expect(reversedAgeSalVector).to.eql(selectedCols);
      });
    });
    describe('selectColumns', () => { 
      it('should return a list of objects with only selected columns as properties', () => {
        const cols = [ 'Age', 'Salary' ];
        const selectedCols = CSVDataSet.selectColumns(cols);
        expect(Object.keys(selectedCols[ 0 ])).to.eql(cols);
        expect(Object.keys(selectedCols[ 0 ])).to.have.lengthOf(cols.length);
        expect(selectedCols[ 0 ].Age).to.eql(CSVDataSet.data[ 0 ].Age);
        expect(selectedCols[ 0 ].Salary).to.eql(CSVDataSet.data[ 0 ].Salary);
      });
    });
    describe('columnArray', () => {
      const countryColumn = CSVDataSet.columnArray('Country');
      it('should select a column from CSV Data by name', () => {
        expect(countryColumn.length).to.equal(10);
        expect(countryColumn[0]).to.equal(csvData[0].Country);
      });
      it('should prefilter the dataset', () => {
        const countryColumnPreFiltered = CSVDataSet.columnArray('Country', {
          prefilter: row => row.Country === 'Ghana',
        });
        expect(countryColumnPreFiltered.length).to.equal(3);
      });
      it('should filter the dataset', () => {
        const countryColumnPostFiltered = CSVDataSet.columnArray('Country', {
          filter: val => val === 'Brazil',
        });
        expect(countryColumnPostFiltered.length).to.equal(4);
      });
      it('should replace values in dataset', () => {
        const countryColumnReplaced = CSVDataSet.columnArray('Country', {
          replace: {
            test: val => val === 'Brazil',
            value: 'China',
          },
        });
        const ageColumnReplacedFuncVal = CSVDataSet.columnArray('Age', {
          replace: {
            test: val => val,
            value: (result, val, index, arr, name) => parseInt(val[name]) * 10,
          },
        });
        expect(ageColumnReplacedFuncVal[0]).to.equal(440);
        expect(countryColumnReplaced[0]).to.equal('China');
      });
      it('should convert vals to numbers', () => {
        const ageColumnInt = CSVDataSet.columnArray('Age', {
          parseInt: true,
        });
        const ageColumnFloat = CSVDataSet.columnArray('Age', {
          parseFloat: true,
        });
        expect(ageColumnInt[0]).to.be.a('number');
        expect(ageColumnFloat[0]).to.be.a('number');
      });
      it('should standardize scale values', () => {
        const salaryColumn = CSVDataSet.columnArray('Salary', {
          prefilter: row => row.Salary,
          parseInt: true,
        });
        const standardScaleSalary = CSVDataSet.columnArray('Salary', {
          prefilter: row => row.Salary,
          scale: 'standard',
        });
        expect(JSON.stringify(standardScaleSalary)).to.equal(JSON.stringify(ms.util.StandardScaler(salaryColumn)));
        expect(ms.util.sd(standardScaleSalary)).to.equal(1);
        expect(parseInt(Math.round(ms.util.mean(standardScaleSalary)))).to.equal(0);
      });
      it('should z-score / MinMax scale values', () => {
        const salaryColumn = CSVDataSet.columnArray('Salary', {
          prefilter: row => row.Salary,
          parseInt: true,
        });
        const minMaxScaleSalary = CSVDataSet.columnArray('Salary', {
          prefilter: row => row.Salary,
          scale: 'minMax',
        });
        // console.log('ms.util.mean(minMaxScaleSalary)', ms.util.mean(minMaxScaleSalary));
        expect(JSON.stringify(minMaxScaleSalary)).to.equal(JSON.stringify(ms.util.MinMaxScaler(salaryColumn)));
        expect(parseInt(Math.round(ms.util.sd(minMaxScaleSalary)))).to.equal(0);
        expect(parseInt(Math.round(ms.util.mean(minMaxScaleSalary)))).to.equal(0);
      });
      it('should log scale values', () => {
        const salaryColumn = CSVDataSet.columnArray('Salary', {
          prefilter: row => row.Salary,
          parseInt: true,
        });
        const logScaleSalary = CSVDataSet.columnArray('Salary', {
          prefilter: row => row.Salary,
          scale: 'log',
        });
        expect(JSON.stringify(logScaleSalary)).to.equal(JSON.stringify(ms.util.LogScaler(salaryColumn)));
      });
      it('should exp scale values', () => {
        const salaryColumn = CSVDataSet.columnArray('Salary', {
          prefilter: row => row.Salary,
          parseInt: true,
        });
        const logScaleSalary = CSVDataSet.columnArray('Salary', {
          prefilter: row => row.Salary,
          scale: 'exp',
        });
        expect(JSON.stringify(logScaleSalary)).to.equal(JSON.stringify(ms.util.ExpScaler(salaryColumn)));
      });
    });
    describe('labelEncoder', () => {
      const purchasedColumn = CSVDataSet.columnArray('Purchased');
      let encodedPurchased;
      let encodedCountry;
      it('should binary label encode', () => {
        const binaryEncodedColumn = CSVDataSet.labelEncoder('Purchased', {
          data: purchasedColumn,
          binary: true,
        });
        encodedPurchased = binaryEncodedColumn;
        expect(binaryEncodedColumn).to.include.members([0, 1,]);
      });
      it('should label encode', () => {
        const labelEncodedColumn = CSVDataSet.labelEncoder('Country');
        encodedCountry = labelEncodedColumn;
        // console.log({ CSVDataSet }, CSVDataSet.data);
        expect(labelEncodedColumn).to.include.members([0, 1, 2,]);
        labelEncodedColumn.forEach(lec => expect(lec).to.be.a('number'));
        expect(CSVDataSet.labels.size).equal(2);
      });
      it('should decode labels', () => {
        const decodedCountry = CSVDataSet.labelDecode('Country', { data: encodedCountry, });
        // console.log({ decodedCountry, encodedCountry });
        expect(decodedCountry[0]).to.be.a('string');
        expect(decodedCountry[0]).to.eql('Brazil');
        expect(CSVDataSet.labels.get('Country').get(decodedCountry[0])).to.equal(encodedCountry[0]);
      });
    });
    describe('oneHotEncoder', () => {
      it('should one hot encode', () => {
        const oneHotCountry = CSVDataSet.oneHotEncoder('Country');
        // console.log({ oneHotCountry },CSVDataSet);
        expect(Object.keys(oneHotCountry).length).to.equal(3);
        expect(oneHotCountry).to.haveOwnProperty('Country_Brazil');
        expect(csvData[0].Country).to.equal('Brazil');
        expect(oneHotCountry.Country_Brazil[0]).to.eql(1);
        expect(oneHotCountry.Country_Mexico[0]).to.eql(0);
        expect(oneHotCountry.Country_Ghana[0]).to.eql(0);
        expect(CSVDataSet.encoders.size).to.equal(1);
        expect(CSVDataSet.encoders.has('Country')).to.be.true;
      });
    });
    describe('columnReducer', () => { 
      it('should reduce column and greate a new column', () => {
        const reducer = (result, value, index, arr) => {
          result.push(value * 2);
          return result;
        };
        const DoubleAgeColumn = CSVDataSet.columnReducer('DoubleAge', {
          columnName: 'Age',
          reducer,
        });
        const AgeColumn = CSVDataSet.columnArray('Age');
        // console.log({ DoubleAgeColumn, AgeColumn, });
        expect(AgeColumn[ 0 ] * 2).to.eql(DoubleAgeColumn.DoubleAge[ 0 ]);
        expect(DoubleAgeColumn.DoubleAge).to.eql(AgeColumn.reduce(reducer, []));
      });
    });
    describe('columnReplace', () => {
      it('should label encode', () => {
        const leCountry = CSVDataSet.labelEncoder('Country');
        const crCountry = CSVDataSet.columnReplace('Country', {
          strategy: 'label',
        });
        const cr2Country = CSVDataSet.columnReplace('Country', {
          strategy: 'labelEncoder',
        });
        expect(leCountry).to.have.ordered.members(crCountry);
        expect(leCountry).to.have.ordered.members(cr2Country);
      });
      it('should onehot encode', () => {
        const ohCountry = CSVDataSet.oneHotEncoder('Country');
        const oh1Country = CSVDataSet.columnReplace('Country', {
          strategy: 'onehot',
        });
        const oh2Country = CSVDataSet.columnReplace('Country', {
          strategy: 'oneHot',
        });
        const oh3Country = CSVDataSet.columnReplace('Country', {
          strategy: 'oneHotEncode',
        });
        const oh4Country = CSVDataSet.columnReplace('Country', {
          strategy: 'oneHotEncoder',
        });
        expect(ohCountry).to.deep.eq(oh1Country);
        expect(ohCountry).to.deep.eq(oh2Country);
        expect(ohCountry).to.deep.eq(oh3Country);
        expect(ohCountry).to.deep.eq(oh4Country);
      });
      it('should replace empty values with mean by default', () => {
        const colSalary = CSVDataSet.columnArray('Salary', {
          parseFloat: true,
          filter: val => val,
        });
        const meanColSalary = CSVDataSet.columnReplace('Salary');
        const meanSal = ms.util.mean(colSalary);
        expect(meanColSalary).to.include(meanSal);
      });
      it('should replace empty values with stat function from ml.js', () => {
        const colSalary = CSVDataSet.columnArray('Salary', {
          parseFloat: true,
          filter: val => val,
        });
        const standardDeviationColSalary = CSVDataSet.columnReplace('Salary', { strategy: 'standardDeviation', });
        const sdSal = ms.util.sd(colSalary);
        expect(standardDeviationColSalary).to.include(sdSal);
      });
      it('should replace values by standard scaling', () => {
        const salaryColumn = CSVDataSet.columnArray('Salary', {
          prefilter: row => row.Salary,
          parseInt: true,
        });
        const salaryMean = ms.util.mean(salaryColumn);
        const formattedSalaryColumn = CSVDataSet.columnArray('Salary', {
          replace: {
            test: val => !val,
            value: salaryMean,
          },
          parseFloat: true,
        });
        const scaledSalaryColumn = ms.util.StandardScaler(formattedSalaryColumn);
        const standardScaleSalary = CSVDataSet.columnReplace('Salary', {
          scale: 'standard',
        });
        expect(standardScaleSalary).to.include.ordered.members(scaledSalaryColumn);
      });
    });
    describe('fitColumns', () => {
      const extraColumn = [ 89, 12, 32, 45, 53, 52, 56, 21, 34, 56 ];
      it('should merge columns', () => {
        const fittedOriginalData = new ms.DataSet([...unmodifiedCSVData,]);
        fittedOriginalData.fitColumns({
          columns: [
            { name: 'Age', },
            {
              name: 'Extra',
              options: {
                strategy: 'merge',
                mergeData: extraColumn,
              },
            },
          ],
        });
        expect(fittedOriginalData.columnArray('Extra')).to.eql(extraColumn);
      });
      it('should only merge columns if data length matches', () => { 
        const fittedOriginalData = new ms.DataSet([ ...unmodifiedCSVData, ]);
        const newColumn = fittedOriginalData.columnMerge('err', [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]);
        expect(newColumn).to.be.an('Object');
        expect(newColumn).to.haveOwnProperty('err');
        expect(newColumn.err).to.be.an('array');
        try {
          fittedOriginalData.columnMerge('err', [ 1, 2 ]);
        } catch (e) {
          expect(e).to.be.an('error');
          expect(e.toString()).to.eql(`RangeError: Merged data column must have the same length(2) as the DataSet's length (${10})`);
        }
      });
      it('should fit multiple columns', () => {
        const unmodifiedData = new ms.DataSet(unmodifiedCSVData);
        const fittedOriginalData = new ms.DataSet([...unmodifiedCSVData,]);
        const reducer = (result, value, index, arr) => {
          result.push(value * 2);
          return result;
        };

        const fitdata = fittedOriginalData.fitColumns({
          columns: [
            { name: 'Age', },
            {
              name: 'Salary',
              options: {
                scale: 'standard',
              },
            },
            {
              name: 'DoubleSalary',
              options: {
                strategy:'reduce',
                reducerOptions: {
                  columnName: 'Salary',
                  reducer,
                },
              },
            },
            {
              name: 'Purchased',
              options: {
                strategy: 'label',
                labelOptions: {
                  binary: true,
                },
              },
            },
            {
              name: 'Country',
              options: {
                strategy: 'onehot',
                labelOptions: {
                  binary: true,
                },
              },
            },
          ],
        });
        expect(fitdata).to.eql(fittedOriginalData.data);
        const fitObject = fittedOriginalData.fitColumns({
          returnData: false,
          columns: [
            {
              name: 'DoubleAge',
              options: {
                strategy:'reduce',
                reducerOptions: {
                  columnName: 'Age',
                  reducer,
                },
              },
            },
          ],
        });
        expect(fitObject).to.eql(fittedOriginalData);
        expect(unmodifiedData === fittedOriginalData).to.be.false;
        expect(fittedOriginalData.data).to.not.eq(unmodifiedCSVData);
        expect(fittedOriginalData.columnArray('Age')).to.have.ordered.members(unmodifiedData.columnReplace('Age'));
        expect(fittedOriginalData.columnArray('Salary')).to.have.ordered.members(unmodifiedData.columnReplace('Salary', {
          scale: 'standard',
        }));
      });
    });
  });
});