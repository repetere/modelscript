// import { ml, } from './ml';
import { nlp, } from './nlp';
// import { util as utils, } from './util';
import { DataSet, } from './DataSet';

/**
 * class creating sparse matrices from a corpus
 * @class ColumnVectorizer
 * @memberOf nlp
 */
export class ColumnVectorizer {
  /**
   * creates a new instance for classifying text data for machine learning
   * @example
   * const dataset = new ms.nlp.ColumnVectorizer(csvData);
   * @param {Object} [options={}]
   * @prop {Object[]} this.data - Array of strings
   * @prop {Set} this.tokens - Unique collection of all tokenized strings
   * @prop {Object[]} this.vectors - Array of tokenized words with value of count of appreance in string
   * @prop {Object} this.wordMap - Object of all unique words, with value of 0
   * @prop {Object} this.wordCountMap - Object of all unique words, with value as total count of appearances
   * @prop {number} this.maxFeatures - max number of features
   * @prop {String[]} this.sortedWordCount - list of words as tokens sorted by total appearances
   * @prop {String[]} this.limitedFeatures - subset list of maxFeatures words as tokens sorted by total appearances
   * @prop {Array[]} this.matrix - words in sparse matrix
   * @prop {Function} this.replacer - clean string function
   * @returns {this} 
   */
  constructor(options = {}) {
    this.data = options.data || [];
    this.tokens = new Set();
    this.vectors = [];
    this.wordMap = {};
    this.wordCountMap = {};
    this.maxFeatures = options.maxFeatures;
    this.sortedWordCount = [];
    this.limitedFeatures = [];
    this.matrix = [];
    this.replacer = (value='') => {
      const cleanedValue = value
        .toLowerCase()
        .replace(/[^a-zA-Z]/gi, ' ');
      return nlp.PorterStemmer
        .tokenizeAndStem(cleanedValue)
        .join(' ');
    };
    return this;
  }
  /** 
   * Returns a distinct array of all tokens
   * @return {String[]} returns a distinct array of all tokens
  */
  get_tokens() {
    return Array.from(this.tokens);
  }
  /** 
   * Returns array of arrays of strings for dependent features from sparse matrix word map
   * @return {String[]} returns array of dependent features for DataSet column matrics
  */
  get_vector_array() {
    return this.get_tokens().map(tok => [
      tok,
    ]);
  }
  /**
   * Fits and transforms data by creating column vectors (a sparse matrix where each row has every word in the corpus as a column and the count of appearances in the corpus)
   * @param {Object} options 
   * @param {Object[]} options.data - array of corpus data 
   */
  fit_transform(options = {}) {
    const data = options.data || this.data;
    data.forEach(datum => {
      const datums = {};
      this.replacer(datum)
        .split(' ')
        .forEach(tok => {
          const token = tok.toLowerCase();
          datums[ token ] = (datums[ token ])
            ? datums[ token ] + 1
            : 1;
          this.wordCountMap[token] = (this.wordCountMap[token])
            ? this.wordCountMap[token] + 1
            : 1;
          this.tokens.add(token);
        });
      this.vectors.push(datums);
    });
    this.wordMap = Array.from(this.tokens).reduce((result, value) => { 
      result[ value ] = 0;
      return result;
    }, {});
    this.sortedWordCount = Object.keys(this.wordCountMap)
      .sort((a, b) => this.wordCountMap[ b ] - this.wordCountMap[ a ]);
    this.vectors = this.vectors.map(vector => Object.assign({}, this.wordMap, vector));
    const vectorData = new DataSet(this.vectors);
    this.limitedFeatures = this.get_limited_features(options);
    this.matrix = vectorData.columnMatrix(this.limitedFeatures);
    return this.matrix;
  }
  /**
   * Returns limited sets of dependent features or all dependent features sorted by word count
   * @param {*} options 
   * @param {number} options.maxFeatures - max number of features 
   */
  get_limited_features(options = {}) {
    const maxFeatures = options.maxFeatures || this.maxFeatures || this.tokens.size;
 
    return this.sortedWordCount
      .slice(0, maxFeatures)
      .map(feature => [ feature, ]);
  }
  /**
   * returns word map with counts
   * @example 
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
   * @param {String} testString 
   * @return {Object} object of corpus words with accounts
   */
  evaluateString(testString = '') {
    const evalString = this.replacer(testString);
    const evalStringWordMap = evalString.split(' ').reduce((result, value) => { 
      if (this.tokens.has(value)) {
        result[ value ] = (result[ value ]!==undefined)
          ? result[ value ] + 1
          : 1;
      }
      return result;
    }, {});
    return Object.assign({}, this.wordMap, evalStringWordMap);
  }
  /**
   * returns new matrix of words with counts in columns
   * @example 
ColumnVectorizer.evaluate('I would rate everything Great, views Great, food Great') => [ [ 0, 1, 3, 0, 0, 0, 0, 0, 1 ] ]
   * @param {String} testString 
   * @return {number[][]} sparse matrix row for new classification predictions
   */
  evaluate(testString='', options) {
    const stringObj = this.evaluateString(testString);
    const limitedFeatures = this.get_limited_features(options);
    const vectorData = new DataSet([
      stringObj,
    ]);
    return vectorData.columnMatrix(limitedFeatures);
  }
}