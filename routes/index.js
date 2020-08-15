var express = require('express');
var router  = express.Router();

var jwt = require('jsonwebtoken');

const constants  = require('../constants');
const middleware = require('../utils/middleware');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: constants.TITLE, rooms: constants.ROOMS });
});

router.get('/:room', (req, res) => {
	var currentRoom = constants.ROOMS.find(room => room.id == req.params.room);

	res.render('main', { title: constants.TITLE, rooms: constants.ROOMS, currentRoom });
});

router.post('/change_room', [middleware], (req, res) => {
	console.log(req.body);
	var { room } = req.body;

	if(req.room == room) {
		return res.status(200).send({ success: false }).end();
	}

	var token = jwt.sign({ username: req.username, room }, constants.SECRET, { expiresIn: constants.EXPIRESIN });

	return res.status(200).send({ success: true, token, room }).end();
});

module.exports = router;
