'use strict';
var database = require('../../lib/db');
var bookshelf = database.bookshelf;
var knex = bookshelf.knex;
var Item = require('../../models/item');
var Items = require('../../collections/items');

var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var BluemixCOS = require('../../lib/BluemixCOS');

module.exports = function (router) {

    router.get('/read', function (req, res) {
        var responseData = {};
        var condition = ' id_user = ' + req.user.id;
        Items.forge()
            .fetch({ condition })
            .then(function (result) {
                return Promise.all(result.toJSON().map((record) => {
                    if (record.picture) {
                        return BluemixCOS.doGetSignedURL(record.picture)
                            .then(function (doc) {
                                record.signedURL = doc;
                                return record;
                            });
                    } else {
                        return record;
                    }
                }))
            })
            .then((data) => {
                console.log('rrrrrrrrrrrrrrrrr', data);
                responseData.data = data;
                responseData.message = 'Item su uspešno učitani';
                responseData.success = true;
                res.status(200).json(responseData);
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

        // const query = 'SELECT u.name,u.surname,u.username,t1.id, t1.name, t1.description, t1.id_user, t1.id_currency, t1.price, st_astext(t1.location) as location ' +
        //     'from "Item" as t1 ' +
        //     'LEFT JOIN "User" u ' +
        //     'ON t1.id_user = u.id ' +
        //     ' WHERE t1.id = ' + id

        // knex.raw(query)
        var condition = { id: id }
        Item.forge(condition)
            .fetch()
            .then(function (result) {
                let res = result.toJSON()
                if (res.picture) {
                    return BluemixCOS.doGetSignedURL(res.picture)
                        .then(function (doc) {
                            res.signedURL = doc;
                            return res;
                        });
                } else {
                    return res;
                }
            })
            .then((data) => {
                res.status(200).json(data);
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
        delete data.documents;
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

    router.post('/upload_picture', upload.single('document'), function (req, res, next) {
        let filename, extension, bluemixObjectStorageFilename;
        const parts = req.file.originalname.split('.');
        var itemId = typeof req.body.itemId === 'object' ? req.body.itemId[0] : req.body.itemId;
        console.log('wwwwwww ', req.file, req.body, itemId);
        filename = parts[0];
        if (parts.length > 1) {
            extension = parts[1];
        }
        bluemixObjectStorageFilename = [filename, req.user.username, (new Date()).toISOString()].join('_');
        bluemixObjectStorageFilename += '.' + extension;

        knex.select('picture', 'id')
            .from('Item')
            .where('id', '=', itemId)
            .then(function (result) {
                BluemixCOS.doCreateObject({
                    localBuffer: req.file.buffer,
                    name: bluemixObjectStorageFilename
                })
                    .then(function (bluemixObjectStorageFile) {
                        return Item.forge({ id: itemId })
                            .save({
                                picture: bluemixObjectStorageFilename,
                            }, { patch: true });
                    })
                    .then((data) => {
                        if (result[0].picture) {
                            BluemixCOS.doDeleteObject(result[0].picture);
                        }
                        res.status(200).json({
                            success: true,
                            message: "Slika je uspešno uploadovana."
                        });
                    })
                    .catch((err) => {
                        console.log('errrrrrrrr', err);
                        res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    });
            });
    });
};