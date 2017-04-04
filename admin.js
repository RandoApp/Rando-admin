var db = require("randoDB");
var express = require("express");
var fs = require("fs");
var config = require("config");
var os = require("os");
var util = require("util");
var diskspace = require("diskspace");
var async = require("async");
var crypto = require("crypto");
var access = require("./src/service/access");
var logService = require("./src/service/logService");
var randoService = require("./src/service/randoService");
var adminModel = require("./src/model/adminModel");
var express = require("express");
var app = express();
var mongoose = require("mongoose");

db.connect(config.db.url);

logService.init(app);
randoService.init(app);

app.get('/randos', access.forAdmin, function (req, res) {
  console.info("GET /randos");
  db.rando.getAll(function (err, randos) {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }
    res.send(randos);
  });
});

app.get('/user', access.forAdmin, function (req, res) {
  console.info("GET /user");
  db.user.getByEmail(req.query.email, function (err, user) {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }
    res.send(user);
  });
});

app.get('/status', access.forAdmin, function (req, res) {
  console.info("GET /status");
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
      diskspace.check('/', function (err, total, free, status) {
        var diskStatus = {
          disk: {
            free: free,
            total: total
          }
        };
        callback(null, diskStatus);
      });
    },

    ],
    function(err, statuses) {
      if (err) {
        res.status(500);
        res.send(err);
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

app.get('/users', access.forAdmin, function (req, res) {
  console.info("GET /users");
  var page = req.query.page;
  var count = req.query.count;

  db.user.getEmailsAndRandosNumberArray(function (err, emails) {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }
    var usersPage = {
      data: emails.slice((page - 1) * count, page * count),
      total: emails.length
    };

    res.send(usersPage);
  });
});

app.get('/calendar', access.forAdmin, function (req, res) {
  console.info("GET /calendar");
  var start = req.query.start;
  var end = req.query.end;

  db.user.getLightOutRandosForPeriod(start, end, function (err, randos) {
    if (err) {
      res.status(500);
      return res.send(err);
    }
    res.send(randos);
  });
});

app.get('/anomalies', access.forAdmin, function (req, res) {
  console.info("GET /anomalies");

  db.anomaly.getAll(function (err, anomalies) {
    if (err) {
      res.status(500);
      return res.send(err);
    }
    res.send(anomalies);
  });
});

app.post('/anomaly-move/:randoId', access.forAdmin, function (req, res) {
  console.info("POST /anomaly-move/" + req.params.randoId);

  db.anomaly.getByRandoId(req.params.randoId, function (err, anomaly) {
    if (err) {
      res.status(500);
      return res.send(err);
    }

    var rando = anomaly.rando;
    if (Array.isArray(rando.tags)) {
      rando.tags = rando.tags.filter( (tag) => { return !/(monocolor)|(nude)/g.test(tag) } );
    }

    db.rando.add(rando, function (errAdd) {
      if (errAdd) {
        res.status(500);
        return res.send(errAdd);
      }

      db.anomaly.removeByRandoId(req.params.randoId, function (errRemove) {
        if (errRemove) {
          res.status(500);
          return res.send(errRemove);
        }
      
        db.anomaly.getAll(function (err, anomalies) {
          if (err) {
            res.status(500);
            return res.send(err);
          }
          res.send(anomalies);
        });  
      });
    });
  });
});

app.post('/anomaly-delete/:randoId', access.forAdmin, function (req, res) {
  console.info("DELETE /anomaly/" + req.params.randoId);

  db.anomaly.removeByRandoId(req.params.randoId, function (err) {
    if (err) {
      res.status(500);
      return res.send(err);
    }

    db.anomaly.getAll(function (err, anomalies) {
      if (err) {
        res.status(500);
        return res.send(err);
      }
      res.send(anomalies);
    });
  });
});

app.get('/exchangelogs', access.forAdmin, function (req, res) {
  console.info("GET /exchangelogs");

  db.exchangeLog.getLastNLightLogs(parseInt(req.query.limit), function (err, logs) {
    if (err) {
      res.status(500);
      return res.send(err);
    }
    res.send(logs);
  });
});

app.get('/scripts', access.forAdmin, function (req, res) {
  console.info("GET /scripts");
  res.send(fs.readdirSync(config.admin.scriptsFolder).map(script => script.replace(".js", "")));
});

app.post('/scripts/:script', access.forAdmin, function (req, res) {
  console.info("POST /scripts/", req.params.script);
  require("./" + config.admin.scriptsFolder + "/" + req.params.script).run(function (err, result) {
    if (err) {
      console.log("ERR: " + err);
      res.status(500);
      return res.send(err);
    }
    console.log("RESULT IS : " + result);
    res.send(result);
  });
});

app.listen(config.admin.port, config.admin.host, function () {
  console.info('Express server listening on port ' + config.admin.port + ' and host: ' + config.admin.host);
}).setTimeout(config.admin.serverTimeout);

function generateHashForPassword (email, password) {
  var sha1sum = crypto.createHash("sha1");
  sha1sum.update(password + email + config.admin.secret);
  return sha1sum.digest("hex");
};

module.exports = {
  createAdmin: function (email, password, callback) {
    var self = this;
    adminModel.create({
      email: email,
      password: generateHashForPassword(email, password),
      authToken: crypto.randomBytes(config.admin.tokenLength).toString('hex'), 
      expiration: Date.now() + 8 * 60 * 60 * 1000
    }, callback);
  }
};

