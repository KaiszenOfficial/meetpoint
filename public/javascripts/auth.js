document.getElementById('loginForm').addEventListener('submit', function (e) {
	e.preventDefault();

	var username = document.getElementById('username').value;
	var room = document.getElementById('room').value;

	if (!username) {
		return;
	}

	fetch('/auth/signin', {
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

function createPrivateRoom() {

}

function joinPrivateRoom() {
	$('#joinRoomModal').modal('show');
}