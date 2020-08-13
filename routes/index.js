var express = require('express');
var router  = express.Router();

const constants = require('../utils/constants');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: constants.TITLE, rooms: constants.ROOMS });
});

router.get('/:room', (req, res) => {
	var currentRoom = req.params.room;
	res.render('main', { title: constants.TITLE, rooms: constants.ROOMS, currentRoom });
})



module.exports = router;
