var logger = require("../src/log/logger");
var adminModel = require("./model/adminModel");
var userModel = require("../src/model/userModel");
var express = require("express");
var fs = require("fs");
var config = require("config");

module.exports = {
    init: function (app) {
        var self = this;
        app.use("/admin", express.static(__dirname + '/front-end'));

        app.get('/admin', function (req, res) {
            res.sendfile("admin/front-end/index.html");
        });

        app.get('/fetch/:token', function (req, res) {
            self.forAdmin(req.token, function (err) {
                if (err) {
                    err.status(500);
                    err.send(err);
                    return;
                }

                userModel.getByEmail(req.query.email, function (err, user) {
                    if (err) {
                        res.status(500);
                        res.send(err);
                        return;
                    }
                    res.send(user);
                });
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







