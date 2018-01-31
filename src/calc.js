import { FPGrowth, } from 'node-fpgrowth';

/**
 * Formats an array of transactions into a sparse matrix like format for Apriori/Eclat
 * @memberOf calc
 * @see {@link https://github.com/alexisfacques/Node-FPGrowth}
 * @param {Array} data - CSV data of transactions 
 * @param {Object} options 
 * @param {Boolean} [options.exludeEmptyTranscations=true] - exclude empty rows of transactions 
 * @returns {Object} {values - unique list of all values, valuesMap - map of values and labels, transactions - formatted sparse array}
 */
export function getTransactions(data, options) {
  const config = Object.assign({}, {
    exludeEmptyTranscations: true,
  }, options);
  const values = new Set();
  const valuesMap = new Map();
  const transactions = data
    .map(csvRow => {
      [
        ...Object.values(csvRow),
      ].forEach(csvVal => {
        values.add(csvVal);
      });
      values.forEach(val => {
        if (!valuesMap.get(val)) {
          const index = (valuesMap.size < 0)
            ? 0
            : parseInt(valuesMap.size / 2, 10);
          valuesMap.set(val, index.toString());
          valuesMap.set(index.toString(), val);
        }
      });
      return Object.values(csvRow)
        .map(csvCell =>
          valuesMap.get(csvCell))
        .filter(val => val !== undefined);
    });
  return {
    values,
    valuesMap,
    transactions: (config.exludeEmptyTranscations)
      ? transactions.filter(csvRow => csvRow.length)
      : transactions,
  };
}

/**
 * returns association rule learning results
 * @memberOf calc
 * @see {@link https://github.com/alexisfacques/Node-FPGrowth}
 * @param {Array} transactions - sparse matrix of transactions 
 * @param {Object} options 
 * @param {Number} [options.support=0.4] - support level
 * @param {Number} [options.minLength=2] - minimum assocation array size
 * @param {Boolean} [options.summary=true] - return summarized results
 * @param {Map} [options.valuesMap=new Map()] - map of values and labels (used for summary results)
 * @returns {Object} Returns the result from Node-FPGrowth or a summary of support and strong associations
 */
export function assocationRuleLearning(transactions =[], options) {
  return new Promise((resolve, reject) => {
    try {
      const config = Object.assign({}, {
        support: 0.4,
        minLength: 2,
        summary: true,
        valuesMap: new Map(),
      }, options);
      const fpgrowth = new FPGrowth(config.support);
      fpgrowth.exec(transactions)
        .then(results => {
          if (config.summary) {
            resolve(results.itemsets
              .map(itemset => ({
                items_labels: itemset.items.map(item => config.valuesMap.get(item)),
                items: itemset.items,
                support: itemset.support,
                support_percent: itemset.support / transactions.length,
              }))
              .filter(itemset => itemset.items.length > 1)
              .sort((a, b) => b.support - a.support));
          } else {
            resolve(results);
          }
        })
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * @namespace
 */
export const calc = {
  getTransactions,
  assocationRuleLearning,
};