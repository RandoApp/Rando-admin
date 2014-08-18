var mongoose = require("mongoose");
var config = require("config");

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
	console.info("[adminModel.update] Update admin with Email: ", admin.email);

	admin.save(function (err) {
            if (err) {
                console.warn("[adminModel.update] Can't update admin with email: ", admin.email, " because: ", err);
            } else {
                console.log("[adminModel.update] Admin updated. Email: ", admin.email);
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

	console.info("[adminModel.create] Create admin with email: ", admin.email);

	var admin = new Admin(admin);
	admin.save(function (err) {
            if (err) {
                console.warn("[adminModel.create] Can't create admin! Email: ", admin.email, " because: ", err);
            } else {
                console.log("[adminModel.create] Admin created with email: ", admin.email);
            }

            if (callback) {
                callback(err);
            }
        });
    },
    getByEmail: function (email, callback) {
	console.info("[adminModel.getByEmail] Try find admin by email: ", email);
	Admin.findOne({email: email}, callback);
    },
    getByToken: function (token, callback) {
	console.info("[adminMode.getByToken] Try find admin by authToken: ", token);
	Admin.findOne({authToken: token}, callback);
    }
};
