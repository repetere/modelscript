import { default as MachineLearning, } from 'ml';
import { default as mlf, } from 'ml-random-forest';
const { RandomForestRegression, RandomForestClassifier, } = mlf;
import { default as LogisticRegression, } from 'ml-logistic-regression/lib/logreg';
import { default as mlc, } from 'ml-cart';
const { DecisionTreeRegression, DecisionTreeClassifier, } = mlc;
import { default as mln, } from 'ml-naivebayes';
const { GaussianNB, } = mln;
import { default as MultivariateLinearRegression, } from 'ml-regression-multivariate-linear';
import { default as PCA, } from 'ml-pca';
import { ReinforcedLearningBase, UpperConfidenceBound, ThompsonSampling, } from './ReinforcedLearning';

MachineLearning.Regression = Object.assign({},
  MachineLearning.Regression);
MachineLearning.SL = Object.assign({},
  MachineLearning.SL);
MachineLearning.Stat = Object.assign({},
  MachineLearning.Stat);
MachineLearning.RL = Object.assign({},
  MachineLearning.RL, {
    ReinforcedLearningBase,
    UpperConfidenceBound,
    ThompsonSampling,
  });
MachineLearning.UpperConfidenceBound = UpperConfidenceBound;
MachineLearning.ThompsonSampling = ThompsonSampling;
MachineLearning.Regression.DecisionTreeRegression = DecisionTreeRegression;
MachineLearning.Regression.RandomForestRegression = RandomForestRegression;
MachineLearning.Regression.MultivariateLinearRegression = MultivariateLinearRegression;

MachineLearning.SL.GaussianNB = GaussianNB;
MachineLearning.SL.LogisticRegression = LogisticRegression;
MachineLearning.SL.DecisionTreeClassifier = DecisionTreeClassifier;
MachineLearning.SL.RandomForestClassifier = RandomForestClassifier;

MachineLearning.Stat.PCA = PCA;

/**
 * @namespace
 * @see {@link https://github.com/mljs/ml} 
 */
export const ml = MachineLearning;