/*jslint node: true, nomen: true, white: true */
var torrent_manager = function () {
        "use strict";
        
        var express = require('express'),
            passport = require('passport'),
            stylus = require('stylus'),
            nt = require('nt'),
            fs = require('fs'),
            util = require('util'),
            app = express.createServer(),
            login = require('./lib/login'),
            params = require('./lib/params'),
            ensureAuthenticated = login.ensureAuthenticated,
            files = require('./lib/files');

        function compile(str, path) {
            return stylus(str).set('filename', path).set('compress', true).set('force', true);
        }

        app.configure(function () {
            app.use(express.cookieParser());
            app.use(express.bodyParser());
            app.use(express.methodOverride());
            app.use(express.session({
                secret: params.getParam('session:secret')
            }));
            app.use(passport.initialize());
            app.use(passport.session());
            app.use(app.router);
            app.use(express.static(__dirname + '/public'));
            app.use(stylus.middleware({
                src: __dirname + '/views/stylus',
                dest: __dirname + '/public',
                compile: compile
            }));
        });

        app.dynamicHelpers({
            flash: function (req, res) {
                return req.flash();
            },
            user: function (req, res) {
                return req.user;
            }
        });

        app.get('/', ensureAuthenticated, function (req, res) {
            var finished, downloading;
            finished = files.finished();
            downloading = files.downloading();
            res.render('index.jade', {
                title: 'Index',
                finished: finished,
                downloading: downloading
            });
        });

        app.get('/contact', function (req, res) {
            res.render('contact.jade', {
                title: 'Contact'
            });
        });

        app.get('/about', function (req, res) {
            res.render('about.jade', {
                title: 'About'
            });
        });

        app.post('/', ensureAuthenticated, function (req, res, next) {
            var file = req.files['torrent-file'];

            nt.read(file.path, function (err, torrent) {
                if (err) {
                    req.flash('error', 'Upload failed, %s is not a valid .torrent file.', file.name);
                } else {
                    var src = file.path,
                        dest = __dirname + '/torrents/' + file.name,
                        is = fs.createReadStream(src),
                        os = fs.createWriteStream(dest);
                    util.pump(is, os, function () {
                        fs.unlinkSync(src);
                    });
                    req.flash('success', 'Upload succeded');
                }
                res.redirect('/');
            });
        });

        app.get('/login', function (req, res) {
            res.render('login.jade', {
                title: 'Login',
                username: ''
            });
        });

        app.post('/login', passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true
        }),

        function (req, res) {
            res.redirect('/');
        });

        app.get('/logout', ensureAuthenticated, function (req, res) {
            req.logOut();
            res.redirect('/');
        });

        app.get('/user', ensureAuthenticated, function (req, res) {
            res.render('user.jade', {
                title: 'User management'
            });
        });
        
        app.post('/user', ensureAuthenticated, function (req, res) {
            login.updateUserPassword(req.user, req.body['old-password'], req.body['new-password'],
                req.body['new-password-2'], function (err) {
                if (err !== undefined && err !== null) {
                    req.flash('error', err.message);
                } else {
                    req.flash('success', 'Password updated.');
                }
                    
                res.redirect('/user');
            });
        });

        app.get('/test/main', function (req, res) {
            res.render('main.jade', {
                title: 'Main',
                username: '',
		downloading:
		[
			{
			name : 'qsdqsd',
			url : 'sdfsdfsdfsff',
			percentage : '85',
			ratio : '1',
			size : '452452',
			contains : []
			},
			{
			name : 'qsdq4sd',
			url : 'sdfsdfsdfsff',
			percentage : '46',
			ratio : '1',
			size : '452452',
			contains : []
			},
			{
			name : 'qsdq454sd',
			url : 'sdfsdfsdfsff',
			percentage : '7',
			ratio : '1',
			size : '452452',
			contains : []
			},
			{
			name : 'qs454545dqsd',
			url : 'sdfsdfsdfsff',
			percentage : '74',
			ratio : '1',
			size : '452452',
			contains : []
			},
			{
			name : 'qsd245245qsd',
			url : 'sdfsdfsdfsff',
			percentage : '45',
			ratio : '1',
			size : '452452',
			contains : []
			},
			{
			name : 'qsd785785qsd',
			url : 'sdfsdfsdfsff',
			percentage : '1',
			ratio : '1',
			size : '452452',
			contains : []
			}
		]
            });
        });


        return {
            "listen": function () {
                app.listen(params.getParam('port'));
                console.log('LISTENING: http://localhost:' + params.getParam('port') + '/');
            }
        };
    };

var app = torrent_manager();
app.listen();
