var logger = require("../../../src/log/logger");
var adminModel = require("./adminModel");

module.exports = {
    forAdmin: function (token, res, callback) {
        if (!token) {
            logger.data("[admin.forAdmin] token not exist. Send auth.html");
            res.status(401);
            res.sendfile("admin/front-end/auth.html");
            return;
        }

        adminModel.getByToken(token, function (err, admin) {
            if (!admin || admin.expiration < Date.now() || token != admin.authToken) {
                logger.debug("Send auth.html");
                res.status(401);
                res.sendfile("admin/front-end/auth.html");
                return;
            }
 
            if (admin) {
                callback(null, admin);
                return;
            }
        });
    }
};
