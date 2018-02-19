import { get as request, } from 'http';
import { get as requestHTTPS, } from 'https';
import { default as validURL, } from 'valid-url';
import { default as csv, } from 'csvtojson';
/**
 * Asynchronously loads a CSV from a remote URL and returns an array of objects
 * @example
 * // returns [{header:value,header2:value2}]
 * loadCSVURI('https://raw.githubusercontent.com/repetere/modelscript/master/test/mock/data.csv').then(csvData).catch(console.error)
 * @memberOf csv
 * @param {string} filepath - URL to CSV path
 * @param {Object} [options] - options passed to csvtojson
 * @returns {Object[]} returns an array of objects from a csv where each column header is the property name  
 */
export function loadCSVURI(filepath, options) {
  const reqMethod = (filepath.search('https', 'gi') > -1) ? requestHTTPS : request;
  return new Promise((resolve, reject) => {
    const csvData = [];
    const req = reqMethod(filepath, res => {
      csv(options).fromStream(res)
        .on('json', jsonObj => {
          csvData.push(jsonObj);
        })
        .on('error', err => {
          return reject(err);
        })
        .on('done', error => {
          if (error) {
            return reject(error);
          } else {
            return resolve(csvData);
          }
        });
    });
    req.on('error', reject);
  });
}


/**
 * Asynchronously loads a CSV from either a filepath or remote URL and returns an array of objects
 * @example
 * // returns [{header:value,header2:value2}]
 * loadCSV('../mock/invalid-file.csv').then(csvData).catch(console.error)
 * @memberOf csv
 * @param {string} filepath - URL to CSV path
 * @param {Object} [options] - options passed to csvtojson
 * @returns {Object[]} returns an array of objects from a csv where each column header is the property name  
 */
export function loadCSV(filepath, options) {
  if (validURL.isUri(filepath)) {
    return loadCSVURI(filepath, options);
  } else {
    return new Promise((resolve, reject) => {
      const csvData = [];
      csv(options).fromFile(filepath)
        .on('json', jsonObj => {
          csvData.push(jsonObj);
        })
        .on('error', err => {
          return reject(err);
        })
        .on('done', error => {
          if (error) {
            return reject(error);
          } else {
            return resolve(csvData);
          }
        });
    });
  }
}
