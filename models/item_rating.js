'use strict';

var bookshelf = require('../lib/db').bookshelf;

require('./item');
require('./user');

var ItemRating = bookshelf.Model.extend({
    tableName: 'Item_rating',

    user: function(){
        return this.belongsTo('User','id_user');
    },
    item: function(){
        return this.belongsTo('Item','id_item');
    }
});


module.exports= bookshelf.model('ItemRating',ItemRating);