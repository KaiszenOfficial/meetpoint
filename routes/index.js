var express = require('express');
var router  = express.Router();

var jwt  = require('jsonwebtoken');

const constants  = require('../constants');

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

module.exports = router;
