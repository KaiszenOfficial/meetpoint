
var { room_id, room_pass, room_link, token } = sessionStorage;

document.getElementById('meetingId').value = room_id;
document.getElementById('meetingPass').value = room_pass;
document.getElementById('meetingLink').value = room_link;

var socket = io({ query: { token } });
var chatWindow = document.querySelector('.chat-window');

document.getElementById('main').style.display = 'none';
document.getElementById('loader').style.display = 'block';

setTimeout(() => {
	document.getElementById('main').style.display = 'block';
	document.getElementById('loader').style.display = 'none';
}, 3000);

socket.emit('join:private:room', ({ room_id, room_pass, room_link }));

socket.on('error', (errString) => {
	var error = JSON.parse(errString);

	document.getElementById('main-content').style.display = 'none'

	var alert = document.getElementById('alert-message');
	document.getElementById('alert-text').innerText = error.text;
	alert.classList.add('alert-danger');
	alert.style.display = 'block';

	setTimeout(() => {
		window.location.href = window.location.protocol + '//' + window.location.host;
	}, 5000)
})

socket.on('users:connected', (users) => {
	var userList = document.querySelector('.users');
	while (userList.childNodes.length > 2) {
		userList.removeChild(userList.lastChild);
	}
	users.forEach(user => {
		var li = document.createElement('li');
		li.classList.add('list-group-item', 'list-group-item-action')
		li.innerText = user.username;

		userList.appendChild(li);
	});
});

socket.on('user:welcome', (data) => {
	var chatWindowHeader = document.querySelector('.chat-window-header');
	chatWindowHeader.innerText = `Connected :: ${data.room}`;

	var serverMsgDiv = document.createElement('div');
	serverMsgDiv.classList.add('server-messages');

	var textDiv = document.createElement('span');
	textDiv.classList.add('badge', 'badge-success', 'my-1');
	textDiv.innerText = data.text;

	serverMsgDiv.appendChild(textDiv);

	chatWindow.appendChild(serverMsgDiv);

	chatWindow.scrollTop = chatWindow.scrollHeight;
});

socket.on('user:joined', (text) => {
	var serverMsgDiv = document.createElement('div');
	serverMsgDiv.classList.add('server-messages');

	var textDiv = document.createElement('span');
	textDiv.classList.add('badge', 'badge-info', 'my-1');
	textDiv.innerText = text;

	serverMsgDiv.appendChild(textDiv);

	chatWindow.appendChild(serverMsgDiv);

	chatWindow.scrollTop = chatWindow.scrollHeight;
});

socket.on('user:left', (text) => {
	var serverMsgDiv = document.createElement('div');
	serverMsgDiv.classList.add('server-messages');

	var textDiv = document.createElement('span');
	textDiv.classList.add('badge', 'badge-warning', 'my-1');
	textDiv.innerText = text;

	serverMsgDiv.appendChild(textDiv);

	chatWindow.appendChild(serverMsgDiv);

	chatWindow.scrollTop = chatWindow.scrollHeight;
});


document.getElementById('message-form').addEventListener('submit', function (e) {
	e.preventDefault();

	var msg = document.getElementById('msg').value;
	if (!msg) {
		return;
	}
	socket.emit('send:message', msg);

	document.getElementById('msg').value = '';
	document.getElementById('msg').focus();

});

socket.on('new:message', (data) => {
	var chatDiv = document.createElement('div');
	chatDiv.classList.add('card', 'received-message');

	var messageHeader = document.createElement('div');
	messageHeader.classList.add('chat-message-header');

	var username = document.createElement('span');
	var time = document.createElement('span');

	username.classList.add('username');
	username.innerText = data.username;

	time.classList.add('chat-time');
	time.innerText = data.time;

	messageHeader.appendChild(username);
	messageHeader.appendChild(time);

	var text = document.createElement('p');
	text.classList.add('chat-message');
	text.innerText = data.text;

	var card = document.createElement('div');
	card.classList.add('card-body')
	card.appendChild(messageHeader);
	card.appendChild(text);

	chatDiv.appendChild(card);
	chatWindow.appendChild(chatDiv);

	chatWindow.scrollTop = chatWindow.scrollHeight;

});

socket.on('sent:message', (data) => {
	var chatDiv = document.createElement('div');
	chatDiv.classList.add('card');
	chatDiv.classList.add('sent-message')

	var messageHeader = document.createElement('div');
	messageHeader.classList.add('chat-message-header');

	var username = document.createElement('span');
	var time = document.createElement('span');

	username.classList.add('username');
	username.innerText = data.username;

	time.classList.add('chat-time');
	time.innerText = data.time;

	messageHeader.appendChild(username);
	messageHeader.appendChild(time);

	var text = document.createElement('p');
	text.classList.add('chat-message');
	text.innerText = data.text;

	var card = document.createElement('div');
	card.classList.add('card-body')
	card.appendChild(messageHeader);
	card.appendChild(text);

	chatDiv.appendChild(card);
	chatWindow.appendChild(chatDiv);

	chatWindow.scrollTop = chatWindow.scrollHeight;
});

socket.on('check:host:true', () => {
	$('#confirmMeetingEndModal').modal('show');
})

socket.on('check:host:false', () => {
	sessionStorage.clear();
	window.location.href = window.location.protocol + '//' + window.location.host;
})

function changeRoom(id) {
	var roomId = id;
	// call api to change room
	fetch('/room/change', {
		method: 'POST',
		body: JSON.stringify({ room: roomId }),
		headers: {
			'Content-Type': 'application/json',
			'x-auth-token': token
		}
	}).then(res => {
		if (!res.ok) throw res;

		return res.json();
	}).then(data => {
		console.log(data);
		if (!data.success) {
			showAlert('warning', 'Cannot join same room!')
		} else {
			sessionStorage.setItem('token', data.token);
			window.location.href = window.location.protocol + '//' + window.location.host + '/public/' + data.room;
			// showAlert('info', 'Joined room ' + data.room);
		}
	}).catch(error => {
		error.text().then(text => {
			showAlert('danger', text)
		});
	})
}

document.getElementById('leaveBtn').addEventListener('click', function (e) {
	e.preventDefault();

	socket.emit('check:host');
});

document.getElementById('endMeetingBtn').addEventListener('click', function (e) {
	e.preventDefault();

	socket.emit('end:meeting:all');
	sessionStorage.clear();
	window.location.href = window.location.protocol + '//' + window.location.host;
});

socket.on('meeting:ended', () => {
	$('#meetingEndModal').modal('show');

	setTimeout(() => {
		$('#meetingEndModal').modal('hide');
		sessionStorage.clear();
		window.location.href = window.location.protocol + '//' + window.location.host;
	}, 2000);
});

function showAlert(type, text) {
	var alertClass = 'alert-' + type;
	var alert = document.getElementById('alert-message');
	document.getElementById('alert-text').innerText = text;
	alert.classList.add(alertClass);
	alert.style.display = 'block';
	setTimeout(() => {
		alert.style.display = 'none';
	}, 3000)
}