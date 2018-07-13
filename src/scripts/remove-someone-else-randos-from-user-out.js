var async = require("async");
var db = require("@rando4.me/db");

module.exports = {
  run (callback) {
    db.user.mapReduce({
      map: function () {
        var userEmail = this.email;
        var badRandos = this.out.filter(rando => {return rando.email !== userEmail && rando.email});
        if (badRandos.length > 0) {
          emit(this.email, badRandos.map(rando => rando.randoId));
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

          for (var i = 0 ; i < user.badRandos.length; i++) {
            var randoId = user.badRandos[i];

            var index = getIndexOfRandoToRemove(randoId, userFull.out);
            var deletedRando = userFull.out.splice(index, 1)[0];
            delete deletedRando.strangerRandoId;
            delete deletedRando.strangerMapURL;
            delete deletedRando.strangerMapSizeURL;
            userFull.in.push(deletedRando);
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
