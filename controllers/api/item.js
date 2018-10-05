'use strict';
var database = require('../../lib/db');
var bookshelf = database.bookshelf;
var knex = bookshelf.knex;
var Item = require('../../models/item');
var Items = require('../../collections/items');


module.exports = function (router) {

    router.get('/read', function (req, res) {
        console.log('sssssssssssssssssss', req.user);
        var queryBuilder = knex.select('t1.id', 't1.name', 't1.description', 't1.id_user', 't1.id_currency')
            .from('Item as t1')
            .whereNot('t1.id_user', req.user.id)
        queryBuilder
            .then(function (result) {
                res.status(200).json(result);
            })
            .catch(function (err) {
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: err.message
                });
            });
    });

};