var express = require('express');
var router  = express.Router();

var jwt  = require('jsonwebtoken');

var constants = require('../constants');

/* Signin user. */
router.post('/join', function (req, res, next) {
	
	var { username, room } = req.body;

	var token = jwt.sign({ username, room }, constants.SECRET, { expiresIn: constants.SESSION_EXPIRESIN });

	return res.status(200).send({ token, room }).end();
	
});


module.exports = router;
