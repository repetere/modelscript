# ⚠️ REPO MOVED TO https://github.com/repetere/jsonstack-data ⚠️ #





# ModelScript

[![Coverage Status](https://coveralls.io/repos/github/repetere/modelscript/badge.svg?branch=master)](https://coveralls.io/github/repetere/modelscript?branch=master) [![Build Status](https://travis-ci.org/repetere/modelscript.svg?branch=master)](https://travis-ci.org/repetere/modelscript)

## Description

**ModelScript** is a javascript module with simple and efficient tools for data mining and data analysis in JavaScript. **ModelScript** can be used with [ML.js](https://github.com/mljs/ml), [pandas-js](https://github.com/StratoDem/pandas-js), and [numjs](https://github.com/numjs/numjs), to approximate the equivalent R/Python tool chain in JavaScript.

In Python, data preparation is typically done in a DataFrame, ModelScript encourages a more R like workflow where the data preparation is in it's native structure.

### Installation

```sh
$ npm i modelscript
```

### [Full Documentation](https://github.com/repetere/modelscript/blob/master/docs/api.md)

### Usage (basic)

ModelScript is an EcmaScript module and designed to be imported in an ES2015+ environment. In order to use in older environment, please use `const modelscript = require('modelscript/build/modelscript.cjs.js')` for older versions of node and `<script type="text/javascript" src=".../path/to/.../modelscript/build/modelscript.umd.js"/>`

```javascript
"modelscript" : {
  ml:{ //see https://github.com/mljs/ml
    UpperConfidenceBound [Class: UpperConfidenceBound]{ // Implementation of the Upper Confidence Bound algorithm
      predict(), //returns next action based off of the upper confidence bound
      learn(), //single step training method
      train(), //training method for upper confidence bound calculations
    },
    ThompsonSampling [Class: ThompsonSampling]{ //Implementation of the Thompson Sampling algorithm
      predict(), //returns next action based off of the thompson sampling
      learn(), //single step training method
      train(), //training method for thompson sampling calculations
    },
  },
  nlp:{ //see https://github.com/NaturalNode/natural
    ColumnVectorizer [Class: ColumnVectorizer]{ //class creating sparse matrices from a corpus
      get_tokens(), // Returns a distinct array of all tokens after fit_transform
      get_vector_array(), //Returns array of arrays of strings for dependent features from sparse matrix word map
      fit_transform(options), //Fits and transforms data by creating column vectors (a sparse matrix where each row has every word in the corpus as a column and the count of appearances in the corpus)
      get_limited_features(options), //Returns limited sets of dependent features or all dependent features sorted by word count
      evaluateString(testString), //returns word map with counts
      evaluate(testString), //returns new matrix of words with counts in columns
    }
  },
  csv:{
    loadCSV: [Function: loadCSV], //asynchronously loads CSVs, either a filepath or a remote URI
    loadTSV: [Function: loadTSV], //asynchronously loads TSVs, either a filepath or a remote URI
  },
  model_selection: {
    train_test_split: [Function: train_test_split], // splits data into training and testing sets
    cross_validation_split: [Function: kfolds], //splits data into k-folds
    cross_validate_score: [Function: cross_validate_score],//test model variance and bias
    grid_search: [Function: grid_search], // tune models with grid search for optimal performance
  },
  DataSet [Class: DataSet]: { //class for manipulating an array of objects (typically from CSV data)
    columnMatrix(vectors), //returns a matrix of values by combining column arrays into a matrix
    columnArray(columnName, options), // - returns a new array of a selected column from an array of objects, can filter, scale and replace values
    columnReplace(columnName, options), // - returns a new array of a selected column from an array of objects and replaces empty values, encodes values and scales values
    columnScale(columnName, options), // - returns a new array of scaled values which can be reverse (descaled). The scaling transformations are stored on the DataSet
    columnDescale(columnName, options), // - Returns a new array of descaled values
    selectColumns(columns, options), //returns a list of objects with only selected columns as properties
    labelEncoder(columnName, options), // - returns a new array and label encodes a selected column
    labelDecode(columnName, options), // - returns a new array and decodes an encoded column back to the original array values
    oneHotEncoder(columnName, options), // - returns a new object of one hot encoded values
    columnMatrix(columnName, options), // - returns a matrix of values from multiple columns
    columnReducer(newColumnName, options), // - returns a new array of a selected column that is passed a reducer function, this is used to create new columns for aggregate statistics
    columnMerge(name, data), // - returns a new column that is merged onto the data set
    filterColumn(options), // - filtered rows of data,
    fitColumns(options), // - mutates data property of DataSet by replacing multiple columns in a single command
    static reverseColumnMatrix(options), // returns an array of objects by applying labels to matrix of columns
    static reverseColumnVector(options), // returns an array of objects by applying labels to column vector
  },
  calc:{
    getTransactions: [Function getTransactions], // Formats an array of transactions into a sparse matrix like format for Apriori/Eclat
    assocationRuleLearning: [async Function assocationRuleLearning], // returns association rule learning results using apriori
  },
  util: {
    range: [Function], // range helper function
    rangeRight: [Function], //range right helper function
    scale: [Function: scale], //scale / normalize data
    avg: [Function: arithmeticMean], // aritmatic mean
    mean: [Function: arithmeticMean], // aritmatic mean
    sum: [Function: sum],
    max: [Function: max],
    min: [Function: min],
    sd: [Function: standardDeviation], // standard deviation
    StandardScalerTransforms: [Function: StandardScalerTransforms], // returns two functions that can standard scale new inputs and reverse scale new outputs
    MinMaxScalerTransforms: [Function: MinMaxScalerTransforms], // returns two functions that can mix max scale new inputs and reverse scale new outputs
    StandardScaler: [Function: StandardScaler], // standardization (z-scores)
    MinMaxScaler: [Function: MinMaxScaler], // min-max scaling
    ExpScaler: [Function: ExpScaler], // exponent scaling
    LogScaler: [Function: LogScaler], // natual log scaling
    squaredDifference: [Function: squaredDifference], // Returns an array of the squared different of two arrays
    standardError: [Function: standardError], // The standard error of the estimate is a measure of the accuracy of predictions made with a regression line
    coefficientOfDetermination: [Function: coefficientOfDetermination],
    adjustedCoefficentOfDetermination: [Function: adjustedCoefficentOfDetermination],
    adjustedRSquared: [Function: adjustedCoefficentOfDetermination],
    rBarSquared: [Function: adjustedCoefficentOfDetermination],
    r: [Function: coefficientOfCorrelation],
    coefficientOfCorrelation: [Function: coefficientOfCorrelation],
    rSquared: [Function: rSquared], //r^2
    pivotVector: [Function: pivotVector], // returns an array of vectors as an array of arrays
    pivotArrays: [Function: pivotArrays], // returns a matrix of values by combining arrays into a matrix
    standardScore: [Function: standardScore], // Calculates the z score of each value in the sample, relative to the sample mean and standard deviation.
    zScore: [Function: standardScore], // alias for standardScore.
    approximateZPercentile: [Function: approximateZPercentile], // approximate the p value from a z score
  },
  preprocessing: {
    DataSet: [Class DataSet],
  },
}
```

### Examples (JavaScript / Python / R)

#### Loading CSV Data

##### Javascript

```javascript
import { default as jsk } from 'modelscript';
let dataset;

//In JavaScript, by default most I/O Operations are asynchronous, see the notes section for more
ms.loadCSV('/some/file/path.csv')
  .then(csvData=>{
    dataset = new ms.DataSet(csvData);
    console.log({csvData});
    /* csvData [{
      'Country': 'Brazil',
      'Age': '44',
      'Salary': '72000',
      'Purchased': 'N',
    },
    ...
    {
      'Country': 'Mexico',
      'Age': '27',
      'Salary': '48000',
      'Purchased': 'Yes',
    }] */
  })
  .catch(console.error);

// or from URL
ms.loadCSV('https://example.com/some/file/path.csv')

```

##### Python

```python
import pandas as pd

#Importing the dataset
dataset = pd.read_csv('/some/file/path.csv')
```

##### R

```R
# Importingd the dataset
dataset = read.csv('Data.csv')
```

#### Handling Missing Data

##### Javascript

```javascript
//column Array returns column of data by name
// [ '44','27','30','38','40','35','','48','50', '37' ]
const OringalAgeColumn = dataset.columnArray('Age'); 

//column Replace returns new Array with replaced missing data
//[ '44','27','30','38','40','35',38.77777777777778,'48','50','37' ]
const ReplacedAgeMeanColumn = dataset.columnReplace('Age',{strategy:'mean'}); 

//fit Columns, mutates dataset
dataset.fitColumns({
  columns:[{name:'Age',strategy:'mean'}]
});
/*
dataset
class DataSet
  data:[
    {
      'Country': 'Brazil',
      'Age': '38.77777777777778',
      'Salary': '72000',
      'Purchased': 'N',
    }
    ...
  ]
*/
```

##### Python

```python
X = dataset.iloc[:, :-1].values
y = dataset.iloc[:, 3].values

# Taking care of of missing data
from sklearn.preprocessing import Imputer
imputer = Imputer(missing_values='NaN', strategy = 'mean', axis=0)
imputer = imputer.fit(X[:, 1:3])
X[:, 1:3] = imputer.transform(X[:, 1:3])
```

##### R

```R
# Taking care of the missing data
dataset$Age = ifelse(is.na(dataset$Age),
                ave(dataset$Age,FUN = function(x) mean(x,na.rm =TRUE)),
                dataset$Age)
```

#### One Hot Encoding and Label Encoding

##### Javascript

```javascript
// [ 'Brazil','Mexico','Ghana','Mexico','Ghana','Brazil','Mexico','Brazil','Ghana', 'Brazil' ]
const originalCountry = dataset.columnArray('Country'); 
/*
{ originalCountry:
   { Country_Brazil: [ 1, 0, 0, 0, 0, 1, 0, 1, 0, 1 ],
     Country_Mexico: [ 0, 1, 0, 1, 0, 0, 1, 0, 0, 0 ],
     Country_Ghana: [ 0, 0, 1, 0, 1, 0, 0, 0, 1, 0 ] },
    }
*/
const oneHotCountryColumn = dataset.oneHotEncoder('Country');

// [ 'N', 'Yes', 'No', 'f', 'Yes', 'Yes', 'false', 'Yes', 'No', 'Yes' ]
const originalPurchasedColumn = dataset.labelEncoder('Purchased');
// [ 0, 1, 0, 0, 1, 1, 1, 1, 0, 1 ]
const encodedBinaryPurchasedColumn = dataset.labelEncoder('Purchased',{ binary:true });
// [ 0, 1, 2, 3, 1, 1, 4, 1, 2, 1 ]
const encodedPurchasedColumn = dataset.labelEncoder('Purchased');
// [ 'N', 'Yes', 'No', 'f', 'Yes', 'Yes', 'false', 'Yes', 'No', 'Yes' ]
const decodedPurchased = dataset.labelDecode('Purchased', { data: encodedPurchasedColumn, });


//fit Columns, mutates dataset
dataset.fitColumns({
  columns:[
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
      },
    },
  ]
});
```

##### Python

```python
# Encoding  categorical data
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
labelencoder_X = LabelEncoder()
X[:, 0] = labelencoder_X.fit_transform(X[:, 0])
onehotencoder = OneHotEncoder(categorical_features=[0])
X = onehotencoder.fit_transform(X).toarray()
labelencoder_y = LabelEncoder()
y = labelencoder_y.fit_transform(y)
```

##### R

```R
# Encoding categorical data
dataset$Country = factor(dataset$Country,
                         levels = c('Brazil', 'Mexico', 'Ghana'),
                         labels = c(1, 2, 3))

dataset$Purchased = factor(dataset$Purchased,
                         levels = c('No', 'Yes'),
                         labels = c(0, 1))
```

#### Cross Validation

##### Javascript

```javascript
const testArray = [20, 25, 10, 33, 50, 42, 19, 34, 90, 23, ];

// { train: [ 50, 20, 34, 33, 10, 23, 90, 42 ], test: [ 25, 19 ] }
const trainTestSplit = ms.cross_validation.train_test_split(testArray,{ test_size:0.2, random_state: 0, });

// [ [ 50, 20, 34, 33, 10 ], [ 23, 90, 42, 19, 25 ] ] 
const crossValidationArrayKFolds = ms.cross_validation.cross_validation_split(testArray, { folds: 2, random_state: 0, });
```

##### Python

```python
#splitting the dataset into trnaing set and test set
from sklearn.cross_validation import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 0)
```

##### R

```R
# Splitting the dataset into the training set and test set
library(caTools)
set.seed(1)
split = sample.split(dataset$Purchased, SplitRatio = 0.8)
training_set = subset(dataset, split == TRUE)
test_set = subset(dataset, split == FALSE)
```

#### Scaling (z-score / min-mix)

##### Javascript

```javascript
dataset.columnArray('Salary',{ scale:'standard'}); 
dataset.columnArray('Salary',{ scale:'minmax'}); 
```

##### Python

```python
from sklearn.preprocessing import StandardScaler
sc_X = StandardScaler()
X_train = sc_X.fit_transform(X_train)
X_test = sc_X.transform(X_test)
```

### Development

*Make sure you have grunt installed*

```sh
$ npm i -g grunt-cli jsdoc-to-markdown
```

For generating documentation
```sh
$ grunt doc
$ jsdoc2md src/**/*.js  > docs/api.md
```

### Notes

Check out [https://repetere.github.io/modelscript](https://repetere.github.io/modelscript) for the full modelscript Documentation

#### A quick word about asynchronous JavaScript

Most machine learning tutorials in Python and R are not using their asynchronous equivalents; however, there is a bias in JavaScript to default to non-blocking operations.

With the advent of ES7 and Node.js 7+ there are syntax helpers with asynchronous functions. It may be easier to use async/await in JS if you want an approximation close to what a workflow would look like in R/Python

```javascript
import * as fs from 'fs-extra';
import * as np from 'numjs'; 
import { default as ml } from 'ml';
import { default as pd } from 'pandas-js';
import { default as mpn } from 'matplotnode';
import { loadCSV, preprocessing } from 'modelscript';
const plt = mpn.plot;

void async () => {
  const csvData = await loadCSV('../Data.csv');
  const rawData = new preprocessing.DataSet(csvData);
  const fittedData = rawData.fitColumns({
    columns: [
      { name: 'Age' },
      { name: 'Salary' },
      {
        name: 'Purchased',
        options: {
          strategy: 'label',
          labelOptions: {
            binary: true,
          },
        }
      },
    ]
  });
  const dataset = new pd.DataFrame(fittedData);
  const X = dataset.iloc(
    [ 0, dataset.length ],
    [ 0, 3 ]).values;
  const y = dataset.iloc(
    [ 0, dataset.length ],
    3).values;
  console.log({
    X,
    y
  });
}();

```

### Testing

```sh
$ npm i
$ grunt test
```

### Contributing

Fork, write tests and create a pull request!

### Misc

As of Node 8, ES modules are still used behind a flag, when running natively as an ES module

```sh
$ node --experimental-modules my-machine-learning-script.mjs
# Also there are native bindings that require Python 2.x, make sure if you're using Anaconda, you build with your Python 2.x bin
$ npm i --python=/usr/bin/python
 ```

License
----

MIT
