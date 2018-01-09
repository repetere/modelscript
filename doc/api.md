## Classes

<dl>
<dt><a href="#RawData">RawData</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#cross_validation">cross_validation</a> : <code>object</code></dt>
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
<a name="cross_validation"></a>

## cross_validation : <code>object</code>
**Kind**: global namespace  
**See**: [https://machinelearningmastery.com/implement-resampling-methods-scratch-python/](https://machinelearningmastery.com/implement-resampling-methods-scratch-python/)  

* [cross_validation](#cross_validation) : <code>object</code>
    * [.train_test_split(dataset, options)](#cross_validation.train_test_split) ⇒ <code>Object</code> \| <code>array</code>
    * [.kfolds(dataset, options)](#cross_validation.kfolds) ⇒ <code>array</code>

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

<a name="cross_validation.kfolds"></a>

### cross_validation.kfolds(dataset, options) ⇒ <code>array</code>
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
