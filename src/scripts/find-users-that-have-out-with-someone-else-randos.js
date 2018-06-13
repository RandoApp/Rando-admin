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
      return callback(null, {res, stats});
    });
  }
}
