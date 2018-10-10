function handleRegister(userName, callback) {
	if(!clientManager.isUserAvailable(userName))
		return callback('user is not availble');

	const user = clientManager.getUserByName(userName);
	clientManager.registerClient(client, user);

	return callback(null, user);
}

function handleEvent(chatRoomName, createEntry) {
	return ensureValidChatroomAndUserSelected(chatRoomName)
	.then(function ({chatroom, user}) {
		const entry = {user, ...createEntry() }
		chatroom.addEntry(entry)


		chatroom.broadcastMessage({chat: chatRoomName, ...entry})
		return chatroom
	})
}