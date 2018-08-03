import * as ms from '../../index.mjs';
import chai from 'chai';
const expect = chai.expect;
const rawTransactions = [
  ['Cookies', 'Milk', 'Plates', ],
  ['Cups', 'Milk', 'Silverware', ],
  ['Cookies', 'Cups', 'Milk', 'Silverware', ],
  ['Cups', 'Silverware', ],
  ['Cookies', 'Cups', 'Milk', 'Silverware', ],
];

// if (!Object.values) {
//   ObjectValues.shim();
// }
describe('calc', function () { 
  describe('getTransactions', () => {
    const gt = ms.calc.getTransactions(rawTransactions);
    // console.log(gt);
    it('should return values', () => {
      expect(gt).to.haveOwnProperty('values');
      expect(gt.values).to.be.a('set');
    });
    it('should contain all unique values of all transactions', () => {
      expect(Array.from(gt.values.values())).to.include.all.members([
        'Cookies', 'Milk', 'Plates', 'Cups', 'Silverware',
      ]);
    });
    it('should have a map of all unique values and indexes', () => {
      expect(gt.valuesMap).to.be.a('map');
      gt.values.forEach((val, i) => {
        expect(gt.valuesMap.has(val.toString())).to.be.true;
        expect(gt.valuesMap.get(val.toString())).to.eql(gt.valuesMap.get(i.toString()));
        expect(gt.valuesMap.has(i.toString())).to.be.true;
        expect(gt.valuesMap.get(i.toString())).to.eql(gt.valuesMap.get(val.toString()));
      });
    });
    it('should map values onto transactions', () => {
      expect(gt.transactions.length).to.eql(rawTransactions.length);
      rawTransactions.forEach((rt, i) => {
        expect(rt.length).to.eql(gt.transactions[ i ].length);
      });
    });
  });
  describe('assocationRuleLearning', () => {
    const gt = ms.calc.getTransactions(rawTransactions);
    it('should use Eclat to associate transactions', (done) => {
      // if (process.platform === 'darwin') {
      ms.calc.assocationRuleLearning(gt.transactions, {
        valuesMap: gt.valuesMap,
      })
        .then(arl => {
          // console.log('arl',arl);
          expect(arl).to.be.an('array');
          done();
        })
        .catch(done);
      expect(ms.calc.assocationRuleLearning).to.be.an('function');
      // }
    });
    it('should use accept options for eclat summary', (done) => {
      // if (process.platform === 'darwin') {
      ms.calc.assocationRuleLearning(gt.transactions, {
        valuesMap: gt.valuesMap,
        summary: false,
      })
        .then(arl => {
          // console.log({ arl });
          expect(arl).to.be.an('array');
          done();
        })
        .catch(done);
      // }
    });
    it('should work with raw transactions', (done) => {
      // if (process.platform === 'darwin') {
      ms.calc.assocationRuleLearning(rawTransactions, {
        summary: false,
      })
        .then(arl => {
          expect(arl).to.be.an('array');
          done();
        })
        .catch(done);
      // }
    });
    it('should handle errors', (done) => {
      ms.calc.assocationRuleLearning(NaN, {
        summary: NaN,
        support: NaN,
        minLength: NaN,
        valuesMap: NaN,
      })
        .then((r) => {
          console.log('r', r)
          done(new Error('should not get to then'))
        })
        .catch(e => {
          expect(e).to.be.a('error');
          done();
        });
    });
  });
});