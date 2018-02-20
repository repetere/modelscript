'use strict';
const ms = require('../../dist/modelscript.cjs');
const expect = require('chai').expect;
const csvData = [
  {
    'Review': 'This is really good',
    'Liked': 1,
  },
  {
    'Review': 'I would definitely recommend',
    'Liked': 1,
  },
  {
    'Review': 'The wait staff was really rude',
    'Liked': 0,
  },
  {
    'Review': 'Great views',
    'Liked': 1,
  },
  {
    'Review': 'the food was not great',
    'Liked': 0,
  },
  {
    'Review': 'food came out cold, took forever to get seated',
    'Liked': 0,
  },
  {
    'Review': 'we had a great time, and they were really prompt and attentive',
    'Liked': 1,
  },
  {
    'Review': 'the food was bland',
    'Liked': 0,
  },
  {
    'Review': 'not very flavorful',
    'Liked': 0,
  },
  {
    'Review': 'it was kind of so-so',
    'Liked': 0,
  },
];
const eVString = 'I would rate everything Great, views Great, food Great';

describe('nlp', function() {
  describe('ColumnVectorizer class', () => {
    const CSVDataSet = new ms.DataSet(csvData);
    const nlpVectors = new ms.nlp.ColumnVectorizer({
      data: CSVDataSet.columnArray('Review'),
      maxFeatures: 9,
    });
    nlpVectors.fit_transform();
    // console.log({ nlpVectors });
    describe('constructor', () => {
      it('should instantiate a new ColumnVectorizer Class', () => {
        expect(ms.nlp).to.be.an('object');
        expect(ms.nlp.ColumnVectorizer).to.be.a('function');
        expect(nlpVectors).to.be.instanceof(ms.nlp.ColumnVectorizer);
        expect(nlpVectors.maxFeatures).to.eql(9);
        // console.log({ nlpVectors });
      });
    });
    describe('get_tokens', () => {
      it('should return an array of all tokens', () => {
        const toks = nlpVectors.get_tokens();
        expect(toks).to.be.an('array');
        expect(toks).to.have.lengthOf(nlpVectors.tokens.size);
      });
    });
    describe('get_vector_array', () => {
      it('should return an array of tokens as vectors', () => {
        const toks = nlpVectors.get_vector_array();
        expect(toks).to.be.an('array');
        expect(toks[0]).to.be.an('array');
        expect(toks).to.have.lengthOf(nlpVectors.tokens.size);
      });
    });
    describe('get_limited_features', () => {
      it('should return a count of maxFeatures in array of tokens as vectors', () => {
        const feats = nlpVectors.get_limited_features();
        expect(feats).to.be.an('array');
        expect(feats[0]).to.be.an('array');
        expect(feats).to.have.lengthOf(nlpVectors.maxFeatures);
      });
      it('should limit features in array of tokens as vectors', () => {
        const feats = nlpVectors.get_limited_features({ maxFeatures: 5, });
        expect(feats).to.be.an('array');
        expect(feats[0]).to.be.an('array');
        expect(feats).to.have.lengthOf(5);
      });
    });
    describe('evaluateString', () => {
      it('should return object of tokens and counts', () => {
        const estring = nlpVectors.evaluateString(eVString);
        expect(estring.great).to.eql(3);
        expect(estring.view).to.eql(1);
        expect(estring.food).to.eql(1);
      });
    });
    describe('evaluate', () => {
      it('should return matrix vector for new predictions', () => {
        const estring = nlpVectors.evaluate(eVString);
        // console.log({estring})
        expect(estring).to.be.an('array');
        expect(estring[ 0 ]).to.have.lengthOf(9);
        expect(estring[ 0 ].filter(val => val === 3).length).to.eql(1);
      });
    });
    describe('fit_transform', () => {
      it('should create a set of unique tokens this.tokens', () => {
        const tokens = csvData.reduce((result, value) => {
          const val = value.Review.toLowerCase();
          const stringVal = ms.nlp.PorterStemmer.tokenizeAndStem(val).join(' ');
          result += stringVal+' ';
          return result;
        }, '');
        const tokenSet = new Set(tokens.split(' ').filter(val => val));
        expect(nlpVectors.tokens.size).to.eql(tokenSet.size);
        tokenSet.forEach((val) => {
          expect(nlpVectors.tokens.has(val)).to.be.true;
        });
      });
      it('should create a dictionary of total word counts in this.wordCountMap', () => {
        const wordCountMap = csvData.reduce((result, value) => {
          const val = value.Review.toLowerCase();
          const stringVals = ms.nlp.PorterStemmer.tokenizeAndStem(val);
          stringVals.forEach(token => {
            result[ token ] = (result[ token ])
              ? result[ token ] + 1
              : 1;
          });
          return result;
        }, {});
        Object.keys(wordCountMap).forEach(word => {
          expect(wordCountMap[ word ]).to.eql(nlpVectors.wordCountMap[ word ]);
        });
      });
      it('should create a dictionary of all words this.wordMap', () => {
        Array.from(nlpVectors.tokens).forEach(token => {
          expect(nlpVectors.wordMap[ token ]).to.eql(0);
        });
      });
      it('should create an array of all sorted words in this.sortedWordCount by word count', () => {
        nlpVectors.sortedWordCount.forEach((wordObj, i) => { 
          if (i < nlpVectors.sortedWordCount.length-1) {
            const currentSWC = nlpVectors.sortedWordCount[ i ];
            const nextSWC = nlpVectors.sortedWordCount[ i + 1 ];
            expect(nlpVectors.wordCountMap[ currentSWC ]).to.be.gte(nlpVectors.wordCountMap[ nextSWC ]);
          }
        });
      });
      it('should create a sparse matrix dictionary words from corpus in this.data as this.vectors', () => {
        const firstSentence = csvData[ 0 ].Review;
        const firstSentenceWordMap = nlpVectors.evaluateString(firstSentence);
        expect(firstSentenceWordMap).to.eql(nlpVectors.vectors[ 0 ]);
      });
      it('should create a sparse matrix of words from corpus in this.data', () => {
        const firstSentence = csvData[ 0 ].Review;
        const firstSentenceWordMap = nlpVectors.evaluate(firstSentence);
        expect(firstSentenceWordMap[0]).to.eql(nlpVectors.matrix[ 0 ]);
      });
    });
  });
});