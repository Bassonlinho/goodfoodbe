'use strict';

var bookshelf = require('../lib/db').bookshelf;

var Currency = bookshelf.Model.extend({
    tableName: 'Currency',
});

module.exports= bookshelf.model('Currency',Currency);