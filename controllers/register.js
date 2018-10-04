'use strict';

const jwt = require('jsonwebtoken');
const passport = require('passport');

var config = require('config');
var jwt_secret = config.get('jwt_secret');
var User = require('../models/user');

module.exports = function (router) {

    router.post('/', function (req, res) {
        var profileFB = req.body.fb_profile;
        var profileG = req.body.gmail_profile;
        var socID = {};
        if (!!profileFB) {
            socID = { fb_id: profileFB.id }
        } else if (!!profileG) {
            socID = { google_id: profileG.id }
        }
        var noviKorisnik = {
            name: req.body.firstName,
            surname: req.body.lastName,
            password: req.body.password,
            username: req.body.username,
            ...socID
        };
        User.forge()
            .save(noviKorisnik)
            .then(function (user) {
                const token = jwt.sign(user.toJSON(), jwt_secret, { expiresIn: "7d" });
                res.status(200).json({
                    user,
                    token,
                    success: true,
                    message: "User is created."
                });
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