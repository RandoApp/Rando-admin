var async = require("async");
var db = require("randoDB");

module.exports = {
  run (callback) {
    db.user.mapReduce({
      map: function () {
        var userEmail = this.email;
        var badRandos = this.out.filter(rando => {return rando.email !== userEmail})
        if (badRandos.length > 0) {
          emit(this.email, badRandos.map(rando => rando.randoId));
        };
      },
      reduce: function (k, vals) {
        return {email: k, badRandos: vals};
      },
      verbose: true
    }, (err, res, stats) => {
      if (err) {
        return callback(err);
      }

      return callback(null, {res, stats});
    });
  }
}