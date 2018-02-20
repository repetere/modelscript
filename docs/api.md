## Classes

<dl>
<dt><a href="#ColumnVectorizer">ColumnVectorizer</a></dt>
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
<dt><a href="#ml">ml</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#nlp">nlp</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#util">util</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="ColumnVectorizer"></a>

## ColumnVectorizer
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| this.data | <code>Array.&lt;Object&gt;</code> | Array of strings |
| this.tokens | <code>Set</code> | Unique collection of all tokenized strings |
| this.vectors | <code>Array.&lt;Object&gt;</code> | Array of tokenized words with value of count of appreance in string |
| this.wordMap | <code>Object</code> | Object of all unique words, with value of 0 |
| this.wordCountMap | <code>Object</code> | Object of all unique words, with value as total count of appearances |
| this.maxFeatures | <code>number</code> | max number of features |
| this.sortedWordCount | <code>Array.&lt;String&gt;</code> | list of words as tokens sorted by total appearances |
| this.limitedFeatures | <code>Array.&lt;String&gt;</code> | subset list of maxFeatures words as tokens sorted by total appearances |
| this.matrix | <code>Array.&lt;Array&gt;</code> | words in sparse matrix |
| this.replacer | <code>function</code> | clean string function |


* [ColumnVectorizer](#ColumnVectorizer)
    * [new ColumnVectorizer([options])](#new_ColumnVectorizer_new)
    * [.get_tokens()](#ColumnVectorizer+get_tokens) ⇒ <code>Array.&lt;String&gt;</code>
    * [.get_vector_array()](#ColumnVectorizer+get_vector_array) ⇒ <code>Array.&lt;String&gt;</code>
    * [.fit_transform(options)](#ColumnVectorizer+fit_transform)
    * [.get_limited_features(options)](#ColumnVectorizer+get_limited_features)
    * [.evaluateString(testString)](#ColumnVectorizer+evaluateString) ⇒ <code>Object</code>
    * [.evaluate(testString)](#ColumnVectorizer+evaluate) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>

<a name="new_ColumnVectorizer_new"></a>

### new ColumnVectorizer([options])
creates a new instance for classifying text data for machine learning


| Param | Type | Default |
| --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | 

**Example**  
```js
const dataset = new ms.nlp.ColumnVectorizer(csvData);
```
<a name="ColumnVectorizer+get_tokens"></a>

### columnVectorizer.get_tokens() ⇒ <code>Array.&lt;String&gt;</code>
Returns a distinct array of all tokens

**Kind**: instance method of [<code>ColumnVectorizer</code>](#ColumnVectorizer)  
**Returns**: <code>Array.&lt;String&gt;</code> - returns a distinct array of all tokens  
<a name="ColumnVectorizer+get_vector_array"></a>

### columnVectorizer.get_vector_array() ⇒ <code>Array.&lt;String&gt;</code>
Returns array of arrays of strings for dependent features from sparse matrix word map

**Kind**: instance method of [<code>ColumnVectorizer</code>](#ColumnVectorizer)  
**Returns**: <code>Array.&lt;String&gt;</code> - returns array of dependent features for DataSet column matrics  
<a name="ColumnVectorizer+fit_transform"></a>

### columnVectorizer.fit_transform(options)
Fits and transforms data by creating column vectors (a sparse matrix where each row has every word in the corpus as a column and the count of appearances in the corpus)

**Kind**: instance method of [<code>ColumnVectorizer</code>](#ColumnVectorizer)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.data | <code>Array.&lt;Object&gt;</code> | array of corpus data |

<a name="ColumnVectorizer+get_limited_features"></a>

### columnVectorizer.get_limited_features(options)
Returns limited sets of dependent features or all dependent features sorted by word count

**Kind**: instance method of [<code>ColumnVectorizer</code>](#ColumnVectorizer)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>\*</code> |  |
| options.maxFeatures | <code>number</code> | max number of features |

<a name="ColumnVectorizer+evaluateString"></a>

### columnVectorizer.evaluateString(testString) ⇒ <code>Object</code>
returns word map with counts

**Kind**: instance method of [<code>ColumnVectorizer</code>](#ColumnVectorizer)  
**Returns**: <code>Object</code> - object of corpus words with accounts  

| Param | Type |
| --- | --- |
| testString | <code>String</code> | 

**Example**  
```js
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
```
<a name="ColumnVectorizer+evaluate"></a>

### columnVectorizer.evaluate(testString) ⇒ <code>Array.&lt;Array.&lt;number&gt;&gt;</code>
returns new matrix of words with counts in columns

**Kind**: instance method of [<code>ColumnVectorizer</code>](#ColumnVectorizer)  
**Returns**: <code>Array.&lt;Array.&lt;number&gt;&gt;</code> - sparse matrix row for new classification predictions  

| Param | Type |
| --- | --- |
| testString | <code>String</code> | 

**Example**  
```js
ColumnVectorizer.evaluate('I would rate everything Great, views Great, food Great') => [ [ 0, 1, 3, 0, 0, 0, 0, 0, 1 ] ]
```
<a name="DataSet"></a>

## DataSet
**Kind**: global class  

* [DataSet](#DataSet)
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

### new DataSet(dataset)
creates a new raw data instance for preprocessing data for machine learning


| Param | Type |
| --- | --- |
| dataset | <code>Array.&lt;Object&gt;</code> | 

**Example**  
```js
const dataset = new ms.DataSet(csvData);
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
    * [.cross_validate_score(options)](#cross_validation.cross_validate_score) ⇒ <code>Array.&lt;number&gt;</code>
    * [.grid_search(options)](#cross_validation.grid_search) ⇒ <code>Array.&lt;number&gt;</code>

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
const trainTestSplit = ms.cross_validation.train_test_split(testArray,{ test_size:0.2, random_state: 0, });
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
const crossValidationArrayKFolds = ms.cross_validation.cross_validation_split(testArray, { folds: 2, random_state: 0, });
```
<a name="cross_validation.cross_validate_score"></a>

### cross_validation.cross_validate_score(options) ⇒ <code>Array.&lt;number&gt;</code>
Used to test variance and bias of a prediction

**Kind**: static method of [<code>cross_validation</code>](#cross_validation)  
**Returns**: <code>Array.&lt;number&gt;</code> - Array of accucracy calculations  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.classifier | <code>function</code> | instance of classification model used for training, or function to train a model. e.g. new DecisionTreeClassifier({ gainFunction: 'gini', }) or ml.KNN |
| options.regression | <code>function</code> | instance of regression model used for training, or function to train a model. e.g. new RandomForestRegression({ nEstimators: 300, }) or ml.MultivariateLinearRegression |

<a name="cross_validation.grid_search"></a>

### cross_validation.grid_search(options) ⇒ <code>Array.&lt;number&gt;</code>
Used to test variance and bias of a prediction with parameter tuning

**Kind**: static method of [<code>cross_validation</code>](#cross_validation)  
**Returns**: <code>Array.&lt;number&gt;</code> - Array of accucracy calculations  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.classifier | <code>function</code> | instance of classification model used for training, or function to train a model. e.g. new DecisionTreeClassifier({ gainFunction: 'gini', }) or ml.KNN |
| options.regression | <code>function</code> | instance of regression model used for training, or function to train a model. e.g. new RandomForestRegression({ nEstimators: 300, }) or ml.MultivariateLinearRegression |

<a name="preprocessing"></a>

## preprocessing : <code>object</code>
**Kind**: global namespace  

* [preprocessing](#preprocessing) : <code>object</code>
    * [.DataSet](#preprocessing.DataSet)
        * [new DataSet()](#new_preprocessing.DataSet_new)

<a name="preprocessing.DataSet"></a>

### preprocessing.DataSet
**Kind**: static class of [<code>preprocessing</code>](#preprocessing)  
<a name="new_preprocessing.DataSet_new"></a>

#### new DataSet()
class for manipulating an array of objects, typically from CSV data

<a name="ml"></a>

## ml : <code>object</code>
**Kind**: global namespace  
**See**: [https://github.com/mljs/ml](https://github.com/mljs/ml)  
<a name="nlp"></a>

## nlp : <code>object</code>
**Kind**: global namespace  
**See**: [https://github.com/NaturalNode/natural](https://github.com/NaturalNode/natural)  

* [nlp](#nlp) : <code>object</code>
    * [.ColumnVectorizer](#nlp.ColumnVectorizer)
        * [new ColumnVectorizer()](#new_nlp.ColumnVectorizer_new)

<a name="nlp.ColumnVectorizer"></a>

### nlp.ColumnVectorizer
**Kind**: static class of [<code>nlp</code>](#nlp)  
<a name="new_nlp.ColumnVectorizer_new"></a>

#### new ColumnVectorizer()
class creating sparse matrices from a corpus

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
  const SE = ms.util.standardError(actuals, estimates);
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
const r2 = ms.util.coefficientOfDetermination(actuals, estimates); 
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

