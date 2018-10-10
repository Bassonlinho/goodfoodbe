'use strict';

var Item = require('../models/item');
var bookshelf = require('../lib/db').bookshelf;

var Items = bookshelf.Collection.extend({
  model: Item,
  initialize: function () {
    this.on('fetching', function (model, columns, options) {
      if (columns[0] === `${this.tableName}.*` || columns.indexOf('location') >= 0) {
        columns.push(st.asText('location'));
      }
    });
    return bookshelf.Collection.prototype.initialize.apply(this, arguments);
  }
});

module.exports = bookshelf.collection('Items', Items);