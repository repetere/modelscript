## Classes

<dl>
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
    * [.columnArray(name, options)](#RawData+columnArray)
    * [.labelEncoder(name, options)](#RawData+labelEncoder)
    * [.labelDecode(name, options)](#RawData+labelDecode)
    * [.oneHotEncoder(name, options)](#RawData+oneHotEncoder)

<a name="new_RawData_new"></a>

### new RawData()
class for manipulating an array of objects, typically from CSV data

<a name="RawData+columnArray"></a>

### rawData.columnArray(name, options)
returns a new array of a selected column from an array of objects, can filter, scale and replace values

**Kind**: instance method of [<code>RawData</code>](#RawData)  

| Param |
| --- |
| name | 
| options | 

<a name="RawData+labelEncoder"></a>

### rawData.labelEncoder(name, options)
**Kind**: instance method of [<code>RawData</code>](#RawData)  
**See**: [http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html](http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html)  

| Param |
| --- |
| name | 
| options | 

<a name="RawData+labelDecode"></a>

### rawData.labelDecode(name, options)
**Kind**: instance method of [<code>RawData</code>](#RawData)  

| Param |
| --- |
| name | 
| options | 

<a name="RawData+oneHotEncoder"></a>

### rawData.oneHotEncoder(name, options)
**Kind**: instance method of [<code>RawData</code>](#RawData)  
**See**: [http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html](http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html)  

| Param |
| --- |
| name | 
| options | 

<a name="util"></a>

## util : <code>object</code>
**Kind**: global namespace  
<a name="util.StandardScaler"></a>

### util.StandardScaler()
**Kind**: static method of [<code>util</code>](#util)  
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
