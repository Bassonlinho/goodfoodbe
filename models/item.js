'use strict';

var bookshelf = require('../lib/db').bookshelf;
const st = require('knex-postgis')(bookshelf.knex);

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
    },

    initialize: function() {
        this.on('fetching', function(model, columns, options) {
          if(columns[0] === `${this.tableName}.*` || columns.indexOf('location') >= 0) {
            columns.push(st.asText('location'));
          }
        });
        return bookshelf.Model.prototype.initialize.apply(this, arguments);
      }
});


module.exports = bookshelf.model('Item', Item);