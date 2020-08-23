var express = require('express');
var router  = express.Router();

var jwt = require('jsonwebtoken');

const constants = require('../constants');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: constants.TITLE, rooms: constants.ROOMS });
});

router.get('/public/:room', (req, res) => {
	var currentRoom = constants.ROOMS.find(room => room.id == req.params.room);

	res.render('public-room', { title: constants.TITLE, rooms: constants.ROOMS, currentRoom });
});

router.get('/private/:room', (req, res) => {

	var roomId = req.params.room;

	res.render('private-room', { title: constants.TITLE });
});

router.get('/invite', (req, res) => {
	var link = req.query.link;

	if (!link) {
		return res.status(401).send("Invite Link Missing");
	}

	jwt.verify(token, constants.SECRET, (err, decoded) => {
		if (err) return res.status(500).send("Internal Error!").end();

		var { id, pass } = decoded;

		if (!global.privateRooms[id]) {
			return res.status(401).send("Meeting ID is invalid")
		}

		if (global.privateRooms[id].pass !== pass) {
			return res.status(401).send("Password incorrect")
		}

		// var newLink = req.headers.host + '/invite?link=' + jwt.sign({ id, pass }, constants.SECRET, { expiresIn: constants.LINK_EXPIRATION });

		return res.status(200).send().end();
	})
});

module.exports = router;
