'use strict';

var db = require('../lib/db');
var bookshelf = db.bookshelf;

var encryptionDifficulty = db.encryptionDifficulty;

var bcrypt = require('bcryptjs');

var User = bookshelf.Model.extend({

    tableName: 'User',

    save: function (params, options) {
        if (typeof params.password !== 'undefined') {
            params.password = bcrypt.hashSync(params.password, bcrypt.genSaltSync(encryptionDifficulty));
        }
        return bookshelf.Model.prototype.save.apply(this, arguments);
    },
    verifyPassword: function (plainTextPassword) {
        var user = bcrypt.compareSync(plainTextPassword, this.get('password'));
        return user;
        // console.log('wwwwww', korisnik);
    }

});

module.exports = bookshelf.model('User', User);
