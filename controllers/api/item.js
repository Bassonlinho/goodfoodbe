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
                        console.log('errrrrrrrr',err);
                        res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    });
            });
    });
};