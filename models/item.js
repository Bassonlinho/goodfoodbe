'use strict';

var bookshelf = require('../lib/db').bookshelf;

require('./user');
require('./currency');

var Item = bookshelf.Model.extend({
    tableName: 'Item',

    save: function (params, options) {
        if (params.location) {
            params.location = "SRID=4326;" + params.location;
        }
        return bookshelf.Model.prototype.save.apply(this, arguments);
    },

    user: function () {
        return this.belongsTo('User', 'id_user');
    },
    currency: function () {
        return this.belongsTo('Currency', 'id_currency');
    }
});


module.exports = bookshelf.model('Item', Item);