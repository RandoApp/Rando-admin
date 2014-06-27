var logger = require("../src/log/logger");
var adminModel = require("./model/adminModel");
var userModel = require("../src/model/userModel");

module.exports = {
    init: function (app) {
        var self = this;
        app.get('/admin', function (req, res) {
            res.send('<!DOCTYPE html> <html> <head> <meta http-equiv="content-type" content="text/html; charset=utf-8" /> <title>Rando-admin</title> </head> <body>admin</body> </html>');
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
                        err.status(500);
                        err.send(err);
                        return;
                    }
                    res.send(user);
                });
            });
        });
        app.get('/users/:token', function (req, res) {
            self.forAdmin(req.token, function (err) {
                if (err) {
                    res.status(403);
                    res.send("Forbidden");
                    return;
                }

                userModel.getEmailsAndRandosNumberArray(function (err, emails) {
                    if (err) {
                        err.status(500);
                        err.send(err);
                        return;
                    }
                    res.send(JSON.stringify(emails));
                });
            });
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







