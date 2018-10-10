export default function() {

	const io = require('socket.io-client');

	const socket = io.connect('http://localhost:5000');


	function registerHandler(onMessage){
		socket.on('message', onMessage);
	}

	function unregister(){
		socket.off('message');
	}

	socket.on('error',function(err){
		console.log(err);
	})


	function register(name, cb){
		socket.emit('register', name, cb);
	}

	function join(chatRoom, cb){
		socket.emit('join', chatRoom, cb);
	}

	function leave(chatRoom, cb){
		socket.emit('leave', chatRoom, cb);
	}

	function message(chatRoom, msg, cb){
		socket.emit('message', {chatRoom, message: msg}, cb);
	}

	function getChatrooms(cb){
		socket.emit('chatrooms', null, cb);
	}

	function getUsers(cb){
		socket.emit('users', null, cb);
	}

	return {
		register,
		join,
		leave,
		message,
		getChatrooms,
		getUsers,
		registerHandler,
		unregister,
	}

}