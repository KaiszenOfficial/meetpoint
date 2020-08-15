var jwt = require('jsonwebtoken');

var constants = require('./constants');

module.exports = function (req, res, next) {
	var token = req.headers['x-auth-token'];

	if(!token) return res.status(401).send("Token missing from header").end();

	jwt.verify(token, constants.SECRET, (err, decoded) => {
		if(err) return res.status(500).send("Internal Error!").end();

		req.username = decoded.username;
		req.room = decoded.room;

		next();
	})
}