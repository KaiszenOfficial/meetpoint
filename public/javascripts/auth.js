document.getElementById('loginForm').addEventListener('submit', function (e) {
	e.preventDefault();

	var username = document.getElementById('username').value;
	var room = document.getElementById('room').value;

	if (!username) {
		return;
	}

	fetch('/auth/join', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ username, room })
	}).then(res => {
		if (!res.ok) {
			return Promise.reject(res);
		}
		return res.json();
	}).then(data => {
		console.log(data);
		saveSession(data.token);
		window.location.href = window.location.protocol + '//' + window.location.host + '/public/' + data.room;
	}).catch(error => {
		console.error(error);
	})
});

function saveSession(token) {
	sessionStorage.setItem('token', token);
}

function getPrivateRoomInfo() {
	fetch('/private_room_info', {
		method: 'GET',
	})
	.then(res => res.json())
	.then(data => {
		console.log(data.id, data.pass, data.link);
		document.getElementById('roomId').value = data.id;
		document.getElementById('roomPass').value = data.pass;
		document.getElementById('roomLink').value = data.link;

		$('#createRoomModal').modal('show');
	});
}

document.getElementById('createRoomForm').addEventListener('submit', function (e) {
	e.preventDefault();

	var username = document.getElementById('pvusername').value;

	if (!username) {
		return;
	}

	fetch('/room/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ username })
	}).then(res => {
		if (!res.ok) {
			return Promise.reject(res);
		}
		return res.json();
	}).then(data => {
		console.log(data);
		saveSession(data.token);
		savePrivateRoomInfo(data.id, data.pass, data.link);
		window.location.href = window.location.protocol + '//' + window.location.host + '/private/' + data.id;
	}).catch(error => {
		console.error(error);
	})
});

document.getElementById('joinRoomForm').addEventListener('submit', function (e) {
	e.preventDefault();

	var id = document.getElementById('inviteId').value;
	var pass = document.getElementById('invitePass').value;
	var link = document.getElementById('inviteLink').value;
	var username = document.getElementById('inviteUsername').value;

	console.log(id, pass, link, username);

	if ((!id || !pass) && !link) {
		return;
	}

	fetch('/room/join', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ username, id, pass, link })
	}).then(res => {
		if (!res.ok) {
			return Promise.reject(res);
		}
		return res.json();
	}).then(data => {
		console.log(data);
		saveSession(data.token);
		savePrivateRoomInfo(data.id, data.pass, data.link);
		window.location.href = window.location.protocol + '//' + window.location.host + '/private/' + data.id;
	}).catch(error => {
		console.error(error);
	})
});

function savePrivateRoomInfo(id, pass, link) {
	sessionStorage.setItem('room_id', id);
	sessionStorage.setItem('room_pass', pass);
	sessionStorage.setItem('room_link', link);
}

function joinPrivateRoom() {
	$('#joinRoomModal').modal('show');
}