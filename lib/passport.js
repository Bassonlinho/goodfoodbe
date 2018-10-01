'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

var database = require('./db');
var bookshelf = database.bookshelf;
var knex = bookshelf.knex;

var config = require('config');
var jwt_secret = config.get('jwt_secret');

var User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
    function (username, password, cb) {
        return User.forge({ username: username })
            .fetch({ require: true })
            .then(user => {
                let USER = user.toJSON();
                // console.log('USER ', USER);
                if (user.verifyPassword(password)) {
                    return cb(null, USER, { message: 'Logged In Successfully' });
                } else {
                    return cb('Wrong password!', false, { message: 'Wrong password!' });
                }

            })
            .catch(err => cb(err));
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwt_secret
},
    function (jwtPayload, cb) {
        return cb(null, jwtPayload);
    }
));