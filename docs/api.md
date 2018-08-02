# Class

## `ColumnVectorizer`

class creating sparse matrices from a corpus

### `constructor(options: Object): this`

creates a new instance for classifying text data for machine learning

### `data: *`

### `tokens: *`

### `vectors: *`

### `wordMap: *`

### `wordCountMap: *`

### `maxFeatures: *`

### `sortedWordCount: *`

### `limitedFeatures: *`

### `matrix: *`

### `replacer: *`

### `get_tokens(): String[]`

Returns a distinct array of all tokens

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `get_vector_array(): String[]`

Returns array of arrays of strings for dependent features from sparse matrix word map

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `fit_transform(options: Object, options.data: Object[])`

Fits and transforms data by creating column vectors (a sparse matrix where each row has every word in the corpus as a column and the count of appearances in the corpus)

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| options | Object |  |
| options.data | Object[] |  | array of corpus data |

### `get_limited_features(options: *, options.maxFeatures: number)`

Returns limited sets of dependent features or all dependent features sorted by word count

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| options | * |  |
| options.maxFeatures | number |  | max number of features |

### `evaluateString(testString: String): Object`

returns word map with counts

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| testString | String |  |

### `evaluate(testString: String): number[][]`

returns new matrix of words with counts in columns

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| testString | String |  |

## `DataSet`

class for manipulating an array of objects, typically from CSV data

### `constructor(dataset: Object[]): this`

creates a new raw data instance for preprocessing data for machine learning

### `config: *`

### `data: *`

### `labels: *`

### `encoders: *`

### `scalers: *`

### `selectColumns: *`

### `columnArray: *`

### `encodeObject: *`

### `oneHotEncoder: *`

### `oneHotDecoder: *`

### `columnMatrix: *`

### `reverseColumnMatrix: *`

### `reverseColumnVector: *`

### `getTransforms: *`

### `getTransforms(transforms: Object): Array<Object>`

Allows for fit transform short hand notation

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| transforms | Object |  |

### `reverseColumnMatrix(options: *, options.vectors: Array[], options.labels: String[]): Object[]`

returns an array of objects by applying labels to matrix of columns

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| options | * |  |
| options.vectors | Array[] |  | array of vectors |
| options.labels | String[] |  | array of labels |

### `reverseColumnVector()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `encodeObject(data: Object, options: {labels:Array<String>,prefix:String,name:String}): Object`

Returns an object into an one hot encoded object

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| data | Object |  | object to encode |
| options | {labels:Array<String>,prefix:String,name:String} |  | encoded object options |

### `oneHotEncoder(name: string, options: *): Object`

returns a new object of one hot encoded values

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| name | string |  | csv column header, or JSON object property name |
| options | * |  |

### `oneHotDecoder(name: string, options: *): Array<Object>`

Return one hot encoded data

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| name | string |  | column name |
| options | * |  |

### `selectColumns(names: String[], options: *): Object[]`

returns a list of objects with only selected columns as properties

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| names | String[] |  | array of selected columns |
| options | * |  |

### `columnArray(name: string, options: *, options.prefilter: function, options.filter: function, options.replace.test: function, options.replace.value: string|number|function, options.parseIntBase: number, options.parseFloat: boolean, options.parseInt: boolean, options.scale: boolean): array`

returns a new array of a selected column from an array of objects, can filter, scale and replace values

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| name | string |  | csv column header, or JSON object property name |
| options | * |  |
| options.prefilter | function | optional: true | prefilter values to return |
| options.filter | function | optional: true | filter values to return |
| options.replace.test | function | optional: true, default: undefined | test function for replacing values (arr[val]) |
| options.replace.value | string|number|function | optional: true, default: undefined | value to replace (arr[val]) if replace test is true, if a function (result,val,index,arr,name)=>your custom value |
| options.parseIntBase | number | optional: true, default: 10 | radix value for parseInt |
| options.parseFloat | boolean | optional: true, default: false | convert values to floats |
| options.parseInt | boolean | optional: true, default: false | converts values to ints |
| options.scale | boolean | optional: true, default: false | standard or minmax feature scale values |

### `columnMatrix(vectors: Array, data: Array): Array`

returns a matrix of values by combining column arrays into a matrix

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| vectors | Array | optional: true, default: [] | array of arguments for columnArray to merge columns into a matrix |
| data | Array | optional: true, default: [] | array of data to convert to matrix |

### `filterColumn(filter: Function): Array`

returns filtered rows of data

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| filter | Function | optional: true | filter function |

### `columnScale(name: string, options.strategy: string): number[]`

Returns a new array of scaled values which can be reverse (descaled). The scaling transformations are stored on the DataSet

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| name | string |  | name - csv column header, or JSON object property name |
| options.strategy | string | optional: true, default: "log" | strategy for scaling values |

### `columnDescale(name: string, options.strategy: string): number[]`

Returns a new array of descaled values

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| name | string |  | name - csv column header, or JSON object property name |
| options.strategy | string | optional: true, default: "log" | strategy for scaling values |

### `labelEncoder(name: string, options: *, options.binary: boolean): array`

returns a new array and label encodes a selected column

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| name | string |  | csv column header, or JSON object property name |
| options | * |  |
| options.binary | boolean | optional: true, default: false | only replace with (0,1) with binary values |

### `labelDecode(name: string, options: *): array`

returns a new array and decodes an encoded column back to the original array values

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| name | string |  | csv column header, or JSON object property name |
| options | * |  |

### `oneHotColumnArray(name: string, options: *): Array<Object>`

Return one hot encoded data

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| name | string |  | column name |
| options | * |  |

### `columnReducer(name: String, options: Object, options.columnName: String, options.columnOptions: Object, options.reducer: Function): Object`

it returns a new column that reduces a column into a new column object, this is used in data prep to create new calculated columns for aggregrate statistics

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| name | String |  | name of new Column |
| options | Object |  |
| options.columnName | String |  | name property for columnArray selection |
| options.columnOptions | Object |  | options property for columnArray |
| options.reducer | Function |  | reducer function to reduce into new array, it should push values into the resulting array |

### `columnMerge(name: String, data: Array): Object`

it returns a new column that is merged onto the data set

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| name | String |  | name of new Column |
| data | Array |  | new dataset data |

### `inverseTransformObject(data: *, options: *): Object`

Inverses transform on an object

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| data | * |  |
| options | * |  |

### `transformObject(data: *, options: *): Object`

transforms an object and replaces values that have been scaled or encoded

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| data | * |  |
| options | * |  |

### `columnReplace(name: string, options: *, options.empty: boolean, options.strategy: boolean): array|Object[]`

returns a new array of a selected column from an array of objects and replaces empty values, encodes values and scales values

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| name | string |  | csv column header, or JSON object property name |
| options | * |  |
| options.empty | boolean | optional: true, default: true | replace empty values |
| options.strategy | boolean | optional: true, default: "mean" | strategy for replacing value, any array stat method from ml.js (mean, standardDeviation, median) or (label,labelEncoder,onehot,oneHotEncoder) |

### `fitColumns(options.returnData: Boolean, options.columns: Object[]): Object[]`

mutates data property of DataSet by replacing multiple columns in a single command

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| options.returnData | Boolean |  | return updated DataSet data property |
| options.columns | Object[] |  | {name:'columnName',options:{strategy:'mean',labelOoptions:{}},} |

### `fitInverseTransforms(options: *)`

Mutate dataset data by inversing all transforms

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| options | * |  |

### `fitTransforms(options: *)`

Mutate dataset data with all transforms

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| options | * |  |

## `ReinforcedLearningBase`

base interface class for reinforced learning

### `constructor(options: Object): this`

base class for reinforced learning

### `bounds: *`

### `getBound: *`

### `last_selected: *`

### `total_reward: *`

### `iteration: *`

### `learn()`

interface instance method for reinforced learning step

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `train()`

interface instance method for reinforced training step

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `predict()`

interface instance method for reinforced prediction step

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

## `UpperConfidenceBound`

Implementation of the Upper Confidence Bound algorithm

### `constructor(options: Object): this`

creates a new instance of the Upper confidence bound(UCB) algorithm. UCB is based on the principle of optimism in the face of uncertainty, which is to choose your actions as if the environment (in this case bandit) is as nice as is plausibly possible

### `numbers_of_selections: *`

### `sums_of_rewards: *`

### `total_reward: *`

### `predict(): number`

returns next action based off of the upper confidence bound

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `learn(ucbRow: Object, getBound: Function): this`

single step trainning method

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| ucbRow | Object |  | row of bound selections |
| getBound | Function | optional: true, default: this.getBound | select value of ucbRow by selection value |

### `train(ucbRow: Object|Object[], getBound: Function): this`

training method for upper confidence bound calculations

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| ucbRow | Object|Object[] |  | row of bound selections |
| getBound | Function | optional: true, default: this.getBound | select value of ucbRow by selection value |

## `ThompsonSampling`

Implementation of the Thompson Sampling algorithm

### `constructor(options: Object): this`

creates a new instance of the Thompson Sampling(TS) algorithm. TS a heuristic for choosing actions that addresses the exploration-exploitation dilemma in the multi-armed bandit problem. It consists in choosing the action that maximizes the expected reward with respect to a randomly drawn belief

### `numbers_of_rewards_1: *`

### `numbers_of_rewards_0: *`

### `total_reward: *`

### `predict(): number`

returns next action based off of the thompson sampling

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `learn(tsRow: Object, getBound: Function): this`

single step trainning method

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| tsRow | Object |  | row of bound selections |
| getBound | Function | optional: true, default: this.getBound | select value of tsRow by selection value |

### `train(tsRow: Object|Object[], getBound: Function): this`

training method for thompson sampling calculations

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| tsRow | Object|Object[] |  | row of bound selections |
| getBound | Function | optional: true, default: this.getBound | select value of tsRow by selection value |

# Function

## `getTransactions(data: Array, options: Object, options.exludeEmptyTranscations: Boolean): Object`

Formats an array of transactions into a sparse matrix like format for Apriori/Eclat

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| data | Array |  | CSV data of transactions |
| options | Object |  |
| options.exludeEmptyTranscations | Boolean | optional: true, default: true | exclude empty rows of transactions |

## `assocationRuleLearning(transactions: Array, options: Object, options.support: Number, options.minLength: Number, options.summary: Boolean, options.valuesMap: Map): Object`

returns association rule learning results

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| transactions | Array |  | sparse matrix of transactions |
| options | Object |  |
| options.support | Number | optional: true, default: 0.4 | support level |
| options.minLength | Number | optional: true, default: 2 | minimum assocation array size |
| options.summary | Boolean | optional: true, default: true | return summarized results |
| options.valuesMap | Map | optional: true, default: new Map() | map of values and labels (used for summary results) |

## `train_test_split(dataset: array, options: object, options.test_size: number, options.train_size: number, options.random_state: number, options.return_array: boolean): Object|array`

Split arrays into random train and test subsets

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| dataset | array |  | array of data to split |
| options | object |  |
| options.test_size | number | optional: true, default: 0.2 | represent the proportion of the dataset to include in the test split, can be overwritten by the train_size |
| options.train_size | number | optional: true, default: 0.8 | represent the proportion of the dataset to include in the train split |
| options.random_state | number | optional: true, default: 0 | the seed used by the random number generator |
| options.return_array | boolean | optional: true, default: false | will return an object {train,test} of the split dataset by default or [train,test] if returned as an array |

## `cross_validation_split(dataset: array, options: object, options.folds: number, options.random_state: number): array`

Provides train/test indices to split data in train/test sets. Split dataset into k consecutive folds. Each fold is then used once as a validation while the k - 1 remaining folds form the training set.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| dataset | array |  | array of data to split |
| options | object |  |
| options.folds | number | optional: true, default: 3 | Number of folds |
| options.random_state | number | optional: true, default: 0 | the seed used by the random number generator |

## `cross_validate_score(options: object, options.classifier: function, options.regression: function): number[]`

Used to test variance and bias of a prediction

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| options | object |  |
| options.classifier | function |  | instance of classification model used for training, or function to train a model. e.g. new DecisionTreeClassifier({ gainFunction: 'gini', }) or ml.KNN |
| options.regression | function |  | instance of regression model used for training, or function to train a model. e.g. new RandomForestRegression({ nEstimators: 300, }) or ml.MultivariateLinearRegression |

## `grid_search(options: object, options.classifier: function, options.regression: function): number[]`

Used to test variance and bias of a prediction with parameter tuning

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| options | object |  |
| options.classifier | function |  | instance of classification model used for training, or function to train a model. e.g. new DecisionTreeClassifier({ gainFunction: 'gini', }) or ml.KNN |
| options.regression | function |  | instance of regression model used for training, or function to train a model. e.g. new RandomForestRegression({ nEstimators: 300, }) or ml.MultivariateLinearRegression |

## `loadCSVURI(filepath: string, options: Object): Object[]`

Asynchronously loads a CSV from a remote URL and returns an array of objects

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| filepath | string |  | URL to CSV path |
| options | Object | optional: true | options passed to csvtojson |

## `loadCSV(filepath: string, options: Object): Object[]`

Asynchronously loads a CSV from either a filepath or remote URL and returns an array of objects

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| filepath | string |  | URL to CSV path |
| options | Object | optional: true | options passed to csvtojson |

## `loadTSV(filepath: string, options: Object): Object[]`

Asynchronously loads a TSV from either a filepath or remote URL and returns an array of objects

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| filepath | string |  | URL to CSV path |
| options | Object | optional: true | options passed to csvtojson |

## `scale()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

## `max()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

## `min()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

## `squaredDifference(left: Number[], right: Number[]): Number[]`

Returns an array of the squared different of two arrays

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| left | Number[] |  |
| right | Number[] |  |

## `standardError(actuals: Number[], estimates: Number[]): Number`

The standard error of the estimate is a measure of the accuracy of predictions made with a regression line. Compares the estimate to the actual value

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| actuals | Number[] |  | numerical samples |
| estimates | Number[] |  | estimates values |

## `standardScore(observations: Number[]): Number[]`

Calculates the z score of each value in the sample, relative to the sample mean and standard deviation.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| observations | Number[] |  | An array like object containing the sample data. |

## `coefficientOfDetermination(actuals: Number[], estimates: Number[]): Number`

In statistics, the coefficient of determination, denoted R2 or r2 and pronounced "R squared", is the proportion of the variance in the dependent variable that is predictable from the independent variable(s). Compares distance of estimated values to the mean. {\bar {y}}={\frac {1}{n}}\sum _{i=1}^{n}y_{i}

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| actuals | Number[] |  | numerical samples |
| estimates | Number[] |  | estimates values |

## `adjustedCoefficentOfDetermination(options: Object, options.actuals: Number[], options.estimates: Number[], options.rSquared: Number, options.sampleSize: Number, options.independentVariables: Number): Number`

You can use the adjusted coefficient of determination to determine how well a multiple regression equation “fits” the sample data. The adjusted coefficient of determination is closely related to the coefficient of determination (also known as R2) that you use to test the results of a simple regression equation.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| options | Object | optional: true, default: {} |
| options.actuals | Number[] | optional: true | numerical samples |
| options.estimates | Number[] | optional: true | estimate values |
| options.rSquared | Number | optional: true | coefficent of determination |
| options.sampleSize | Number | optional: true | the sample size |
| options.independentVariables | Number |  | the number of independent variables in the regression equation |

## `coefficientOfCorrelation(actuals: Number[], estimates: Number[]): Number`

The coefficent of Correlation is given by R decides how well the given data fits a line or a curve.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| actuals | Number[] |  | numerical samples |
| estimates | Number[] |  | estimates values |

## `rSquared(actuals: Number[], estimates: Number[]): Number`

The coefficent of determination is given by r^2 decides how well the given data fits a line or a curve.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| actuals | Number[] | optional: true, default: [] |
| estimates | Number[] | optional: true, default: [] |

## `pivotVector(vectors: Array[]): Array[]`

returns an array of vectors as an array of arrays

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| vectors | Array[] |  |

## `pivotArrays(vectors: Array): Array`

returns a matrix of values by combining arrays into a matrix

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| vectors | Array | optional: true, default: [] | array of arguments for columnArray to merge columns into a matrix |

## `StandardScaler(z: number[]): number[]`

Standardize features by removing the mean and scaling to unit variance Centering and scaling happen independently on each feature by computing the relevant statistics on the samples in the training set. Mean and standard deviation are then stored to be used on later data using the transform method. Standardization of a dataset is a common requirement for many machine learning estimators: they might behave badly if the individual feature do not more or less look like standard normally distributed data (e.g. Gaussian with 0 mean and unit variance)

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| z | number[] |  | array of integers or floats |

## `StandardScalerTransforms(values: Number[]): Object`

This function returns two functions that can standard scale new inputs and reverse scale new outputs

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| values | Number[] |  | array of numbers |

## `MinMaxScaler(z: number[]): number[]`

Transforms features by scaling each feature to a given range. This estimator scales and translates each feature individually such that it is in the given range on the training set, i.e. between zero and one.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| z | number[] |  | array of integers or floats |

## `MinMaxScalerTransforms(values: Number[]): Object`

This function returns two functions that can mix max scale new inputs and reverse scale new outputs

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| values | Number[] |  | array of numbers |

## `approximateZPercentile(z: number): number`

Converts z-score into the probability

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| z | number |  | Number of standard deviations from the mean. |

## `getSafePropertyName(name: String): String`

returns a safe column name / url slug from a string

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| name | String |  |