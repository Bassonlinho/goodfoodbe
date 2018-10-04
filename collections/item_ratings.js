'use strict';

var ItemRating = require('../models/item_rating');
var bookshelf = require('../lib/db').bookshelf;

var ItemRatings = bookshelf.Collection.extend({
  model: ItemRating
});

module.exports = bookshelf.collection('ItemRatings', ItemRatings);