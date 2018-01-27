## Classes

<dl>
<dt><a href="#RawData">RawData</a></dt>
<dd></dd>
<dt><a href="#RawData">RawData</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#util">util</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#cross_validation">cross_validation</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#preprocessing">preprocessing</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#loadCSVURI">loadCSVURI(filepath)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Asynchronously loads a CSV from a remote URL and returns an array of objects</p>
</dd>
<dt><a href="#loadCSV">loadCSV(filepath)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Asynchronously loads a CSV from either a filepath or remote URL and returns an array of objects</p>
</dd>
</dl>

<a name="RawData"></a>

## RawData
**Kind**: global class  

* [RawData](#RawData)
    * [new RawData()](#new_RawData_new)
    * [new RawData(dataset)](#new_RawData_new)
    * [.columnMatrix([vectors])](#RawData+columnMatrix) ⇒ <code>Array</code>
    * [.columnArray(name, options)](#RawData+columnArray) ⇒ <code>array</code>
    * [.columnReplace(name, options)](#RawData+columnReplace) ⇒ <code>array</code> \| <code>Array.&lt;Object&gt;</code>
    * [.labelEncoder(name, options)](#RawData+labelEncoder) ⇒ <code>array</code>
    * [.labelDecode(name, options)](#RawData+labelDecode) ⇒ <code>array</code>
    * [.oneHotEncoder(name, options)](#RawData+oneHotEncoder) ⇒ <code>Object</code>
    * [.fitColumns(options)](#RawData+fitColumns) ⇒ <code>Array.&lt;Object&gt;</code>

<a name="new_RawData_new"></a>

### new RawData()
class for manipulating an array of objects, typically from CSV data

<a name="new_RawData_new"></a>

### new RawData(dataset)
creates a new raw data instance for preprocessing data for machine learning


| Param | Type |
| --- | --- |
| dataset | <code>Array.&lt;Object&gt;</code> | 

**Example**  
```js
const dataset = new jsk.RawData(csvData);
```
<a name="RawData+columnMatrix"></a>

### rawData.columnMatrix([vectors]) ⇒ <code>Array</code>
returns a matrix of values by combining column arrays into a matrix

**Kind**: instance method of [<code>RawData</code>](#RawData)  
**Returns**: <code>Array</code> - a matrix of column values  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [vectors] | <code>Array</code> | <code>[]</code> | array of arguments for columnArray to merge columns into a matrix |

**Example**  
```js
const csvObj = new RawData([{col1:1,col2:5},{col1:2,col2:6}]);
csvObj.columnMatrix([['col1',{parseInt:true}],['col2]]); // =>
//[ 
//  [1,5], 
//  [2,6], 
//]
```
<a name="RawData+columnArray"></a>

### rawData.columnArray(name, options) ⇒ <code>array</code>
returns a new array of a selected column from an array of objects, can filter, scale and replace values

**Kind**: instance method of [<code>RawData</code>](#RawData)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | csv column header, or JSON object property name |
| options |  |  |  |
| [options.prefilter] | <code>function</code> | <code>(arr[val])&#x3D;&gt;true</code> | prefilter values to return |
| [options.filter] | <code>function</code> | <code>(arr[val])&#x3D;&gt;true</code> | filter values to return |
| [options.replace.test] | <code>function</code> |  | test function for replacing values (arr[val]) |
| [options.replace.value] | <code>string</code> \| <code>number</code> \| <code>function</code> |  | value to replace (arr[val]) if replace test is true, if a function (result,val,index,arr,name)=>your custom value |
| [options.parseIntBase] | <code>number</code> | <code>10</code> | radix value for parseInt |
| [options.parseFloat] | <code>boolean</code> | <code>false</code> | convert values to floats |
| [options.parseInt] | <code>boolean</code> | <code>false</code> | converts values to ints |
| [options.scale] | <code>boolean</code> | <code>false</code> | standard or minmax feature scale values |

**Example**  
```js
//column Array returns column of data by name
// [ '44','27','30','38','40','35','','48','50', '37' ]
const OringalAgeColumn = dataset.columnArray('Age'); 
```
<a name="RawData+columnReplace"></a>

### rawData.columnReplace(name, options) ⇒ <code>array</code> \| <code>Array.&lt;Object&gt;</code>
returns a new array of a selected column from an array of objects and replaces empty values, encodes values and scales values

**Kind**: instance method of [<code>RawData</code>](#RawData)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | csv column header, or JSON object property name |
| options |  |  |  |
| [options.empty] | <code>boolean</code> | <code>true</code> | replace empty values |
| [options.strategy] | <code>boolean</code> | <code>&quot;mean&quot;</code> | strategy for replacing value, any array stat method from ml.js (mean, standardDeviation, median) or (label,labelEncoder,onehot,oneHotEncoder) |

**Example**  
```js
//column Replace returns new Array with replaced missing data
//[ '44','27','30','38','40','35',38.77777777777778,'48','50','37' ]
const ReplacedAgeMeanColumn = dataset.columnReplace('Age',{strategy:'mean'});
```
<a name="RawData+labelEncoder"></a>

### rawData.labelEncoder(name, options) ⇒ <code>array</code>
returns a new array and label encodes a selected column

**Kind**: instance method of [<code>RawData</code>](#RawData)  
**See**: [http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html](http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | csv column header, or JSON object property name |
| options |  |  |  |
| [options.binary] | <code>boolean</code> | <code>false</code> | only replace with (0,1) with binary values |

**Example**  
```js
const oneHotCountryColumn = dataset.oneHotEncoder('Country'); 

// [ 'N', 'Yes', 'No', 'f', 'Yes', 'Yes', 'false', 'Yes', 'No', 'Yes' ] 
const originalPurchasedColumn = dataset.labelEncoder('Purchased');
// [ 0, 1, 0, 0, 1, 1, 1, 1, 0, 1 ]
const encodedBinaryPurchasedColumn = dataset.labelEncoder('Purchased',{ binary:true });
// [ 0, 1, 2, 3, 1, 1, 4, 1, 2, 1 ]
const encodedPurchasedColumn = dataset.labelEncoder('Purchased'); 
```
<a name="RawData+labelDecode"></a>

### rawData.labelDecode(name, options) ⇒ <code>array</code>
returns a new array and decodes an encoded column back to the original array values

**Kind**: instance method of [<code>RawData</code>](#RawData)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | csv column header, or JSON object property name |
| options |  |  |

<a name="RawData+oneHotEncoder"></a>

### rawData.oneHotEncoder(name, options) ⇒ <code>Object</code>
returns a new object of one hot encoded values

**Kind**: instance method of [<code>RawData</code>](#RawData)  
**See**: [http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html](http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | csv column header, or JSON object property name |
| options |  |  |

**Example**  
```js
// [ 'Brazil','Mexico','Ghana','Mexico','Ghana','Brazil','Mexico','Brazil','Ghana', 'Brazil' ]
const originalCountry = dataset.columnArray('Country'); 

// { originalCountry:
//    { Country_Brazil: [ 1, 0, 0, 0, 0, 1, 0, 1, 0, 1 ],
//      Country_Mexico: [ 0, 1, 0, 1, 0, 0, 1, 0, 0, 0 ],
//      Country_Ghana: [ 0, 0, 1, 0, 1, 0, 0, 0, 1, 0 ] },
//     }
const oneHotCountryColumn = dataset.oneHotEncoder('Country'); 
```
<a name="RawData+fitColumns"></a>

### rawData.fitColumns(options) ⇒ <code>Array.&lt;Object&gt;</code>
mutates data property of RawData by replacing multiple columns in a single command

**Kind**: instance method of [<code>RawData</code>](#RawData)  

| Param | Type | Description |
| --- | --- | --- |
| options |  |  |
| options.columns | <code>Array.&lt;Object&gt;</code> | {name:'columnName',options:{strategy:'mean',labelOoptions:{}},} |

**Example**  
```js
//fit Columns, mutates dataset
dataset.fitColumns({
  columns:[{name:'Age',strategy:'mean'}]
});
// dataset
// class RawData
//   data:[
//     {
//       'Country': 'Brazil',
//       'Age': '38.77777777777778',
//       'Salary': '72000',
//       'Purchased': 'N',
//     }
//     ...
//   ]
```
<a name="RawData"></a>

## RawData
**Kind**: global class  

* [RawData](#RawData)
    * [new RawData()](#new_RawData_new)
    * [new RawData(dataset)](#new_RawData_new)
    * [.columnMatrix([vectors])](#RawData+columnMatrix) ⇒ <code>Array</code>
    * [.columnArray(name, options)](#RawData+columnArray) ⇒ <code>array</code>
    * [.columnReplace(name, options)](#RawData+columnReplace) ⇒ <code>array</code> \| <code>Array.&lt;Object&gt;</code>
    * [.labelEncoder(name, options)](#RawData+labelEncoder) ⇒ <code>array</code>
    * [.labelDecode(name, options)](#RawData+labelDecode) ⇒ <code>array</code>
    * [.oneHotEncoder(name, options)](#RawData+oneHotEncoder) ⇒ <code>Object</code>
    * [.fitColumns(options)](#RawData+fitColumns) ⇒ <code>Array.&lt;Object&gt;</code>

<a name="new_RawData_new"></a>

### new RawData()
class for manipulating an array of objects, typically from CSV data

<a name="new_RawData_new"></a>

### new RawData(dataset)
creates a new raw data instance for preprocessing data for machine learning


| Param | Type |
| --- | --- |
| dataset | <code>Array.&lt;Object&gt;</code> | 

**Example**  
```js
const dataset = new jsk.RawData(csvData);
```
<a name="RawData+columnMatrix"></a>

### rawData.columnMatrix([vectors]) ⇒ <code>Array</code>
returns a matrix of values by combining column arrays into a matrix

**Kind**: instance method of [<code>RawData</code>](#RawData)  
**Returns**: <code>Array</code> - a matrix of column values  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [vectors] | <code>Array</code> | <code>[]</code> | array of arguments for columnArray to merge columns into a matrix |

**Example**  
```js
const csvObj = new RawData([{col1:1,col2:5},{col1:2,col2:6}]);
csvObj.columnMatrix([['col1',{parseInt:true}],['col2]]); // =>
//[ 
//  [1,5], 
//  [2,6], 
//]
```
<a name="RawData+columnArray"></a>

### rawData.columnArray(name, options) ⇒ <code>array</code>
returns a new array of a selected column from an array of objects, can filter, scale and replace values

**Kind**: instance method of [<code>RawData</code>](#RawData)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | csv column header, or JSON object property name |
| options |  |  |  |
| [options.prefilter] | <code>function</code> | <code>(arr[val])&#x3D;&gt;true</code> | prefilter values to return |
| [options.filter] | <code>function</code> | <code>(arr[val])&#x3D;&gt;true</code> | filter values to return |
| [options.replace.test] | <code>function</code> |  | test function for replacing values (arr[val]) |
| [options.replace.value] | <code>string</code> \| <code>number</code> \| <code>function</code> |  | value to replace (arr[val]) if replace test is true, if a function (result,val,index,arr,name)=>your custom value |
| [options.parseIntBase] | <code>number</code> | <code>10</code> | radix value for parseInt |
| [options.parseFloat] | <code>boolean</code> | <code>false</code> | convert values to floats |
| [options.parseInt] | <code>boolean</code> | <code>false</code> | converts values to ints |
| [options.scale] | <code>boolean</code> | <code>false</code> | standard or minmax feature scale values |

**Example**  
```js
//column Array returns column of data by name
// [ '44','27','30','38','40','35','','48','50', '37' ]
const OringalAgeColumn = dataset.columnArray('Age'); 
```
<a name="RawData+columnReplace"></a>

### rawData.columnReplace(name, options) ⇒ <code>array</code> \| <code>Array.&lt;Object&gt;</code>
returns a new array of a selected column from an array of objects and replaces empty values, encodes values and scales values

**Kind**: instance method of [<code>RawData</code>](#RawData)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | csv column header, or JSON object property name |
| options |  |  |  |
| [options.empty] | <code>boolean</code> | <code>true</code> | replace empty values |
| [options.strategy] | <code>boolean</code> | <code>&quot;mean&quot;</code> | strategy for replacing value, any array stat method from ml.js (mean, standardDeviation, median) or (label,labelEncoder,onehot,oneHotEncoder) |

**Example**  
```js
//column Replace returns new Array with replaced missing data
//[ '44','27','30','38','40','35',38.77777777777778,'48','50','37' ]
const ReplacedAgeMeanColumn = dataset.columnReplace('Age',{strategy:'mean'});
```
<a name="RawData+labelEncoder"></a>

### rawData.labelEncoder(name, options) ⇒ <code>array</code>
returns a new array and label encodes a selected column

**Kind**: instance method of [<code>RawData</code>](#RawData)  
**See**: [http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html](http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | csv column header, or JSON object property name |
| options |  |  |  |
| [options.binary] | <code>boolean</code> | <code>false</code> | only replace with (0,1) with binary values |

**Example**  
```js
const oneHotCountryColumn = dataset.oneHotEncoder('Country'); 

// [ 'N', 'Yes', 'No', 'f', 'Yes', 'Yes', 'false', 'Yes', 'No', 'Yes' ] 
const originalPurchasedColumn = dataset.labelEncoder('Purchased');
// [ 0, 1, 0, 0, 1, 1, 1, 1, 0, 1 ]
const encodedBinaryPurchasedColumn = dataset.labelEncoder('Purchased',{ binary:true });
// [ 0, 1, 2, 3, 1, 1, 4, 1, 2, 1 ]
const encodedPurchasedColumn = dataset.labelEncoder('Purchased'); 
```
<a name="RawData+labelDecode"></a>

### rawData.labelDecode(name, options) ⇒ <code>array</code>
returns a new array and decodes an encoded column back to the original array values

**Kind**: instance method of [<code>RawData</code>](#RawData)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | csv column header, or JSON object property name |
| options |  |  |

<a name="RawData+oneHotEncoder"></a>

### rawData.oneHotEncoder(name, options) ⇒ <code>Object</code>
returns a new object of one hot encoded values

**Kind**: instance method of [<code>RawData</code>](#RawData)  
**See**: [http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html](http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | csv column header, or JSON object property name |
| options |  |  |

**Example**  
```js
// [ 'Brazil','Mexico','Ghana','Mexico','Ghana','Brazil','Mexico','Brazil','Ghana', 'Brazil' ]
const originalCountry = dataset.columnArray('Country'); 

// { originalCountry:
//    { Country_Brazil: [ 1, 0, 0, 0, 0, 1, 0, 1, 0, 1 ],
//      Country_Mexico: [ 0, 1, 0, 1, 0, 0, 1, 0, 0, 0 ],
//      Country_Ghana: [ 0, 0, 1, 0, 1, 0, 0, 0, 1, 0 ] },
//     }
const oneHotCountryColumn = dataset.oneHotEncoder('Country'); 
```
<a name="RawData+fitColumns"></a>

### rawData.fitColumns(options) ⇒ <code>Array.&lt;Object&gt;</code>
mutates data property of RawData by replacing multiple columns in a single command

**Kind**: instance method of [<code>RawData</code>](#RawData)  

| Param | Type | Description |
| --- | --- | --- |
| options |  |  |
| options.columns | <code>Array.&lt;Object&gt;</code> | {name:'columnName',options:{strategy:'mean',labelOoptions:{}},} |

**Example**  
```js
//fit Columns, mutates dataset
dataset.fitColumns({
  columns:[{name:'Age',strategy:'mean'}]
});
// dataset
// class RawData
//   data:[
//     {
//       'Country': 'Brazil',
//       'Age': '38.77777777777778',
//       'Salary': '72000',
//       'Purchased': 'N',
//     }
//     ...
//   ]
```
<a name="util"></a>

## util : <code>object</code>
**Kind**: global namespace  

* [util](#util) : <code>object</code>
    * [.StandardScaler(z)](#util.StandardScaler) ⇒ <code>Array.&lt;number&gt;</code>
    * [.MinMaxScaler(z)](#util.MinMaxScaler) ⇒ <code>Array.&lt;number&gt;</code>

<a name="util.StandardScaler"></a>

### util.StandardScaler(z) ⇒ <code>Array.&lt;number&gt;</code>
Standardize features by removing the mean and scaling to unit variance

Centering and scaling happen independently on each feature by computing the relevant statistics on the samples in the training set. Mean and standard deviation are then stored to be used on later data using the transform method.

Standardization of a dataset is a common requirement for many machine learning estimators: they might behave badly if the individual feature do not more or less look like standard normally distributed data (e.g. Gaussian with 0 mean and unit variance)

**Kind**: static method of [<code>util</code>](#util)  

| Param | Type | Description |
| --- | --- | --- |
| z | <code>Array.&lt;number&gt;</code> | array of integers or floats |

<a name="util.MinMaxScaler"></a>

### util.MinMaxScaler(z) ⇒ <code>Array.&lt;number&gt;</code>
Transforms features by scaling each feature to a given range.

This estimator scales and translates each feature individually such that it is in the given range on the training set, i.e. between zero and one.

**Kind**: static method of [<code>util</code>](#util)  

| Param | Type | Description |
| --- | --- | --- |
| z | <code>Array.&lt;number&gt;</code> | array of integers or floats |

<a name="cross_validation"></a>

## cross_validation : <code>object</code>
**Kind**: global namespace  
**See**: [https://machinelearningmastery.com/implement-resampling-methods-scratch-python/](https://machinelearningmastery.com/implement-resampling-methods-scratch-python/)  

* [cross_validation](#cross_validation) : <code>object</code>
    * [.train_test_split(dataset, options)](#cross_validation.train_test_split) ⇒ <code>Object</code> \| <code>array</code>
    * [.cross_validation_split(dataset, options)](#cross_validation.cross_validation_split) ⇒ <code>array</code>

<a name="cross_validation.train_test_split"></a>

### cross_validation.train_test_split(dataset, options) ⇒ <code>Object</code> \| <code>array</code>
Split arrays into random train and test subsets

**Kind**: static method of [<code>cross_validation</code>](#cross_validation)  
**Returns**: <code>Object</code> \| <code>array</code> - returns training and test arrays either as an object or arrays  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataset | <code>array</code> |  | array of data to split |
| options | <code>object</code> |  |  |
| [options.test_size] | <code>number</code> | <code>0.2</code> | represent the proportion of the dataset to include in the test split, can be overwritten by the train_size |
| [options.train_size] | <code>number</code> | <code>0.8</code> | represent the proportion of the dataset to include in the train split |
| [options.random_state] | <code>number</code> | <code>0</code> | the seed used by the random number generator |
| [options.return_array] | <code>boolean</code> | <code>false</code> | will return an object {train,test} of the split dataset by default or [train,test] if returned as an array |

**Example**  
```js
const testArray = [20, 25, 10, 33, 50, 42, 19, 34, 90, 23, ];
// { train: [ 50, 20, 34, 33, 10, 23, 90, 42 ], test: [ 25, 19 ] }
const trainTestSplit = jsk.cross_validation.train_test_split(testArray,{ test_size:0.2, random_state: 0, });
```
<a name="cross_validation.cross_validation_split"></a>

### cross_validation.cross_validation_split(dataset, options) ⇒ <code>array</code>
Provides train/test indices to split data in train/test sets. Split dataset into k consecutive folds.
Each fold is then used once as a validation while the k - 1 remaining folds form the training set.

**Kind**: static method of [<code>cross_validation</code>](#cross_validation)  
**Returns**: <code>array</code> - returns  dataset split into k consecutive folds  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataset | <code>array</code> |  | array of data to split |
| options | <code>object</code> |  |  |
| [options.folds] | <code>number</code> | <code>3</code> | Number of folds |
| [options.random_state] | <code>number</code> | <code>0</code> | the seed used by the random number generator |

**Example**  
```js
const testArray = [20, 25, 10, 33, 50, 42, 19, 34, 90, 23, ];
// [ [ 50, 20, 34, 33, 10 ], [ 23, 90, 42, 19, 25 ] ] 
const crossValidationArrayKFolds = jsk.cross_validation.cross_validation_split(testArray, { folds: 2, random_state: 0, });
```
<a name="preprocessing"></a>

## preprocessing : <code>object</code>
**Kind**: global namespace  
<a name="loadCSVURI"></a>

## loadCSVURI(filepath) ⇒ <code>Array.&lt;Object&gt;</code>
Asynchronously loads a CSV from a remote URL and returns an array of objects

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - returns an array of objects from a csv where each column header is the property name  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | URL to CSV path |

**Example**  
```js
// returns [{header:value,header2:value2}]loadCSVURI('https://raw.githubusercontent.com/repetere/jskit-learn/master/test/mock/data.csv').then(csvData).catch(console.error)
```
<a name="loadCSV"></a>

## loadCSV(filepath) ⇒ <code>Array.&lt;Object&gt;</code>
Asynchronously loads a CSV from either a filepath or remote URL and returns an array of objects

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - returns an array of objects from a csv where each column header is the property name  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | URL to CSV path |

**Example**  
```js
// returns [{header:value,header2:value2}]loadCSV('../mock/invalid-file.csv').then(csvData).catch(console.error)
```
