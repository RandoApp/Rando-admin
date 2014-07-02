var logger = require("../src/log/logger");
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

module.exports = {
    init: function (app) {
        var self = this;
        app.use("/admin", express.static(__dirname + '/front-end'));

        app.get('/admin', function (req, res) {
            res.sendfile("admin/front-end/index.html");
        });
        app.get('/admin/randos', function (req, res) {
            var token = req.query.token;
            //TODO: forAdmin
            randoModel.getAll(function (err, randos) {
                if (err) {
                    err.status(500);
                    err.send(err);
                    return;
                }
                res.send(randos);
            });
        });
        app.get('/admin/user', function (req, res) {
            //TODO: forAdmin
            var token = req.query.token;
            var email = req.query.email;
            userModel.getByEmail(email, function (err, user) {
                if (err) {
                    err.status(500);
                    err.send(err);
                    return;
hj
                }
                res.send(user);
            });
        });
        app.get('/admin/status', function (req, res) {
            //TODO: forAdmin
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
                    userModel.getEmailsAndRandosNumberArray(err, users) {
                        async.reduce({
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
                        });
                    }

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
        app.get('/admin/users', function (req, res) {
            var token = req.query.token;

/*            self.forAdmin(req.token, function (err) {
                if (err) {
                    res.status(403);
                    res.send("Forbidden");
                    return;
                }
                */

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
           // });
        });
    },
    forAdmin: function (token, callback) {
        adminModel.getByToken(token, function (err, admin) {
            if (admin) {
                callback(null, admin);
                return;
            }
            callback(new Error("forAdmin method error: " + err));
        });
    }
};







