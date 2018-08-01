import * as csvUtils from './src/csv';
import { util as utils, } from './src/util';
import { calc as calcs, } from './src/calc.mjs';
import { PD as probabilty, } from './src/pd';
import { ml as mls, } from './src/ml';
import { nlp as nlps, } from './src/nlp';
import { DataSet, } from './src/DataSet';
import { cross_validation as cross_validations, } from './src/cross_validation';

export const loadCSV = csvUtils.loadCSV;
export const loadCSVURI = csvUtils.loadCSVURI;

/**
 * @namespace
 */
export const preprocessing = {
  DataSet,
};
export { DataSet, } from './src/DataSet';
export const util = utils;
export const cross_validation = cross_validations;
export const model_selection = cross_validations;
export const calc = calcs;
export const ml = mls;
export const nlp = nlps;
export const csv = csvUtils;
export const PD = probabilty;