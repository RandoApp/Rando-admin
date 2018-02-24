var basicAuth = require("basic-auth");
var logger = require("../log/logger");
var config = require("config");

function sendAccessDenied (res) {
  res.statusCode = 401;
  res.setHeader('WWW-Authenticate', 'Basic realm="example"');
  res.end('Access denied');
}

module.exports = {
  forAdmin: function (req, res, next) {
    var credentials = basicAuth(req);

    if (credentials && credentials.name && config.app.creds[credentials.name] === credentials.pass) {
      req.user = credentials.name;
      logger.info("Following admin user got access", req.user);
      next();
    } else  {
      logger.warn("AccessDenied for:", credentials);
      sendAccessDenied(res);
    }
  }
};
