// import {* as jsk} from '../../src/main';
// import { expect } from 'chai';
'use strict';
const jsk = require('../../dist/jskit-learn.cjs');
const expect = require('chai').expect;

describe('main.mjs', function () { 
  it('should handle stuff', () => {
    console.log('ok');
  })
})

// 'use strict';

// const path = require('path');
// const fs = require('fs-extra');
// // const flatten = require('flat');
// // const chai = require('chai');
// const expect = require('chai').expect;
// const Config = require('../../lib');

// describe('Config.js', function() {
//   this.timeout(10000);
//   describe('should take db configs from command line arguments', function () {
//     it('should handle errors', done => {
//       Config({ any: 'prop' })
//         .then(result => {
//           done(result);
//         })
//         .catch(err => {
//           expect(err).to.be.an('error');
//           done();
//         });
//     });
//     it('should return the settings for application config db', (done) => {
//       const command_line_args =['/Users/sample_user/.nvm/versions/node/v0.0.0/bin/node',
//         '/Users/sample_user/sample_app/index.js',
//         '--e',
//         'development',
//         '--db_config.settings.name=Test App',
//         '--db_config.configuration.type=db',
//         '--db_config.configuration.db=lowkie',
//         '--db_config.configuration.options.dbpath=content/config/settings/config_db.json',
//       ];
//       Config({ argv: command_line_args, })
//         .then(dbsettings => {
//           expect(dbsettings.configuration.db).to.eql('lowkie');
//           expect(dbsettings.settings.name).to.eql('Test App');
//           done();
//         })
//         .catch(done);
//     });
//     it('should return the default settings of command line arguments does not exist', (done) => {
//       Config()
//         .then(dbsettings => {
//           expect(dbsettings.configuration.db).to.eql('mongoose');
//           expect(dbsettings.settings.name).to.eql('Sample App');
//           done();
//         })
//         .catch(done);
//     });
//   });


//   describe('should use env file if command line argument was not passed in', function() {
//     before(function(done) {
//       fs.outputFile(path.join(__dirname, '.env'), 'DB_CONFIG={"settings": {"name": "Test App"}, "configuration":{"type": "db", "db":"sequelize", "options":{"database":"configdb"}}}', done);
//     });

//     it('should return db configs from .env file', (done) => {
//       let cli_config = [
//         '/Users/sample_user/.nvm/versions/node/v0.0.0/bin/node',
//         '/Users/sample_user/sample_app/index.js',
//         '--e',
//         'development',
//         `--envOptions.path=${path.join(__dirname, '.env')}`,
//       ];
//       Config({ argv:cli_config, })
//         .then(dbsettings => {
//           expect(dbsettings.configuration.db).to.eql('sequelize');
//           expect(dbsettings.settings.name).to.eql('Test App');
//           done();
//         })
//         .catch(done);
//     });

//     after(function(done){
//       fs.unlink(path.join(__dirname, '.env'), done);
//     });
//   });
// });