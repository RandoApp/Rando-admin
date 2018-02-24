var async = require("async");
var db = require("randoDB");
var access = require("./access");

module.exports = {
    init: function (app) {
        console.log("[randoService.init] for admin");
        this.initDeleteRando(app);
        this.initUnDeleteRando(app);
        this.initBanUser(app);
        this.initStar(app);
    },
    initStar: function (app) {
        var self = this;
        app.get("/stars", function (req, res) {
            access.forAdmin(req.query.token, res, function (err, admin) {
                if (err) {
                    res.status(500);
                    res.send(err);
                    return;
                }
                res.send(admin.stars);
            });
        });
        app.post("/star", function (req, res) {
            access.forAdmin(req.query.token, res, function (err, admin) {
                if (err) {
                    res.status(500);
                    res.send(err);
                    return;
                }
                admin.stars.push({
                    email: req.body.email,
                    randoId: req.body.randoId,
                    comment: "",
                    date: Date.now()
                });
                admin.save();
                res.send({command: "star", result: "done"});
            });
        });
        app.post("/unstar", function (req, res) {
            access.forAdmin(req.query.token, res, function (err, admin) {
                if (err) {
                    res.status(500);
                    res.send(err);
                    return;
                }
                for (var i = 0; i < admin.stars.length; i++) {
                    var star = admin.stars[i];
                    if (star.email == req.body.email && star.randoId == req.body.randoId) {
                        admin.stars.splice(i, 1)
                        admin.save();
                        break;
                    }
                }
                res.send({command: "unstar", result: "done"});
            });
        });
    },
    initBanUser: function (app) {
        var self = this;
        app.post("/ban", function (req, res) {
            console.info("POST /ban");
            access.forAdmin(req.query.token, res, function (err, admin) {
                db.user.getByEmail(req.body.email, function(err, user) {
                    if (err) {
                        res.status(500);
                        res.send(err);
                        return;
                    }

                    console.log("[randoService.ban] got user: ", user.email);

                    user.ban = Date.now() + 99 * 365 * 24 * 60 * 60 * 1000;
                    db.user.update(user, function (err) {
                        if (err) {
                            res.status(500);
                            res.send(err);
                            return;
                        }

                        console.log("[randoService.ban] user: ", user.email, " banned");
                        res.send({command: "ban", result: "done"});
                    });
                });
            });
        });
        app.post("/unban", function (req, res) {
            console.info("POST /unban");
            access.forAdmin(req.query.token, res, function (err, admin) {
                db.user.getByEmail(req.body.email, function(err, user) {
                    if (err) {
                        res.status(500);
                        res.send(err);
                        return;
                    }

                    console.log("[randoService.ban] got user: ", user.email);

                    user.ban = 0;
                    db.user.update(user, function (err) {
                        if (err) {
                            res.status(500);
                            res.send(err);
                            return;
                        }

                        console.log("[randoService.ban] user: ", user.email, " unbanned");
                        res.send({command: "unban", result: "done"});
                    });
                });
            });
        });
    },
    initDeleteRando: function (app) {
        var self = this;
        app.post("/delete", function (req, res) {
            console.info("POST /delete");
            access.forAdmin(req.query.token, res, function (err, admin) {
                self.deleteRando(req.body.email, req.body.rando, function (err, response) {
                    res.send(response);
                });
            });
        });
    },
    initUnDeleteRando: function (app) {
        var self = this;
        app.post("/undelete", function (req, res) {
            console.info("POST /undelete");
            access.forAdmin(req.query.token, res, function (err, admin) {
                self.unDeleteRando(req.body.email, req.body.rando, function (err, response) {
                    res.send(response);
                });
            });
        });
    },
    deleteRando: function (email, randoId, callback) {
        console.info("[randoService.deleteRando]");
        db.user.getByEmail(email, function (err, user) {
            async.detect(user.randos, function (rando, done) {
                done(rando.user.randoId == randoId || rando.stranger.randoId == randoId);
            }, function (rando) {
                if (!rando) {
                    callback("Rando not found");
                    return;
                }

                if (rando.stranger.randoId == randoId) {
                    rando.stranger.delete = 1;
                } else {
                    rando.user.delete = 1;
                }

                db.user.update(user, function (err) {
                    if (err) {
                        callback(Errors.System());
                        return;
                    }
                    callback(null, {command: "delete", result: "done"});
                });
            });
        });
    },
    unDeleteRando: function (email, randoId, callback) {
        console.info("[randoService.unDeleteRando]");
        db.user.getByEmail(email, function (err, user) {
            async.detect(user.randos, function (rando, done) {
                done(rando.user.randoId == randoId || rando.stranger.randoId == randoId);
            }, function (rando) {
                if (!rando) {
                    callback("Rando not found");
                    return;
                }

                if (rando.stranger.randoId == randoId) {
                    rando.stranger.delete = 0;
                } else {
                    rando.user.delete = 0;
                }

                db.user.update(user, function (err) {
                    if (err) {
                        callback(Errors.System());
                        return;
                    }
                    callback(null, {command: "undelete", result: "done"});
                });
            });
        });
    }
};
