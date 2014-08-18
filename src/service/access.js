var adminModel = require("../model/adminModel");

module.exports = {
    forAdmin: function (token, res, callback) {
        if (!token) {
            console.info("[admin.forAdmin] token not exist. Send auth.html");
            res.status(401);
            res.sendfile("front-end/auth.html");
            return;
        }

        adminModel.getByToken(token, function (err, admin) {
            if (!admin || admin.expiration < Date.now() || token != admin.authToken) {
                console.log("Send auth.html");
                res.status(401);
                res.sendfile("front-end/auth.html");
                return;
            }
 
            if (admin) {
                callback(null, admin);
                return;
            }
        });
    }
};
