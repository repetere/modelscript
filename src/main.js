

import * as csvUtils from './csv';
import { util as utils, } from './util';
import { calc as calcs, } from './calc';
import { DataSet, } from './DataSet';
import { train_test_split, cross_validation_split, } from './cross_validation';

export const loadCSV = csvUtils.loadCSV;
export const loadCSVURI = csvUtils.loadCSVURI;

/**
 * @namespace
 */
export const preprocessing = {
  DataSet,
};
export { DataSet, } from './DataSet';
/**
 * @namespace
 */
export const util = utils;
/**
 * @namespace
 * @see {@link https://machinelearningmastery.com/implement-resampling-methods-scratch-python/}
 */
export const cross_validation = {
  train_test_split,
  cross_validation_split,
};
/**
 * @namespace
 */
export const calc = calcs;