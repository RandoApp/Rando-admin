var mongoose = require("mongoose");
var config = require("config");
var logger = require("../../../src/log/logger");

var Admin = mongoose.model("admin", new mongoose.Schema({
    email: {type: String, unique: true, lowercase: true},
    authToken: String,
    expiration: Number,
    password: String,
    stars: [{
        email: String,
        randoId: String,
        comment: String,
        date: Number
    }]
}));

module.exports = {
    update: function (admin, callback) {
	logger.data("[adminModel.update] Update admin with Email: ", admin.email);

	admin.save(function (err) {
            if (err) {
                logger.warn("[adminModel.update] Can't update admin with email: ", admin.email, " because: ", err);
            } else {
                logger.debug("[adminModel.update] Admin updated. Email: ", admin.email);
            }

            if (callback) {
                callback(err);
            }
        });
    },
    create: function (admin, callback) {
	if (!admin) {
            callback(new Error("Admin arg not exists"));
            return;
	}

	logger.data("[adminModel.create] Create admin with email: ", admin.email);

	var admin = new Admin(admin);
	admin.save(function (err) {
            if (err) {
                logger.warn("[adminModel.create] Can't create admin! Email: ", admin.email, " because: ", err);
            } else {
                logger.debug("[adminModel.create] Admin created with email: ", admin.email);
            }

            if (callback) {
                callback(err);
            }
        });
    },
    getByEmail: function (email, callback) {
	logger.data("[adminModel.getByEmail] Try find admin by email: ", email);
	Admin.findOne({email: email}, callback);
    },
    getByToken: function (token, callback) {
	logger.data("[adminMode.getByToken] Try find admin by authToken: ", token);
	Admin.findOne({authToken: token}, callback);
    }
};
