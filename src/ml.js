import { default as MachineLearning, } from 'ml';
import { RandomForestRegression, RandomForestClassifier, } from 'ml-random-forest';
import { default as LogisticRegression, } from 'ml-logistic-regression';
import { DecisionTreeRegression, DecisionTreeClassifier, } from 'ml-cart';
import { GaussianNB, } from 'ml-naivebayes';

MachineLearning.Regression.DecisionTreeRegression = DecisionTreeRegression;
MachineLearning.Regression.RandomForestRegression = RandomForestRegression;

MachineLearning.SL.GaussianNB = GaussianNB;
MachineLearning.SL.LogisticRegression = LogisticRegression;
MachineLearning.SL.DecisionTreeClassifier = DecisionTreeClassifier;
MachineLearning.SL.RandomForestClassifier = RandomForestClassifier;

/**
 * @namespace
 */
export const ml = MachineLearning;