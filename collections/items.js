'use strict';

var Item = require('../models/item');
var bookshelf = require('../lib/db').bookshelf;

var Items = bookshelf.Collection.extend({
  model: Item
});

module.exports = bookshelf.collection('Items', Items);