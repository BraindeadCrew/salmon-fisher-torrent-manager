/*jslint node: true, nomen: true, white: true */

var login = function () {
        "use strict";
        
        var passport = require('passport'),
            LocalStrategy = require('passport-local').Strategy,
            usersLib = require('./users'),
            security = require('security-lib');

        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(function (user, done) {
            usersLib.getUserByPseudo(user.pseudo, function (err, user) {
                done(err, user);
            });
        });

        passport.use(new LocalStrategy(

        function (pseudo, password, done) {
            process.nextTick(function () {
                usersLib.getUserByPseudo(pseudo, function (err, user) {
                    if (err) {
                        return done(err.error);
                    }
                    if (!user) {
                        return done(null, false, {
                            message: 'Unknow user ' + pseudo
                        });
                    }
                    if (!checkPassword(user, password)) {
                        return done(null, false, {
                            message: 'Invalid password'
                        });
                    }
                    return done(null, user);
                });
            });
        }));

        function ensureAuthenticated(req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }
            res.redirect('/login');
        }
        
        function checkPassword(user, password) {
           return security.checkPasswordHash(user.password, password);
        }
        
        function updateUserPassword(user, oldPassword, newPassword1, newPassword2, callback) {
            if (checkPassword(user, oldPassword) && newPassword1 === newPassword2) { 
                usersLib.updatePassword(user, security.generatePasswordHash(newPassword1, 'sha1', 128), callback);
            } else {
                callback({ message: 'wrong passwords' });
            }
            
        }

        return {
            ensureAuthenticated: ensureAuthenticated,
            updateUserPassword: updateUserPassword
        };
    };

module.exports = login();