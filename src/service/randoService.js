var async = require("async");
var logger = require("../../../src/log/logger");
var userModel = require("../../../src/model/userModel");
var commentService = require("../../../src/service/commentService");

module.exports = {
    init: function (app) {
        logger.debug("[randoService.init] for admin");
        this.initDeleteRando(app);
        this.initUnDeleteRando(app);
        this.initBanUser(app);
    },
    initBanUser: function (app) {
        var self = this;
        app.post("/admin/ban", function (req, res) {
            logger.data("POST /admin/ban");
            userModel.getByEmail(req.body.email, function(err, user) {
                if (err) {
                    res.status(500);
                    res.send(err);
                    return;
                }

                logger.debug("[randoService.ban] got user: ", user.email);

                user.ban = Date.now() + 99 * 365 * 24 * 60 * 60 * 1000;
                userModel.update(user, function (err) {
                    if (err) {
                        res.status(500);
                        res.send(err);
                        return;
                    }

                    logger.debug("[randoService.ban] user: ", user.email, " banned");
                    res.send({command: "ban", result: "done"});
                });
            });
        });
        app.post("/admin/unban", function (req, res) {
            logger.data("POST /admin/unban");
            userModel.getByEmail(req.body.email, function(err, user) {
                if (err) {
                    res.status(500);
                    res.send(err);
                    return;
                }

                logger.debug("[randoService.ban] got user: ", user.email);

                user.ban = 0;
                userModel.update(user, function (err) {
                    if (err) {
                        res.status(500);
                        res.send(err);
                        return;
                    }

                    logger.debug("[randoService.ban] user: ", user.email, " unbanned");
                    res.send({command: "unban", result: "done"});
                });
            });
        });
    },
    initDeleteRando: function (app) {
        var self = this;
        app.post("/admin/delete", function (req, res) {
            logger.data("POST /admin/delete");
            self.deleteRando(req.body.email, req.body.rando, function (err, response) {
                res.send(response);
            });
        });
    },
    initUnDeleteRando: function (app) {
        var self = this;
        app.post("/admin/undelete", function (req, res) {
            logger.data("POST /admin/undelete");
            self.unDeleteRando(req.body.email, req.body.rando, function (err, response) {
                res.send(response);
            });
        });
    },
    deleteRando: function (email, randoId, callback) {
        logger.data("[randoService.deleteRando]");
        userModel.getByEmail(email, function (err, user) {
            commentService.delete(user, randoId, callback);
        });
    },
    unDeleteRando: function (email, randoId, callback) {
        logger.data("[randoService.unDeleteRando]");
        userModel.getByEmail(email, function (err, user) {
            commentService.unDelete(user, randoId, callback);
        });
    }
};
