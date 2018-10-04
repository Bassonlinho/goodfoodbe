'use strict';

const jwt = require('jsonwebtoken');
const passport = require('passport');

var config = require('config');
var jwt_secret = config.get('jwt_secret');
var User = require('../models/user');

module.exports = function (router) {

    router.post('/', function (req, res, next) {
        // console.log('loginnnn', req.body);

        passport.authenticate('local', { session: false }, (err, user, info) => {
            console.log('err', err);
            if (err || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }
                // generate a signed son web token with the contents of user object and return it in the response
                const token = jwt.sign(user, jwt_secret, { expiresIn: "7d" });
                console.log('-------- Dobio token!!!! --------', token);
                return res.json({ user, token });
            });
        })(req, res, next);
    });
    // router.post('/qq', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    //     console.log('qqqqqqqqqqqqqq', req.user);

    //     res.status(200).json('caoo');
    // });
    router.post('/socials', function (req, res) {
        // console.log('loginnnn', req.body);
        var profileFB = req.body.fb_profile;
        var profileG = req.body.gmail_profile;

        if (!profileFB && !profileG) {
            res.status(500).json({
                success: false,
                message: 'profile required'
            });
        }
        var condition = {}
        if (profileFB) {
            condition = { fb_id: profileFB.id }
        } else if (profileG) {
            condition = { google_id: profileG.id }
        }
        User.forge(condition)
            .fetch()
            .then((user1) => {
                if (!user1 || user1 === null) {
                    var cond = {}
                    if (profileFB) {
                        cond = { username: profileFB.email }
                    } else if (profileG) {
                        cond = { username: profileG.email }
                    }

                    User.forge(cond)
                        .fetch()
                        .then((user2) => {
                            if (!user2 || user2 === null) {
                                res.status(500).json({
                                    success: false,
                                    message: 'No user found'
                                });
                            } else {
                                user2.save(condition)
                                    .then(function (user) {
                                        const token = jwt.sign(user.toJSON(), jwt_secret, { expiresIn: "7d" });
                                        res.status(200).json({
                                            user: user.toJSON(),
                                            token,
                                            success: true,
                                            message: "User is created."
                                        });
                                    })
                                    .catch((err) => {
                                        res.status(500).json({
                                            success: false,
                                            message: err
                                        });
                                    })
                            }
                        })
                } else {
                    const token = jwt.sign(user1.toJSON(), jwt_secret, { expiresIn: "7d" });
                    res.status(200).json({
                        user: user1.toJSON(),
                        token,
                        success: true,
                        message: "User is created."
                    });
                }
            });
    });

};