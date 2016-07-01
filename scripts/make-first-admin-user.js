var config = require("config");
var mongoose = require("mongoose");
var crypto = require("crypto");

mongoose.connect(config.db.url);
var db = mongoose.connection;

db.on("error", function (e) {
  console.error("Monodb connection error: " + e);
});

var adminModel = require("../src/model/adminModel");
var argsProcessor = require('command-line-args')

var args = argsProcessor( [
  { name: 'email', alias: 'e', type: String},
  { name: 'password', alias: 'p', type: String}
]);


function generateHashForPassword (email, password) {
    var sha1sum = crypto.createHash("sha1");
    sha1sum.update(password + email + config.admin.secret);
    return sha1sum.digest("hex");
};

db.on("open", function () {
  adminModel.create({
    email: args.email,
    password: generateHashForPassword(args.email, args.password)
  }, function (err) {
    if (err) {
      console.log("Cannot create admin user, because: " + err);
      return;
    }

    console.log("User created!");

    adminModel.getByEmail(args.email, function (e, user) {
console.log("FOUND!!" + e + " _ " + user);
    });

    // db.close();
  });
});
