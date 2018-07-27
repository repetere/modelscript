'use strict';
const path = require('path');
const ms = require('../../dist/modelscript.cjs');
const expect = require('chai').expect;

describe('loadCSV', function () { 
  this.timeout(5000);
  describe('loading CSV from File', () => {
    it('should load a csv from a filepath', (done) => {
      expect(ms.loadCSV).to.be.an('function');
      ms.loadCSV(path.join(__dirname, '../mock/data.csv'))
        .then(csv => {
          expect(csv.length).to.be.greaterThan(0);
          done();
        })
        .catch(done);    
    });
    it('should handle errors with invalid files', (done) => {
      ms.loadCSV(path.join(__dirname, '../mock/invalid-file.csv'))
        .then(() => {
          done(new Error('should not load CSV'));
        })
        .catch(err => {
          expect(err).to.be.an('error');
          done();
        });
    });
  });
  describe('loading CSV from remote URI', () => {
    it('should load a csv from a remote URI', (done) => {
      // ms.loadCSV('https://www.arttimesjournal.com/data/events-August-2015.csv')
      ms.loadCSV('https://raw.githubusercontent.com/repetere/modelscript/master/test/mock/data.csv')
        .then(csv => {
          expect(csv.length).to.be.greaterThan(0);
          done();
        })
        .catch(done);      
    });
    it('should handle errors with invalid url', (done) => {
      ms.loadCSV('https://raw.githubusercontent.com/repetere/modelscript/master/test/mock/INVALID.csv')
        .then(csv => {
          expect(csv.length).to.be.equal(0);
          done();
        })
        .catch(done); 
    });
    it('should load a csv from a remote URI directly', (done) => {
      expect(ms.loadCSVURI).to.be.an('function');
      // ms.loadCSV('https://www.arttimesjournal.com/data/events-August-2015.csv')
      ms.loadCSVURI('https://raw.githubusercontent.com/repetere/modelscript/master/test/mock/data.csv')
        .then(csv => {
          expect(csv.length).to.be.greaterThan(0);
          done();
        })
        .catch(done);      
    });
    it('should handle errors with invalid url directly', (done) => {
      ms.loadCSVURI('https://raw.githubusercontent.com/repetere/modelscript/master/test/mock/INVALID.csv')
        .then(csv => {
          expect(csv.length).to.be.equal(0);
          done();
        })
        .catch(done); 
    });
  });
  describe('loadTSV', () => {
    it('should load tab separated values', (done) => {
      expect(ms.csv.loadTSV).to.be.an('function');
      ms.csv.loadTSV(path.join(__dirname, '../mock/Restaurant_Reviews.tsv'))
        .then(tsv => {
          const firstRow = tsv[ 0 ];
          expect(tsv.length).to.be.greaterThan(0);
          expect(firstRow.Review).to.be.a('string');
          expect(firstRow.Liked).to.be.a('number');
          done();
        })
        .catch(done);  
    });
  });
});