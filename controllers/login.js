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
    router.post('/socials', function (req, res, next) {
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

        User.forge()
            .fetch(condition)
            .then((user1) => {
                if (!user1) {
                    var cond = {}
                    if (profileFB) {
                        cond = { username: profileFB.email, aktivan: true }
                    } else if (profileG) {
                        cond = { username: profileG.email, aktivan: true }
                    }

                    User.forge()
                        .fetch(cond)
                        .then((user2) => {
                            if (!user2) {
                                res.status(500).json({
                                    success: false,
                                    message: 'No user found'
                                });
                            }
                            User.forge(cond)
                                .save(condition)
                                .then(function (user) {
                                    const token = jwt.sign(user, jwt_secret, { expiresIn: "7d" });
                                    res.status(200).json({
                                        user,
                                        token,
                                        success: true,
                                        message: "User is created."
                                    });
                                })

                        })
                }

            });






        Korisnik.findOne(condition)
            .populate('id_korisnik_grupa')
            .populate('id_valuta')
            .exec(function (err, korisnik) {
                if (err) {
                    sails.log.error("AuthController::loginWithSocials - korisnik findOne err " + JSON.stringify(err));
                    return res.badRequest({
                        message: 'INTERNAL_SERVER_ERROR'
                    });
                }
                if (!korisnik) {
                    var cond = {}
                    if (profileFB) {
                        cond = { username: profileFB.email, aktivan: true }
                    } else if (profileG) {
                        cond = { username: profileG.email, aktivan: true }
                    }
                    Korisnik.findOne(cond)
                        .populate('id_korisnik_grupa')
                        .populate('id_valuta')
                        .exec(function (err, korisnik2) {
                            if (!korisnik2) {
                                return res.badRequest({
                                    message: 'invalid username or password'
                                });
                            }
                            ProfileService
                                .updateKorisnikSocial(korisnik2, profileFB, profileG)
                                .then((data) => {
                                    return getClient(req, res, korisnik2);
                                })
                        });
                } else {
                    return getClient(req, res, korisnik)
                }
            })
    });

};