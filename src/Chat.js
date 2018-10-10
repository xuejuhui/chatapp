const uuidv4 = require('uuid/v4');

/*create User
	create a user
	id
	name
*/
const  createUser = ({name="", socketId=null} = {})=>(
	{
		id:uuidv4(),
		name,
		socketId
	}


);
/*create Message
	create a Message
	id
	time
	message
	sender
*/
const createMessage = ({sender='', message=''} = {})=>(
	{
		id:uuidv4(),
		time:Date.now(),
		message,
		sender
	}

)
/*create Chat
	create a chat
	id
	name
	message
	users
*/
const createChat = ({users=[], message=[],name='Community'} = {})=>(
	{
		id:uuidv4(),
		message,
		users,
		name,
		typingUsers:[]
	}

)

module.exports = {
	createUser,
	createChat,
	createMessage
}