'use strict';

var Currency = require('../models/currency');
var bookshelf = require('../lib/db').bookshelf;

var Currencies = bookshelf.Collection.extend({
  model: Currency
});

module.exports = bookshelf.collection('Currencies', Currencies);