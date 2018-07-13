var async = require("async");
var db = require("@rando4.me/db");

module.exports = {
  run (callback) {
    db.user.mapReduce({
      map: function () {
        var userEmail = this.email;
        var randoIds = this.out.map(rando => rando.randoId);
        if (randoIds.length === 0) return;

        var randosMap = {};
        randoIds.forEach(id => {
          if (randosMap[id] >= 1) {
            randosMap[id]++;
          } else {
            randosMap[id] = 1;
          }
        });

        //remove single ids
        for (var id in randosMap) {
          if (randosMap[id] === 1) {
            delete randosMap[id];
          }
        }

        for (var id in randosMap) {
          if (randosMap[id] > 1) {
            emit(this.email, randosMap);
            return;
          }
        }
      },
      reduce: function (k, vals) {
        return vals;
      },
      verbose: true
    }, (err, res, stats) => {
      if (err) {
        return callback(err);
      }

      res = res.map(r => {return {email: r._id, badRandos: r.value}});

      async.eachLimit(res, 1, (user, done) => {
        db.user.getByEmail(user.email, function (err, userFull) {
          if (err) {
            console.log("ERROR when fetch user: " + use.email, "err: " + err);
            return done(err);
          }

          for (var id in user.badRandos) {
            console.log("deleiteing id:" + id);
            var badRandosCount = user.badRandos[id];
            for (var i = 0; i < badRandosCount-1; i++) {
              var index = getIndexOfRandoToRemove(id, userFull.out);
              userFull.out.splice(index, 1);
            }
          }

          console.log("Updating " + userFull.email);
          db.user.update(userFull, done);
        });
      }, function (err) {
        return callback(null, {res, stats});
      });
    });
  }
}


function getIndexOfRandoToRemove(id, out) {
  for (var i = 0; i < out.length; i++) {
    if (out[i].randoId === id) {
      return i;
    }
  }
}
