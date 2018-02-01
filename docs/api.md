## Classes

<dl>
<dt><a href="#DataSet">DataSet</a></dt>
<dd></dd>
<dt><a href="#DataSet">DataSet</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#calc">calc</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#cross_validation">cross_validation</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#preprocessing">preprocessing</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#util">util</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#loadCSVURI">loadCSVURI(filepath, [options])</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Asynchronously loads a CSV from a remote URL and returns an array of objects</p>
</dd>
<dt><a href="#loadCSV">loadCSV(filepath, [options])</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Asynchronously loads a CSV from either a filepath or remote URL and returns an array of objects</p>
</dd>
</dl>

<a name="DataSet"></a>

## DataSet
**Kind**: global class  

* [DataSet](#DataSet)
    * [new DataSet()](#new_DataSet_new)
    * [new DataSet(dataset)](#new_DataSet_new)
    * [.filterColumn([filter])](#DataSet+filterColumn) ⇒ <code>Array</code>
    * [.columnMatrix([vectors])](#DataSet+columnMatrix) ⇒ <code>Array</code>
    * [.columnArray(name, options)](#DataSet+columnArray) ⇒ <code>array</code>
    * [.columnReplace(name, options)](#DataSet+columnReplace) ⇒ <code>array</code> \| <code>Array.&lt;Object&gt;</code>
    * [.labelEncoder(name, options)](#DataSet+labelEncoder) ⇒ <code>array</code>
    * [.labelDecode(name, options)](#DataSet+labelDecode) ⇒ <code>array</code>
    * [.oneHotEncoder(name, options)](#DataSet+oneHotEncoder) ⇒ <code>Object</code>
    * [.columnReducer(name, options)](#DataSet+columnReducer) ⇒ <code>Object</code>
    * [.columnMerge(name, data)](#DataSet+columnMerge) ⇒ <code>Object</code>
    * [.fitColumns(options)](#DataSet+fitColumns) ⇒ <code>Array.&lt;Object&gt;</code>

<a name="new_DataSet_new"></a>

### new DataSet()
class for manipulating an array of objects, typically from CSV data

<a name="new_DataSet_new"></a>

### new DataSet(dataset)
creates a new raw data instance for preprocessing data for machine learning


| Param | Type |
| --- | --- |
| dataset | <code>Array.&lt;Object&gt;</code> | 

**Example**  
```js
const dataset = new jsk.DataSet(csvData);
```
<a name="DataSet+filterColumn"></a>

### dataSet.filterColumn([filter]) ⇒ <code>Array</code>
returns filtered rows of data

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  
**Returns**: <code>Array</code> - filtered array of data  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [filter] | <code>function</code> | <code>()=&gt;true</code> | filter function |

**Example**  
```js
const csvObj = new DataSet([{col1:1,col2:5},{col1:2,col2:6}]);
csvObj.filterColumn((row)=>row.col1>=2); // =>
//[ 
//  [2,6], 
//]
```
<a name="DataSet+columnMatrix"></a>

### dataSet.columnMatrix([vectors]) ⇒ <code>Array</code>
returns a matrix of values by combining column arrays into a matrix

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  
**Returns**: <code>Array</code> - a matrix of column values  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [vectors] | <code>Array</code> | <code>[]</code> | array of arguments for columnArray to merge columns into a matrix |

**Example**  
```js
const csvObj = new DataSet([{col1:1,col2:5},{col1:2,col2:6}]);
csvObj.columnMatrix([['col1',{parseInt:true}],['col2']]); // =>
//[ 
//  [1,5], 
//  [2,6], 
//]
```
<a name="DataSet+columnArray"></a>

### dataSet.columnArray(name, options) ⇒ <code>array</code>
returns a new array of a selected column from an array of objects, can filter, scale and replace values

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | csv column header, or JSON object property name |
| options |  |  |  |
| [options.prefilter] | <code>function</code> | <code>(arr[val])=&gt;true</code> | prefilter values to return |
| [options.filter] | <code>function</code> | <code>(arr[val])=&gt;true</code> | filter values to return |
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
<a name="DataSet+columnReplace"></a>

### dataSet.columnReplace(name, options) ⇒ <code>array</code> \| <code>Array.&lt;Object&gt;</code>
returns a new array of a selected column from an array of objects and replaces empty values, encodes values and scales values

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  

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
<a name="DataSet+labelEncoder"></a>

### dataSet.labelEncoder(name, options) ⇒ <code>array</code>
returns a new array and label encodes a selected column

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  
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
<a name="DataSet+labelDecode"></a>

### dataSet.labelDecode(name, options) ⇒ <code>array</code>
returns a new array and decodes an encoded column back to the original array values

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | csv column header, or JSON object property name |
| options |  |  |

<a name="DataSet+oneHotEncoder"></a>

### dataSet.oneHotEncoder(name, options) ⇒ <code>Object</code>
returns a new object of one hot encoded values

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  
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
<a name="DataSet+columnReducer"></a>

### dataSet.columnReducer(name, options) ⇒ <code>Object</code>
it returns a new column that reduces a column into a new column object, this is used in data prep to create new calculated columns for aggregrate statistics

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  
**Returns**: <code>Object</code> - a new object that has reduced array as the value  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name of new Column |
| options | <code>Object</code> |  |
| options.columnName | <code>String</code> | name property for columnArray selection |
| options.columnOptions | <code>Object</code> | options property for columnArray |
| options.reducer | <code>function</code> | reducer function to reduce into new array, it should push values into the resulting array |

**Example**  
```js
const reducer = (result, value, index, arr) => {
result.push(value * 2);
return result;
};
CSVDataSet.columnReducer('DoubleAge', {
columnName: 'Age',
reducer,
}); //=> { DoubleAge: [ 88, 54, 60, 76, 80, 70, 0, 96, 100, 74 ] }
```
<a name="DataSet+columnMerge"></a>

### dataSet.columnMerge(name, data) ⇒ <code>Object</code>
it returns a new column that is merged onto the data set

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name of new Column |
| data | <code>Array</code> | new dataset data |

**Example**  
```js
CSVDataSet.columnMerge('DoubleAge', [ 88, 54, 60, 76, 80, 70, 0, 96, 100, 74 ]); //=> { DoubleAge: [ 88, 54, 60, 76, 80, 70, 0, 96, 100, 74 ] }
```
<a name="DataSet+fitColumns"></a>

### dataSet.fitColumns(options) ⇒ <code>Array.&lt;Object&gt;</code>
mutates data property of DataSet by replacing multiple columns in a single command

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  

| Param | Type | Description |
| --- | --- | --- |
| options |  |  |
| options.columns | <code>Array.&lt;Object&gt;</code> | {name:'columnName',options:{strategy:'mean',labelOoptions:{}},} |

**Example**  
```js
//fit Columns, mutates dataset
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
```
<a name="DataSet"></a>

## DataSet
**Kind**: global class  

* [DataSet](#DataSet)
    * [new DataSet()](#new_DataSet_new)
    * [new DataSet(dataset)](#new_DataSet_new)
    * [.filterColumn([filter])](#DataSet+filterColumn) ⇒ <code>Array</code>
    * [.columnMatrix([vectors])](#DataSet+columnMatrix) ⇒ <code>Array</code>
    * [.columnArray(name, options)](#DataSet+columnArray) ⇒ <code>array</code>
    * [.columnReplace(name, options)](#DataSet+columnReplace) ⇒ <code>array</code> \| <code>Array.&lt;Object&gt;</code>
    * [.labelEncoder(name, options)](#DataSet+labelEncoder) ⇒ <code>array</code>
    * [.labelDecode(name, options)](#DataSet+labelDecode) ⇒ <code>array</code>
    * [.oneHotEncoder(name, options)](#DataSet+oneHotEncoder) ⇒ <code>Object</code>
    * [.columnReducer(name, options)](#DataSet+columnReducer) ⇒ <code>Object</code>
    * [.columnMerge(name, data)](#DataSet+columnMerge) ⇒ <code>Object</code>
    * [.fitColumns(options)](#DataSet+fitColumns) ⇒ <code>Array.&lt;Object&gt;</code>

<a name="new_DataSet_new"></a>

### new DataSet()
class for manipulating an array of objects, typically from CSV data

<a name="new_DataSet_new"></a>

### new DataSet(dataset)
creates a new raw data instance for preprocessing data for machine learning


| Param | Type |
| --- | --- |
| dataset | <code>Array.&lt;Object&gt;</code> | 

**Example**  
```js
const dataset = new jsk.DataSet(csvData);
```
<a name="DataSet+filterColumn"></a>

### dataSet.filterColumn([filter]) ⇒ <code>Array</code>
returns filtered rows of data

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  
**Returns**: <code>Array</code> - filtered array of data  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [filter] | <code>function</code> | <code>()=&gt;true</code> | filter function |

**Example**  
```js
const csvObj = new DataSet([{col1:1,col2:5},{col1:2,col2:6}]);
csvObj.filterColumn((row)=>row.col1>=2); // =>
//[ 
//  [2,6], 
//]
```
<a name="DataSet+columnMatrix"></a>

### dataSet.columnMatrix([vectors]) ⇒ <code>Array</code>
returns a matrix of values by combining column arrays into a matrix

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  
**Returns**: <code>Array</code> - a matrix of column values  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [vectors] | <code>Array</code> | <code>[]</code> | array of arguments for columnArray to merge columns into a matrix |

**Example**  
```js
const csvObj = new DataSet([{col1:1,col2:5},{col1:2,col2:6}]);
csvObj.columnMatrix([['col1',{parseInt:true}],['col2']]); // =>
//[ 
//  [1,5], 
//  [2,6], 
//]
```
<a name="DataSet+columnArray"></a>

### dataSet.columnArray(name, options) ⇒ <code>array</code>
returns a new array of a selected column from an array of objects, can filter, scale and replace values

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | csv column header, or JSON object property name |
| options |  |  |  |
| [options.prefilter] | <code>function</code> | <code>(arr[val])=&gt;true</code> | prefilter values to return |
| [options.filter] | <code>function</code> | <code>(arr[val])=&gt;true</code> | filter values to return |
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
<a name="DataSet+columnReplace"></a>

### dataSet.columnReplace(name, options) ⇒ <code>array</code> \| <code>Array.&lt;Object&gt;</code>
returns a new array of a selected column from an array of objects and replaces empty values, encodes values and scales values

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  

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
<a name="DataSet+labelEncoder"></a>

### dataSet.labelEncoder(name, options) ⇒ <code>array</code>
returns a new array and label encodes a selected column

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  
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
<a name="DataSet+labelDecode"></a>

### dataSet.labelDecode(name, options) ⇒ <code>array</code>
returns a new array and decodes an encoded column back to the original array values

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | csv column header, or JSON object property name |
| options |  |  |

<a name="DataSet+oneHotEncoder"></a>

### dataSet.oneHotEncoder(name, options) ⇒ <code>Object</code>
returns a new object of one hot encoded values

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  
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
<a name="DataSet+columnReducer"></a>

### dataSet.columnReducer(name, options) ⇒ <code>Object</code>
it returns a new column that reduces a column into a new column object, this is used in data prep to create new calculated columns for aggregrate statistics

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  
**Returns**: <code>Object</code> - a new object that has reduced array as the value  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name of new Column |
| options | <code>Object</code> |  |
| options.columnName | <code>String</code> | name property for columnArray selection |
| options.columnOptions | <code>Object</code> | options property for columnArray |
| options.reducer | <code>function</code> | reducer function to reduce into new array, it should push values into the resulting array |

**Example**  
```js
const reducer = (result, value, index, arr) => {
result.push(value * 2);
return result;
};
CSVDataSet.columnReducer('DoubleAge', {
columnName: 'Age',
reducer,
}); //=> { DoubleAge: [ 88, 54, 60, 76, 80, 70, 0, 96, 100, 74 ] }
```
<a name="DataSet+columnMerge"></a>

### dataSet.columnMerge(name, data) ⇒ <code>Object</code>
it returns a new column that is merged onto the data set

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name of new Column |
| data | <code>Array</code> | new dataset data |

**Example**  
```js
CSVDataSet.columnMerge('DoubleAge', [ 88, 54, 60, 76, 80, 70, 0, 96, 100, 74 ]); //=> { DoubleAge: [ 88, 54, 60, 76, 80, 70, 0, 96, 100, 74 ] }
```
<a name="DataSet+fitColumns"></a>

### dataSet.fitColumns(options) ⇒ <code>Array.&lt;Object&gt;</code>
mutates data property of DataSet by replacing multiple columns in a single command

**Kind**: instance method of [<code>DataSet</code>](#DataSet)  

| Param | Type | Description |
| --- | --- | --- |
| options |  |  |
| options.columns | <code>Array.&lt;Object&gt;</code> | {name:'columnName',options:{strategy:'mean',labelOoptions:{}},} |

**Example**  
```js
//fit Columns, mutates dataset
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
```
<a name="calc"></a>

## calc : <code>object</code>
**Kind**: global namespace  

* [calc](#calc) : <code>object</code>
    * [.exports.getTransactions(data, options)](#calc.exports.getTransactions) ⇒ <code>Object</code>
    * [.exports.assocationRuleLearning(transactions, options)](#calc.exports.assocationRuleLearning) ⇒ <code>Object</code>

<a name="calc.exports.getTransactions"></a>

### calc.exports.getTransactions(data, options) ⇒ <code>Object</code>
Formats an array of transactions into a sparse matrix like format for Apriori/Eclat

**Kind**: static method of [<code>calc</code>](#calc)  
**Returns**: <code>Object</code> - {values - unique list of all values, valuesMap - map of values and labels, transactions - formatted sparse array}  
**See**: [https://github.com/alexisfacques/Node-FPGrowth](https://github.com/alexisfacques/Node-FPGrowth)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>Array</code> |  | CSV data of transactions |
| options | <code>Object</code> |  |  |
| [options.exludeEmptyTranscations] | <code>Boolean</code> | <code>true</code> | exclude empty rows of transactions |

<a name="calc.exports.assocationRuleLearning"></a>

### calc.exports.assocationRuleLearning(transactions, options) ⇒ <code>Object</code>
returns association rule learning results

**Kind**: static method of [<code>calc</code>](#calc)  
**Returns**: <code>Object</code> - Returns the result from Node-FPGrowth or a summary of support and strong associations  
**See**: [https://github.com/alexisfacques/Node-FPGrowth](https://github.com/alexisfacques/Node-FPGrowth)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| transactions | <code>Array</code> |  | sparse matrix of transactions |
| options | <code>Object</code> |  |  |
| [options.support] | <code>Number</code> | <code>0.4</code> | support level |
| [options.minLength] | <code>Number</code> | <code>2</code> | minimum assocation array size |
| [options.summary] | <code>Boolean</code> | <code>true</code> | return summarized results |
| [options.valuesMap] | <code>Map</code> | <code>new Map()</code> | map of values and labels (used for summary results) |

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
<a name="util"></a>

## util : <code>object</code>
**Kind**: global namespace  

* [util](#util) : <code>object</code>
    * [.squaredDifference(left, right)](#util.squaredDifference) ⇒ <code>Array.&lt;Number&gt;</code>
    * [.standardError(actuals, estimates)](#util.standardError) ⇒ <code>Number</code>
    * [.standardScore(observations)](#util.standardScore) ⇒ <code>Array.&lt;Number&gt;</code>
    * [.coefficientOfDetermination(actuals, estimates)](#util.coefficientOfDetermination) ⇒ <code>Number</code>
    * [.pivotVector(vectors)](#util.pivotVector) ⇒ <code>Array.&lt;Array&gt;</code>
    * [.pivotArrays([vectors])](#util.pivotArrays) ⇒ <code>Array</code>
    * [.StandardScaler(z)](#util.StandardScaler) ⇒ <code>Array.&lt;number&gt;</code>
    * [.MinMaxScaler(z)](#util.MinMaxScaler) ⇒ <code>Array.&lt;number&gt;</code>
    * [.approximateZPercentile(z)](#util.approximateZPercentile) ⇒ <code>number</code>

<a name="util.squaredDifference"></a>

### util.squaredDifference(left, right) ⇒ <code>Array.&lt;Number&gt;</code>
Returns an array of the squared different of two arrays

**Kind**: static method of [<code>util</code>](#util)  
**Returns**: <code>Array.&lt;Number&gt;</code> - Squared difference of left minus right array  

| Param | Type |
| --- | --- |
| left | <code>Array.&lt;Number&gt;</code> | 
| right | <code>Array.&lt;Number&gt;</code> | 

<a name="util.standardError"></a>

### util.standardError(actuals, estimates) ⇒ <code>Number</code>
The standard error of the estimate is a measure of the accuracy of predictions made with a regression line. Compares the estimate to the actual value

**Kind**: static method of [<code>util</code>](#util)  
**Returns**: <code>Number</code> - Standard Error of the Estimate  
**See**: [http://onlinestatbook.com/2/regression/accuracy.html](http://onlinestatbook.com/2/regression/accuracy.html)  

| Param | Type | Description |
| --- | --- | --- |
| actuals | <code>Array.&lt;Number&gt;</code> | numerical samples |
| estimates | <code>Array.&lt;Number&gt;</code> | estimates values |

**Example**  
```js
const actuals = [ 2, 4, 5, 4, 5, ];
  const estimates = [ 2.8, 3.4, 4, 4.6, 5.2, ];
  const SE = jsk.util.standardError(actuals, estimates);
  SE.toFixed(2) // => 0.89
```
<a name="util.standardScore"></a>

### util.standardScore(observations) ⇒ <code>Array.&lt;Number&gt;</code>
Calculates the z score of each value in the sample, relative to the sample mean and standard deviation.

**Kind**: static method of [<code>util</code>](#util)  
**Returns**: <code>Array.&lt;Number&gt;</code> - The z-scores, standardized by mean and standard deviation of input array  
**See**: [https://docs.scipy.org/doc/scipy-0.14.0/reference/generated/scipy.stats.mstats.zscore.html](https://docs.scipy.org/doc/scipy-0.14.0/reference/generated/scipy.stats.mstats.zscore.html)  

| Param | Type | Description |
| --- | --- | --- |
| observations | <code>Array.&lt;Number&gt;</code> | An array like object containing the sample data. |

<a name="util.coefficientOfDetermination"></a>

### util.coefficientOfDetermination(actuals, estimates) ⇒ <code>Number</code>
In statistics, the coefficient of determination, denoted R2 or r2 and pronounced "R squared", is the proportion of the variance in the dependent variable that is predictable from the independent variable(s). Compares distance of estimated values to the mean.{\bar {y}}={\frac {1}{n}}\sum _{i=1}^{n}y_{i}

**Kind**: static method of [<code>util</code>](#util)  
**Returns**: <code>Number</code> - r^2  
**See**: [https://en.wikipedia.org/wiki/Coefficient_of_determination](https://en.wikipedia.org/wiki/Coefficient_of_determination) [http://statisticsbyjim.com/regression/standard-error-regression-vs-r-squared/](http://statisticsbyjim.com/regression/standard-error-regression-vs-r-squared/)  

| Param | Type | Description |
| --- | --- | --- |
| actuals | <code>Array.&lt;Number&gt;</code> | numerical samples |
| estimates | <code>Array.&lt;Number&gt;</code> | estimates values |

**Example**  
```js
const actuals = [ 2, 4, 5, 4, 5, ];
const estimates = [ 2.8, 3.4, 4, 4.6, 5.2, ];
const r2 = jsk.util.coefficientOfDetermination(actuals, estimates); 
r2.toFixed(1) // => 0.6
```
<a name="util.pivotVector"></a>

### util.pivotVector(vectors) ⇒ <code>Array.&lt;Array&gt;</code>
returns an array of vectors as an array of arrays

**Kind**: static method of [<code>util</code>](#util)  

| Param | Type |
| --- | --- |
| vectors | <code>Array.&lt;Array&gt;</code> | 

**Example**  
```js
const vectors = [ [1,2,3], [1,2,3], [3,3,4], [3,3,3] ];
const arrays = pivotVector(vectors); // => [ [1,2,3,3], [2,2,3,3], [3,3,4,3] ];
```
<a name="util.pivotArrays"></a>

### util.pivotArrays([vectors]) ⇒ <code>Array</code>
returns a matrix of values by combining arrays into a matrix

**Kind**: static method of [<code>util</code>](#util)  
**Returns**: <code>Array</code> - a matrix of column values  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [vectors] | <code>Array</code> | <code>[]</code> | array of arguments for columnArray to merge columns into a matrix |

**Example**  
```js
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
```
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

<a name="util.approximateZPercentile"></a>

### util.approximateZPercentile(z) ⇒ <code>number</code>
Converts z-score into the probability

**Kind**: static method of [<code>util</code>](#util)  
**Returns**: <code>number</code> - p  - p-value  
**See**: [https://stackoverflow.com/questions/36575743/how-do-i-convert-probability-into-z-score](https://stackoverflow.com/questions/36575743/how-do-i-convert-probability-into-z-score)  

| Param | Type | Description |
| --- | --- | --- |
| z | <code>number</code> | Number of standard deviations from the mean. |

<a name="loadCSVURI"></a>

## loadCSVURI(filepath, [options]) ⇒ <code>Array.&lt;Object&gt;</code>
Asynchronously loads a CSV from a remote URL and returns an array of objects

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - returns an array of objects from a csv where each column header is the property name  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | URL to CSV path |
| [options] | <code>Object</code> | options passed to csvtojson |

**Example**  
```js
// returns [{header:value,header2:value2}]loadCSVURI('https://raw.githubusercontent.com/repetere/jskit-learn/master/test/mock/data.csv').then(csvData).catch(console.error)
```
<a name="loadCSV"></a>

## loadCSV(filepath, [options]) ⇒ <code>Array.&lt;Object&gt;</code>
Asynchronously loads a CSV from either a filepath or remote URL and returns an array of objects

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - returns an array of objects from a csv where each column header is the property name  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | URL to CSV path |
| [options] | <code>Object</code> | options passed to csvtojson |

**Example**  
```js
// returns [{header:value,header2:value2}]loadCSV('../mock/invalid-file.csv').then(csvData).catch(console.error)
```
