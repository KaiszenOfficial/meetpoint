var express = require('express');
var router  = express.Router();

var jwt  = require('jsonwebtoken');
var uuid = require('uuid').v4;

const constants  = require('../constants');
const middleware = require('../utils/middleware');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: constants.TITLE, rooms: constants.ROOMS });
});

router.get('/public/:room', (req, res) => {
	var currentRoom = constants.ROOMS.find(room => room.id == req.params.room);

	res.render('public-room', { title: constants.TITLE, rooms: constants.ROOMS, currentRoom });
});

router.post('/change_room', [middleware], (req, res) => {
	console.log(req.body);
	var { room } = req.body;

	if(req.room == room) {
		return res.status(200).send({ success: false }).end();
	}

	var token = jwt.sign({ username: req.username, room }, constants.SECRET, { expiresIn: constants.SESSION_EXPIRESIN });

	return res.status(200).send({ success: true, token, room }).end();
});

router.get('/private_room_info', (req, res) => {

	var id = uuid();
	var pass = Math.random().toString(36).slice(-8);

	var link = req.headers.host + '/invite?link=' + jwt.sign({ id, pass }, constants.SECRET, { expiresIn: constants.LINK_EXPIRATION });

	return res.status(200).send({ id, pass, link }).end();

});

module.exports = router;
