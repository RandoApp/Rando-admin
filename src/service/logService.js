var fs = require("fs");
var async = require("async");
var access = require("./access");

module.exports = {
    init: function (app) {
        console.log("[logService.init] for admin");
        this.initLogs(app);
        this.initLog(app);
        this.initDeleteLog(app);
    },
    initLog: function (app) {
        var self = this;
        app.get('/admin/log/:logFile', function (req, res) {
            console.info("GET /admin/log/:logFile ", req.params.logFile);
            access.forAdmin(req.query.token, res, function (err, admin) {
                self.readLogFile(req.params.logFile, function (err, log) {
                    if (err) {
                        res.status(500);
                        res.send(err);
                        return;
                    }

                    res.send(JSON.parse(log));
                });
            });
        });
    },
    initDeleteLog: function (app) {
        var self = this;
        app.delete('/admin/log/:logFile', function (req, res) {
            console.info("DELETE /admin/log/:logFile");
            access.forAdmin(req.query.token, res, function (err, admin) {
                self.deleteLogFile(req.params.logFile, function (err) {
                    if (err) {
                        res.status(500);
                        res.send(err);
                        return;
                    }
                    res.send({delete: req.params.logFile});
                });
            });
        });
    },
    initLogs: function (app) {
        var self = this;
        app.get('/admin/logs', function (req, res) {
            console.info("GET /admin/logs");
            access.forAdmin(req.query.token, res, function (err, admin) {
                self.getLogFiles(function (err, logs) {
                    if (err) {
                        res.status(500);
                        res.send(err);
                        return;
                    }

                    res.send(logs);
                });
            });
        });
    },
    getLogFiles: function (callback) {
        fs.readdir("logs/", function(err, files) {
            console.log("[logService.getLogFiles] got: ", files);
            if (!files) {
                callback(null, []);
                return;
            }

            async.filter(files, function(file, thisIsLogFileCallback) {
                var isLogFile = /^.*\.log$/i.test(file)
                thisIsLogFileCallback(isLogFile);
            }, function (logs) {
                callback(null, logs);
            });
        });
    },
    readLogFile: function (logFile, callback) {
        fs.readFile("logs/" + logFile, callback);
    },
    deleteLogFile: function (logFile, callback) {
        fs.unlink("logs/" + logFile, callback);
    }
};
