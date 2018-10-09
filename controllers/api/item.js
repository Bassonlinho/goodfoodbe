'use strict';
var database = require('../../lib/db');
var bookshelf = database.bookshelf;
var knex = bookshelf.knex;
var Item = require('../../models/item');
var Items = require('../../collections/items');


module.exports = function (router) {

    router.get('/read', function (req, res) {
        var queryBuilder = knex.select('t1.id', 't1.name', 't1.description', 't1.id_user', 't1.id_currency', 't1.price')
            .from('Item as t1')
            .where('t1.id_user', req.user.id)
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

    router.post('/create', function (req, res) {
        var data = req.body;
        for (var key in data) {
            if (data[key] === '') data[key] = null;
        }
        if (!data.id) {
            Item.forge()
                .save(Object.assign(data, { id_user: req.user.id }))
                .then(function (newItem) {
                    res.status(200).json({
                        data: newItem,
                        success: true,
                        message: "Item kreiran"
                    });
                })
                .catch(function (err) {
                    res.status(500).json({
                        success: false,
                        message: err.message
                    });
                });
        } else {
            Item.forge({ id: data.id })
                .save(data, { patch: true, user: req.user })
                .then(function (data) {
                    res.status(200).json({
                        data: data,
                        success: true,
                        message: "Item izmenjen"
                    });
                })
                .catch(function (err) {
                    res.status(500).json({
                        success: false,
                        message: err.message
                    });
                });
        }
    });

    /**************CURRENCY*****************/
    router.get('/read_currency', function (req, res) {
        var queryBuilder = knex.select('t1.id', 't1.name')
            .from('Currency as t1')
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
    /*******************************************/
};