var adminModel = require("../model/adminModel");
var basicAuth = require('basic-auth');

module.exports = {
    forAdmin: function (req, res, next) {

/*        adminModel.getByToken("token", function (err, admin) {
            if (!admin || admin.expiration < Date.now() || token != admin.authToken) {
                console.log("Send auth.html");
                res.status(401);
                res.sendfile("front-end/auth.html");
                return;
            }*/
            var user = basicAuth(req);
            if (basicAuth) {
                next();
            }
       // });
    }
};
