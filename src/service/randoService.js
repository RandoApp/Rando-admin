var async = require("async");
var logger = require("../../../src/log/logger");
var userModel = require("../../../src/model/userModel");
var commentService = require("../../../src/service/commentService");

module.exports = {
    init: function (app) {
        logger.debug("[randoService.init] for admin");
        this.initDeleteRando(app);
        this.initUnDeleteRando(app);
    },
    initDeleteRando: function (app) {
        var self = this;
        app.post("/admin/delete", function (req, res) {
            logger.data("DELETE /admin/delete");
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
