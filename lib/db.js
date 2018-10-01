var config = require('config');
var dbConfig = config.get('dbConfig');
var encryptDiffConfig = config.get('bcryptjs');

//----------------- TREBA SREDITI CITAV FILE (sranja iz starog weba)-----------------------------------------

var config = {};

config.bookshelf = null;

config.encriptionDifficulty = 8;

config.init = function init() {

    if (config.bookshelf == null) {
        var knex = require('knex')(dbConfig);
        config.bookshelf = require('bookshelf')(knex);
        config.bookshelf.plugin('registry');
        config.encriptionDifficulty = encryptDiffConfig.difficulty;
    }
  
}();

module.exports = config;
