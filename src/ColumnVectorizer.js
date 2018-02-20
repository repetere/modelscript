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
   * creates a new c instance for preprocessing data for machine learning
   * @example
   * const dataset = new ms.DataSet(csvData);
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
  get_tokens() {
    return Array.from(this.tokens);
  }
  get_vector_array() {
    return this.get_tokens().map(tok => [
      tok,
    ]);
  }
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
  get_limited_features(options = {}) {
    const maxFeatures = options.maxFeatures || this.maxFeatures || this.tokens.size;
 
    return this.sortedWordCount
      .slice(0, maxFeatures)
      .map(feature => [ feature, ]);
  }
  evaluteString(testString = '') {
    const evalString = this.replacer(testString);
    const evalStringWordMap = evalString.split(' ').reduce((result, value) => { 
      if (this.tokens.has(value)) {
        result[ value ] = (result[ value ]!==undefined)
          ? result[ value ] + 1
          : 1;
      }
      return result;
    }, {});
    // console.log({ evalStringWordMap, });
    return Object.assign({}, this.wordMap, evalStringWordMap);
  }
  evaluate(testString='', options) {
    const stringObj = this.evaluteString(testString);
    const limitedFeatures = this.get_limited_features(options);
    const vectorData = new DataSet([
      stringObj,
    ]);
    return vectorData.columnMatrix(limitedFeatures);
  }
}