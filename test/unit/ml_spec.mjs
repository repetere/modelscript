import * as ms from '../../index.mjs';
import chai from 'chai';
import path from 'path';
import expose from './expose.js';
const { __dirname, } = expose;
const expect = chai.expect;
let SNA_csv;
const {
  ReinforcedLearningBase,
  UpperConfidenceBound,
  ThompsonSampling,
} = ms.ml.RL;

describe('ml', function () { 
  this.timeout(20000);
  before((done) => {
    Promise.all([
      ms.loadCSV(path.join(__dirname, '../mock/Ads_CTR_Optimisation.csv'), {
        colParser: 'Ad 1,Ad 2,Ad 3,Ad 4,Ad 5,Ad 6,Ad 7,Ad 8,Ad 9,Ad 10'
          .split(',')
          .reduce((result, value) => {
            result[ value ] = 'number';
            return result;  
          }, {}),
      }),
    ])
      .then(csvs => {
        const [
          SNA_csv_list,
        ] = csvs;
        SNA_csv = SNA_csv_list;
        done();
      })
      .catch(done);
  });
  describe('ReinforcedLearningBase', () => {
    it('should create an instance with default values', () => {
      const baseRL = new ReinforcedLearningBase();
      expect(baseRL.bounds).to.eql(5);
      expect(baseRL.last_selected).to.be.an('array');
      expect(baseRL.total_reward).to.eql(0);
      expect(baseRL.iteration).to.eql(0);
    });
    it('should create configurable instance', () => {
      const baseRL = new ReinforcedLearningBase({ bounds:10, });
      expect(baseRL.bounds).to.eql(10);
    });
    it('should require implementations of learn, train and predict methods', () => {
      const baseRL = new ReinforcedLearningBase();
      try {
        baseRL.learn();
      } catch (e) {
        expect(e.message).to.eql('Missing learn method implementation');
      }
      try {
        baseRL.train();
      } catch (e) {
        expect(e.message).to.eql('Missing train method implementation');
      }
      try {
        baseRL.predict();
      } catch (e) {
        expect(e.message).to.eql('Missing predict method implementation');
      }
    });
  });
  describe('UpperConfidenceBound', () => {
    const UCB = new UpperConfidenceBound({
      bounds: 10,
    });
    it('should create number of selections and sum of selections', () => {
      expect(UCB.numbers_of_selections.size).to.equal(10);
      expect(UCB.numbers_of_selections).to.be.a('map');
      expect(UCB.sums_of_rewards.size).to.equal(10);
      expect(UCB.sums_of_rewards).to.be.a('map');
      for (let value of UCB.numbers_of_selections.values()) {
        expect(value).to.eql(0);
      }
      for (let value of UCB.sums_of_rewards.values()) {
        expect(value).to.eql(0);
      }
    });
    it('should predict the next value using the upper confidence bound', () => {
      const UCBPred = new UpperConfidenceBound({
        bounds: 10,
      });
      UCBPred.train({
        ucbRow: SNA_csv, //csvData[ x ],
        getBound: ad => `Ad ${ad + 1}`,
      });
      const prediction = UCBPred.predict();
      expect(prediction).to.eql(4);
      expect(prediction).to.be.a('number');
    });
    it('should initially select each bandit', () => {
      const UCBPredNew = new UpperConfidenceBound({
        bounds: 10,
      });
      for (let i = 0; i < 10; i++){
        expect(UCBPredNew.predict()).to.eql(i);
        UCBPredNew.train({
          ucbRow: SNA_csv.concat([]).slice(i, i+1), //csvData[ x ],
          getBound: ad => `Ad ${ad + 1}`,
        });
        expect(UCBPredNew.iteration).to.eql(i + 1);
      }
    });
    it('should train the next upper confidence bound', () => {
      const UCBTrain = new UpperConfidenceBound({
        bounds: 10,
      });
      const getBound= ad => `Ad ${ad + 1}`;
      UCBTrain.train({
        ucbRow: SNA_csv.slice(0, 9998), //csvData[ x ],
        getBound,
      });
      expect(UCBTrain.iteration).to.eql(9998);
      expect(UCBTrain.predict()).to.eql(4);
      expect(UCBTrain.last_selected).to.be.lengthOf(9998);

      const trainedUCB = UCBTrain.train({
        ucbRow: SNA_csv[ 9998 ],
        getBound,
      });
      expect(UCBTrain.iteration).to.eql(9999);
      expect(trainedUCB).to.be.an.instanceOf(UpperConfidenceBound);

      const learnedUCB = UCBTrain.learn({
        ucbRow: SNA_csv[ 9999 ],
        getBound,
      });
      expect(UCBTrain.iteration).to.eql(10000);
      expect(learnedUCB).to.be.an.instanceOf(UpperConfidenceBound);
    });
  });
  describe('ThompsonSampling', () => {
    const TS = new ThompsonSampling({
      bounds: 10,
    });
    it('should create the number of rewards', () => {
      expect(TS.numbers_of_rewards_1.size).to.equal(10);
      expect(TS.numbers_of_rewards_1).to.be.a('map');
      expect(TS.numbers_of_rewards_0.size).to.equal(10);
      expect(TS.numbers_of_rewards_0).to.be.a('map');
      for (let value of TS.numbers_of_rewards_1.values()) {
        expect(value).to.eql(0);
      }
      for (let value of TS.numbers_of_rewards_0.values()) {
        expect(value).to.eql(0);
      }
    });
    it('should predict the next value using thompson sampling', () => {
      const TSPred = new ThompsonSampling({
        bounds: 10,
      });
      TSPred.train({
        tsRow: SNA_csv, //csvData[ x ],
        getBound: ad => `Ad ${ad + 1}`,
      });
      const prediction = TSPred.predict();
      expect(prediction).to.eql(4);
      expect(prediction).to.be.a('number');
    });
    it('should evaluate the next thompson sampling sample', () => {
      const getBound= ad => `Ad ${ad + 1}`;
      const TSTrain = new ThompsonSampling({
        bounds: 10,
        getBound,
      });
      TSTrain.train({
        tsRow: SNA_csv.slice(0, 9998), //csvData[ x ],
      });
      expect(TSTrain.iteration).to.eql(9998);
      expect(TSTrain.predict()).to.eql(4);
      expect(TSTrain.last_selected).to.be.lengthOf(9998);

      const trainedTS = TSTrain.train({
        tsRow: SNA_csv[ 9998 ],
      });
      expect(TSTrain.iteration).to.eql(9999);
      expect(trainedTS).to.be.an.instanceOf(ThompsonSampling);

      const learnedTS = TSTrain.learn({
        tsRow: SNA_csv[ 9999 ],
        getBound,
      });
      expect(TSTrain.iteration).to.eql(10000);
      expect(learnedTS).to.be.an.instanceOf(ThompsonSampling);
    });
  });
});