var express = require('express');
var router  = express.Router();

var jwt  = require('jsonwebtoken');
var uuid = require('uuid').v4;

var   constants  = require('../constants');
const middleware = require('../utils/middleware');


router.post('/create', (req, res) => {

	var { username } = req.body;
	var id           = uuid();
	var pass         = Math.random().toString(36).slice(-8);

	var token = jwt.sign({ username, room: id }, constants.SECRET, { expiresIn: constants.SESSION_EXPIRESIN });
	var link = req.headers.host + '/invite?link=' + jwt.sign({ id, pass }, constants.SECRET, { expiresIn: constants.LINK_EXPIRATION });

	global.privateRooms[id] = { pass: pass, host: username }

	return res.status(200).send({ id, pass, link, token }).end();

})

router.post('/join', (req, res) => {
	var { username, id, pass, link } = req.body;

	if ((!id || !pass) && (!link)) {
		// return unathorized
		return res.status(401).send("Please provide the correct credentials")
	}

	if (id && pass) {
		// check with the roomid and pass if room exists or not
		if (!global.privateRooms[id]) {
			return res.status(401).send("Meeting ID is invalid")
		}

		if (global.privateRooms[id].pass !== pass) {
			return res.status(401).send("Password incorrect")
		}

		var token = jwt.sign({ username, room: id }, constants.SECRET, { expiresIn: constants.SESSION_EXPIRESIN });
		var newLink = req.headers.host + '/invite?link=' + jwt.sign({ id, pass }, constants.SECRET, { expiresIn: constants.LINK_EXPIRATION });

		return res.status(200).send({ id, pass, link: newLink, token }).end();
	}

	if (link) {
		// validate invite link and allow user to join
		jwt.verify(link, constants.SECRET, (err, decoded) => {
			if (err) return res.status(500).send("Internal Error!").end();

			if (!global.privateRooms[decoded.id]) {
				return res.status(401).send("Meeting ID is invalid")
			}

			if (!global.privateRooms[decoded.id].pass !== decoded.pass) {
				return res.status(401).send("Password incorrect")
			}

			var token   = jwt.sign({ username, room: id }, constants.SECRET, { expiresIn: constants.SESSION_EXPIRESIN });
			var newLink = req.headers.host + '/invite?link=' + jwt.sign({ id, pass }, constants.SECRET, { expiresIn: constants.LINK_EXPIRATION });

			return res.status(200).send({ id, pass, link: newLink, token }).end();
		});
	}
});

router.post('/change', [middleware], (req, res) => {
	console.log(req.body);
	var { room } = req.body;

	if (req.room == room) {
		return res.status(200).send({ success: false }).end();
	}

	var token = jwt.sign({ username: req.username, room }, constants.SECRET, { expiresIn: constants.SESSION_EXPIRESIN });

	return res.status(200).send({ success: true, token, room }).end();
});

module.exports = router;