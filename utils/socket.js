var jwt = require('jsonwebtoken');

var formatMessage = require('./message');
var { joinRoom, getCurrentUser, getRoomUsers, leaveRoom } = require('./users');
var constants = require('../constants');

module.exports = (io) => {
	io.use((socket, next) => {
		var token = socket.handshake.query.token;
		if (token) {
			jwt.verify(token, constants.SECRET, (err, decoded) => {
				if (err) return next(new Error("Failed to authenticate connection"));

				socket.decoded = decoded;
				next();
			})
		}
	}).on('connection', (socket) => {

		console.log('New User Connected : ', socket.decoded.username);

		socket.on('join:room', () => {
			console.log('join:room : ', socket.decoded);
			var { id, decoded } = socket;
			var user = joinRoom(id, decoded.username, decoded.room);
			var roomUsers = getRoomUsers(decoded.room);
			socket.join(user.room);
			io.to(socket.id).emit('user:welcome', { username: user.username, text: `Welcome ${user.username}!`, room: user.room });
			socket.broadcast.to(user.room).emit('user:joined', `${user.username} has joined the room!`);
			io.in(user.room).emit('users:connected', roomUsers);
		});

		socket.on('send:message', (text) => {
			console.log('send:message : ', socket.decoded);
			var user = getCurrentUser(socket.id);

			var message = formatMessage(user.username, text);
			io.to(user.id).emit('sent:message', message);
			socket.broadcast.to(user.room).emit('new:message', message);
		});

		socket.on('disconnect', () => {
			console.log('disconnect : ', socket.decoded);
			var user = leaveRoom(socket.id);
			var roomUsers = getRoomUsers(socket.decoded.room);
			if (user) {
				socket.broadcast.to(user.room).emit('user:left', `${user.username} has left the room!`);
				socket.broadcast.to(user.room).emit('users:connected', roomUsers);
			}

		});
	});
}