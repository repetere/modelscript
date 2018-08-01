import * as ms from '../../index.mjs';
import chai from 'chai';
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const expect = chai.expect;
const testArray = [20, 25, 10, 33, 50, 42, 19, 34, 90, 23,];
const ml = ms.ml;
const DTClassifier = ml.SL.DecisionTreeClassifier;
const RFRegression = ml.Regression.RandomForestRegression;
const dependentFeatures = [['Age',], ['EstimatedSalary',],];
const independentFeatures = [['Purchased',],];
const regressionDependentFeatures = [['R&D Spend',], ['Administration',], ['Marketing Spend',],];
const regressionIndependentFeatures = [['Profit',],];
let SNA_csv;
let Start50_csv;
let Start50DataSet;

describe('cross_validation', function () { 
  this.timeout(10000);
  before((done) => {
    Promise.all([
      ms.loadCSV(path.join(__dirname, '../mock/Social_Network_Ads.csv'), {
        colParser: {
          Age: 'number',
          EstimatedSalary: 'number',
          Purchased: 'number',
        },
      }),
      ms.loadCSV(path.join(__dirname, '../mock/50_Startups.csv'), {
        colParser: {
          'Administration': 'number',
          'R&D Spend': 'number',
          'Marketing Spend': 'number',
          'Profit': 'number',
        },
      }),
    ])
      .then(csvs => {
        const [
          SNA_csv_list,
          S50_csv_list,
        ] = csvs;
        SNA_csv = SNA_csv_list;
        Start50_csv = S50_csv_list;
        Start50DataSet = new ms.DataSet(Start50_csv)
          .fitColumns({
            columns: [
              {
                name: 'State',
                options: {
                  strategy: 'onehot',
                },
              },
            ],
          });
        done();
      })
      .catch(done);
  });
  describe('train_test_split', () => {
    const defaultTrainTestSplit = ms.cross_validation.train_test_split(testArray);
    it('should split dataset with default values', () => {
      expect(ms.cross_validation).to.be.an('object');
      expect(defaultTrainTestSplit.train.length).to.equal(8);
      expect(defaultTrainTestSplit.test.length).to.equal(2);
    });
    it('should split the data into two arrays', () => {
      const defaultTrainTestSplitArray = ms.cross_validation.train_test_split(testArray, { return_array: true, });
      const [train, test, ] = defaultTrainTestSplitArray;
      expect(train.length).to.equal(8);
      expect(test.length).to.equal(2);
    });
    it('should split with defined test size', () => {
      const defaultTrainTestSplitSize = ms.cross_validation.train_test_split(testArray, { test_size: 0.4, });
      const { train, test, } = defaultTrainTestSplitSize;
      expect(train.length).to.equal(6);
      expect(test.length).to.equal(4);
    });
    it('should split with defined train size', () => {
      const defaultTrainTestSplitSize = ms.cross_validation.train_test_split(testArray, { train_size: 0.5, });
      const { train, test, } = defaultTrainTestSplitSize;
      expect(train.length).to.equal(5);
      expect(test.length).to.equal(5);
    });
    it('should use a randomized seed', () => {
      const defaultTrainTestSplitSeed0 = ms.cross_validation.train_test_split(testArray, { random_state: 0, return_array: true, });
      const defaultTrainTestSplitSeed0a = ms.cross_validation.train_test_split(testArray, { random_state: 0, return_array: true, });
      const defaultTrainTestSplitSeed1 = ms.cross_validation.train_test_split(testArray, { random_state: 1, return_array: true, });
      const [train0, ] = defaultTrainTestSplitSeed0;
      const [train0a, ] = defaultTrainTestSplitSeed0a;
      const [train1, ] = defaultTrainTestSplitSeed1;
      expect(train0.toString()).to.equal(train0a.toString());
      expect(train0.toString()).to.not.equal(train1.toString());
    });
  });
  describe('cross_validation_split', () => {
    const defaultCrossValidation = ms.cross_validation.cross_validation_split(testArray);
    it('should split dataset with default values', () => {
      expect(defaultCrossValidation.length).to.equal(3);
    });
    it('should split the data into k-folds', () => {
      const defaultCrossValidationArray = ms.cross_validation.cross_validation_split(testArray, {
        folds: 2,
      });
      expect(defaultCrossValidationArray[0].length).to.equal(5);
      expect(defaultCrossValidationArray.length).to.equal(2);
    });
    it('should use a randomized seed', () => {
      const defaultCrossValidationSeed0 = ms.cross_validation.cross_validation_split(testArray, { random_state: 0, });
      const defaultCrossValidationSeed0a = ms.cross_validation.cross_validation_split(testArray, { random_state: 0, });
      const defaultCrossValidationSeed1 = ms.cross_validation.cross_validation_split(testArray, { random_state: 1, });
      
      expect(JSON.stringify(defaultCrossValidationSeed0)).to.equal(JSON.stringify(defaultCrossValidationSeed0a));
      expect(JSON.stringify(defaultCrossValidationSeed0)).to.not.equal(JSON.stringify(defaultCrossValidationSeed1));
    });
  });
  describe('cross_validate_score', () => {
    it('should validate classification', () => {
      // console.log({ SNA_csv });
      const { train, test, } = ms.cross_validation.train_test_split(SNA_csv, {
        test_size: 0.25,
        random_state: 0,
        parse_int_train_size: true,
      });
      const classifier = new DTClassifier({
        gainFunction: 'gini',
        minNumSamples: 4,
      });
      const accuracy = ms.cross_validation.cross_validate_score({
        dataset: train,
        testingset: test,
        classifier,
        dependentFeatures,
        independentFeatures,
      });
      expect(accuracy).to.have.lengthOf(10);
      expect(ms.util.mean(accuracy)).to.be.greaterThan(0.75);
      expect(ms.util.sd(accuracy)).to.be.lessThan(0.08);
      // console.log('accuracy', accuracy);
      // console.log('acc avg', ms.util.mean(accuracy));
      // console.log('acc sd', ms.util.sd(accuracy));   
    });
    it('should validate classification constructor', () => {
      // console.log({ SNA_csv });
      const { train, test, } = ms.cross_validation.train_test_split(SNA_csv, {
        test_size: 0.25,
        random_state: 0,
        parse_int_train_size: true,
      });
      const classifier = ml.KNN;
      const accuracy = ms.cross_validation.cross_validate_score({
        dataset: train,
        testingset: test,
        classifier,
        modelOptions: { k: 5, },
        use_estimates_y_vector: true,
        dependentFeatures,
        independentFeatures,
      });
      expect(accuracy).to.have.lengthOf(10);
      expect(ms.util.mean(accuracy)).to.be.greaterThan(0.65);
      expect(ms.util.sd(accuracy)).to.be.lessThan(0.08);
      // console.log('accuracy', accuracy);
      // console.log('acc avg', ms.util.mean(accuracy));
      // console.log('acc sd', ms.util.sd(accuracy));   
    });
    it('should validate regression with train method', () => {
      const { train, test, } = ms.cross_validation.train_test_split(Start50DataSet, {
        test_size: 0.25,
        random_state: 0,
        parse_int_train_size: true,
      });
      const regression = new RFRegression({
        seed: 3,
        maxFeatures: 2,
        replacement: false,
        nEstimators: 300,
      });
      const accuracy = ms.cross_validation.cross_validate_score({
        dataset: train,
        testingset: test,
        folds: 2,
        // accuracy:'rSquared',
        use_train_y_vector:true,
        regression,
        dependentFeatures: regressionDependentFeatures,
        independentFeatures: regressionIndependentFeatures,
      });
      // console.log('accuracy', accuracy);
      // console.log('acc avg', ms.util.mean(accuracy));
      expect(accuracy).to.have.lengthOf(2);
      expect(ms.util.mean(accuracy)).to.be.lessThan(40000);
      // expect(ms.util.sd(accuracy)).to.be.lessThan(0.08);
      // console.log('acc sd', ms.util.sd(accuracy));   
    });
    it('should validate regression with constructor methods', () => {
      const { train, test, } = ms.cross_validation.train_test_split(Start50DataSet, {
        test_size: 0.25,
        random_state: 0,
        parse_int_train_size: true,
      });
      const regression = ml.MultivariateLinearRegression;
      const accuracy = ms.cross_validation.cross_validate_score({
        dataset: train,
        testingset: test,
        folds: 2,
        // accuracy:'rSquared',
        use_train_y_vector:false,
        regression,
        dependentFeatures: regressionDependentFeatures,
        independentFeatures: regressionIndependentFeatures,
      });
      // console.log('accuracy', accuracy);
      // console.log('acc avg', ms.util.mean(accuracy));
      expect(accuracy).to.have.lengthOf(2);
      expect(ms.util.mean(accuracy)).to.be.lessThan(9000);
      // expect(ms.util.sd(accuracy)).to.be.lessThan(0.08);
      // console.log('acc sd', ms.util.sd(accuracy));   
    });
  });
  describe('grid_search', () => {
    it('should return sorted best regression parameters', (done) => {
      const { train, test, } = ms.cross_validation.train_test_split(Start50DataSet, {
        test_size: 0.25,
        random_state: 0,
        parse_int_train_size: true,
      }); 
      const optimizedParameters = ms.cross_validation.grid_search({
        regression: ml.Regression.RandomForestRegression,
        parameters: {
          seed: [2,],
          maxFeatures: [2, 3,],
          replacement: [false, true,],
          nEstimators: [300, 500,],
        },
        dataset: train,
        testingset: test,
        folds: 2,
        // accuracy:'rSquared',
        use_train_y_vector:true,
        dependentFeatures: regressionDependentFeatures,
        independentFeatures: regressionIndependentFeatures,
      });
      // console.log(JSON.stringify(optimizedParameters, null, 2));
      expect(optimizedParameters).to.haveOwnProperty('params');
      expect(optimizedParameters).to.haveOwnProperty('results');
      done();
    });
    it('should return sorted best classification parameters', () => {
      const { train, test, } = ms.cross_validation.train_test_split(SNA_csv, {
        test_size: 0.25,
        random_state: 0,
        parse_int_train_size: true,
      });
      const optimizedParameters = ms.cross_validation.grid_search({
        dataset: train,
        testingset: test,
        classifier: ml.SL.RandomForestClassifier,
        return_parameters:true,
        parameters: {
          maxFeatures: [1.0, 0.5, ],
          // replacement: [true, false, ],
          // useSampleBagging: [true, false, ],
          nEstimators: [10, 20, ],
          treeOptions: [
            { minNumSamples: 3, },
            { minNumSamples: 2, },
          ],
        },
        dependentFeatures,
        independentFeatures,
      });
      // console.log(JSON.stringify(optimizedParameters, null, 2));
      expect(optimizedParameters).to.be.an('array');
      expect(optimizedParameters).to.have.lengthOf(8);
    });
    it('should sort parameter performance logically for regression', () => {
      //TODO
    });
    it('should sort parameter performance logically for classification', () => {
      //TODO
    });
  });
});