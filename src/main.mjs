import * as csvUtils from './csv';
import { util as utils, } from './util';
import { calc as calcs, } from './calc';
import { PD as probabilty, } from './pd';
import { ml as mls, } from './ml';
import { nlp as nlps, } from './nlp';
import { DataSet, } from './DataSet';
import { cross_validation as cross_validations, } from './cross_validation';

export const loadCSV = csvUtils.loadCSV;
export const loadCSVURI = csvUtils.loadCSVURI;

/**
 * @namespace
 */
export const preprocessing = {
  DataSet,
};
export { DataSet, } from './DataSet';
export const util = utils;
export const cross_validation = cross_validations;
export const model_selection = cross_validations;
export const calc = calcs;
export const ml = mls;
export const nlp = nlps;
export const csv = csvUtils;
export const PD = probabilty;