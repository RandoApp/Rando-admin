var adminModel = require("./model/adminModel");
var userModel = require("../src/model/userModel");
var randoModel = require("../src/model/randoModel");
var express = require("express");
var fs = require("fs");
var config = require("config");
var os = require("os");
var util = require("util");
var diskspace = require("diskspace");
var async = require("async");
var crypto = require("crypto");
var logger = require("../src/log/logger");

module.exports = {

    init: function (app) {
        var self = this;
        app.use("/admin", express.static(__dirname + '/front-end'));

        app.post('/admin/auth', function (req, res) {
            logger.data("POST /admin/auth start");
            var email = req.body.email;
            var password = req.body.password;
            var passwordHash = self.generateHashForPassword(email, password);
            adminModel.getByEmail(email, function (err, admin) {
                if (err || !admin ||  admin.password != passwordHash) {
                    res.status(403);
                    res.send("Forbidden");
                    return;
                }

                admin.expiration = Date.now() + 8 * 60 * 60 * 1000;
                admin.authToken = crypto.randomBytes(config.app.tokenLength).toString('hex');
                userModel.update(admin);
                res.send({authToken: admin.authToken});
            });
        });
        app.get('/admin', function (req, res) {
            logger.data("GET /admin ");
            self.forAdmin(req.query.token, res, function (err, admin) {
                logger.debug("[admin.admin] Send index.html");
                res.sendfile("admin/front-end/index.html");
            });
        });
        app.get('/admin/randos', function (req, res) {
            self.forAdmin(req.query.token, res, function (err, admin) {
                randoModel.getAll(function (err, randos) {
                    if (err) {
                        err.status(500);
                        err.send(err);
                        return;
                    }
                    res.send(randos);
                });
            });
        });
        app.get('/admin/user', function (req, res) {
            self.forAdmin(req.query.token, res, function (err, admin) {
                userModel.getByEmail(req.query.email, function (err, user) {
                    if (err) {
                        err.status(500);
                        err.send(err);
                        return;
                    }
                    res.send(user);
                });
            });
        });
        app.get('/admin/status', function (req, res) {
            self.forAdmin(req.query.token, res, function (err, admin) {
                async.parallel([
                    function(callback) {
                        var nodeMemory = process.memoryUsage();
                        var status = {
                            ip: [],
                            memory: {
                                total: os.totalmem(),
                                free: os.freemem(),
                                heap: nodeMemory.heapTotal,
                                heapUsed: nodeMemory.heapUsed,
                                swap: nodeMemory.rss
                            },
                            cpu: {
                                loadAvg: os.loadavg(),
                                uptime: os.uptime(),
                                nodeUptime: process.uptime()
                            }
                        };
                        var networkInterfaces = os.networkInterfaces().eth0;
                        if (networkInterfaces) {
                            for (var i = 0; i < networkInterfaces.length; i++) {
                                status.ip.push(networkInterfaces[i].address);
                            }
                        }
                        callback(null, status);
                    },
                    function (callback) {
                        diskspace.check('/', function (total, free, status) {
                            var diskStatus = {
                                disk: {
                                    free: free,
                                    total: total
                                }
                            };
                            callback(null, diskStatus);
                        });
                    },
                    function () {
                        //Get status from db
     //                   userModel.getEmailsAndRandosNumberArray(err, users) {
             //               async.reduce({
                                //total users
                                //total randos
                                //anonymous users
                                //users with 0 randos
                                //users with 0-5 randos
                                //users with 5-10 randos
                                //users with 10-30 randos
                                //users with 30-100 randos
                                //users with > 100 randos

                                //users by last usage

                                //reported/deleted randos
                                //banned users
                                //randos

                                //time between each rando
             //               });
    //                    });

                    }
                ],
                function(err, statuses) {
                    if (err) {
                        err.status(500);
                        err.send(err);
                        return;
                    }
                    var status = {};
                    for (var i = 0; i < statuses.length; i++) {
                        for (var attr in statuses[i]) {
                            status[attr] = statuses[i][attr];
                        }
                    }
                    res.send(status);
                });
            });
        });
        app.get('/admin/users', function (req, res) {
            self.forAdmin(req.query.token, res, function (err, admin) {
                var page = req.query.page;
                var count = req.query.count;

                userModel.getEmailsAndRandosNumberArray(function (err, emails) {
                    if (err) {
                        err.status(500);
                        err.send(err);
                        return;
                    }
                    var usersPage = {
                        data: emails.slice((page - 1) * count, page * count),
                        total: emails.length
                    };

                    res.send(usersPage);
                });
            });
        });
    },
    forAdmin: function (token, res, callback) {
        if (!token) {
            logger.data("[admin.forAdmin] token not exist. Send auth.html");
            res.status(401);
            res.sendfile("admin/front-end/auth.html");
            return;
        }

        adminModel.getByToken(token, function (err, admin) {
            if (!admin || admin.expiration < Date.now() || token != admin.authToken) {
                logger.debug("Send auth.html");
                res.status(401);
                res.sendfile("admin/front-end/auth.html");
                return;
            }
 
            if (admin) {
                callback(null, admin);
                return;
            }
        });
    },
    generateHashForPassword: function (email, password) {
	var sha1sum = crypto.createHash("sha1");
	sha1sum.update(password + email + config.app.secret);
	return sha1sum.digest("hex");
    },
    createAdmin: function (email, password, callback) {
        var self = this;
        adminModel.create({
            email: email,
            password: self.generateHashForPassword(email, password),
            authToken: crypto.randomBytes(config.app.tokenLength).toString('hex'), 
            expiration: Date.now() + 8 * 60 * 60 * 1000
        }, callback);
    }
};

