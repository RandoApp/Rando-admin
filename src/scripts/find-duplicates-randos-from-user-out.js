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
      return callback(null, {res, stats});
    });
  }
}
