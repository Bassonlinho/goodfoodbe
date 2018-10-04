'use strict';

var bookshelf = require('../lib/db').bookshelf;

require('./user');
require('./currency');

var Item = bookshelf.Model.extend({
    tableName: 'Item',

    user: function(){
        return this.belongsTo('User','id_user');
    },
    currency: function(){
        return this.belongsTo('Currency','id_currency');
    }
});


module.exports= bookshelf.model('Item',Item);