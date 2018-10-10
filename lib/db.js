var config = require('config');
var dbConfig = config.get('dbConfig');
var encryptDiffConfig = config.get('bcryptjs');

//----------------- TREBA SREDITI CITAV FILE (sranja iz starog weba)-----------------------------------------

var config = {};

config.bookshelf = null;

config.encriptionDifficulty = 8;

config.init = function init() {
    var mProto, cProto;
    if (config.bookshelf == null) {
        var knex = require('knex')(dbConfig);
        config.bookshelf = require('bookshelf')(knex);
        config.bookshelf.plugin('registry');
        config.encriptionDifficulty = encryptDiffConfig.difficulty;
    }

    mProto = config.bookshelf.Model.prototype;
    cProto = config.bookshelf.Collection.prototype;
    config.bookshelf.Collection = config.bookshelf.Collection.extend({

        fetch: function (collection, columns, opts) {
            this.query(function (qb) {
                if (opts && opts.uslov) {
                    opts.uslov = '(' + opts.uslov + ')';
                    qb.whereRaw(opts.uslov);
                }
                if (opts && !!opts.limit && !!opts.start) {
                    qb.limit(opts.limit).offset(opts.start);
                }
            });
            return cProto.fetch.apply(this, arguments);
        }
    });
    config.bookshelf.plugin('registry');


}();

module.exports = config;
