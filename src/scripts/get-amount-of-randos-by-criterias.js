var async = require("async");
var db = require("randoDB");

function getMedian (values) {
  if ( values.length == 1 ) {
    return values[0];
  }

  values.sort((a, b) => {return a - b;});


  var half = Math.floor(values.length / 2)

  if ( values.length % 2 ) {
    return values[half];
  } else {
    return ( values[half - 1] + values[half] ) / 2.0;
  }
}

module.exports = {
  run (callback) {
    db.user.mapReduce({
      map: function () {
        emit(this.email, this.out.length);
      },
      reduce: function (k, vals) {
        return vals;
      },
      verbose: true
    }, (err, res, stats) => {
      if (err) {
        return callback(err);
      }

      res = res.map(r => {return {email: r._id, randosLength: r.value}});

      var anonymous = res.filter(r => { r.email.indexOf("@rando4.me") !== -1 });

      anonymous.map(r => randosLength);

      var median = getMedian(anonymous);

      return callback(null, {res: {anonymous: median, anonymousLength: anonymous.length}, stats});
    });
  }
}


