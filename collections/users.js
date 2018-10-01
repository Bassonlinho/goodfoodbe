'use strict';

var User = require('../models/user');
var bookshelf = require('../lib/db').bookshelf;

var Users = bookshelf.Collection.extend({
  model: User
});

module.exports = bookshelf.collection('Users', Users);