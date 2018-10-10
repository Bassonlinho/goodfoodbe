'use strict';
var database = require('../../lib/db');
var bookshelf = database.bookshelf;
var knex = bookshelf.knex;
var Item = require('../../models/item');
var Items = require('../../collections/items');


module.exports = function (router) {

    router.get('/read', function (req, res) {
        const query = 'SELECT u.name,t1.id, t1.name, t1.description, t1.id_user, t1.id_currency, t1.price, st_astext(t1.location) as location from "Item" as t1 LEFT JOIN "User" u ON t1.id_user = u.id WHERE t1.id_user=' + req.user.id
        knex.raw(query)
            .then(function (result) {
                res.status(200).json(result.rows);
            })
            .catch(function (err) {
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: err.message
                });
            });
    });

    router.get('/getById', function (req, res) {
        const id = req.query.id;

        const query = 'SELECT u.name,u.surname,u.username,t1.id, t1.name, t1.description, t1.id_user, t1.id_currency, t1.price, st_astext(t1.location) as location ' +
            'from "Item" as t1 ' +
            'LEFT JOIN "User" u ' +
            'ON t1.id_user = u.id ' +
            ' WHERE t1.id = ' + id

        knex.raw(query)
            .then(function (result) {
                res.status(200).json(result.rows[0]);
                console.log('aaaaaaaaaaaaaaaaaaaaaaaa', result.rows);
            })
            .catch(function (err) {
                console.log(JSON.stringify(err));
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