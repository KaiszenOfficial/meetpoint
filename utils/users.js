var users = [];

joinRoom = (id, username, room) => {
	const user = { id, username, room };
	users.push(user);
	return user;
}

getCurrentUser = (id) => {
	return users.find(user => user.id === id);
}

leaveRoom = (id) => {
	let index = users.findIndex(user => user.id === id);

	if(index !== -1) {
		return users.splice(index, 1)[0];
	}
}

getRoomUsers = (room) => {
	return users.filter(user => user.room === room);
}

module.exports = {
	joinRoom,
	getCurrentUser,
	leaveRoom,
	getRoomUsers
}