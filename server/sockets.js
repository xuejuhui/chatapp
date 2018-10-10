const { PRIVATE_MESSAGE,VERIFY_USER, TYPING , USER_CONNECTED, LOGOUT, COMMUNITY_CHAT, USER_DISCONNECTED ,MESSAGE_RECIEVED,MESSAGE_SENT  } = require('../src/Events')
const {createUser, createMessage, createChat } = require('../src/Chat')
var sockets = {};

let connectedUsers = {};
let communityChat = createChat();
sockets.init = function (server) {
    // socket.io setup
    var io = require('socket.io').listen(server);

    io.on('connection', function(client){
        let sendMessageToChatFromUser;
        let sendTypingFromUser;

        client.on(VERIFY_USER, (nickname, callback)=>{
            if(isUser(connectedUsers, nickname)){
                callback({isUser:true, user:null})
            }else{
                callback({isUser:false, user:createUser({name:nickname, socketId:client.id})})
            }
        })

        client.on(USER_CONNECTED, (user)=>{
            user.socketId = client.id
            connectedUsers = addUser(connectedUsers, user);
            client.user = user
            sendMessageToChatFromUser = sendMessageToChat(user.name, io);
            sendTypingFromUser = sendTypingToChat(user.name, io)
            io.emit(USER_CONNECTED, connectedUsers)
            console.log(connectedUsers)
        })


        client.on(COMMUNITY_CHAT, (callback)=>{
            callback(communityChat)
        })

        client.on(MESSAGE_SENT, ({chatId, message})=>{
            sendMessageToChatFromUser( chatId, message )
        })
        client.on(TYPING, ({chatId, isTyping})=>{
            sendTypingFromUser(chatId, isTyping)
        })

        client.on(PRIVATE_MESSAGE, ({reciever, sender})=>{
            if(reciever in connectedUsers){
                const newChat = createChat({name:`${reciever}&${sender}`, users:[reciever, sender]})
                const recieverSocket = connectedUsers[reciever].socketId;
                client.to(recieverSocket).emit(PRIVATE_MESSAGE, newChat)
                client.emit(PRIVATE_MESSAGE, newChat)
            }else{
                console.log("user not connected")
            }
        })

        client.on('disconnect', ()=>{
            if("user" in client){
                connectedUsers = removeUser(connectedUsers, client.user.name)
                io.emit(USER_DISCONNECTED, connectedUsers)
                console.log(connectedUsers)
            } 

        })
        console.log(client.user)
        client.on(LOGOUT,()=>{
                connectedUsers = removeUser(connectedUsers, client.user.name)
                io.emit(USER_DISCONNECTED, connectedUsers)
                console.log(connectedUsers)
        })

        // client.on('register', handleRegister)

        // client.on('join', handleJoin)

        // client.on('leave', handleLeave)

        // client.on('message', handleMessage)

        // client.on('chatrooms', handleChatRooms)

        // client.on('users', handleUsers)

        // client.on('disconnect', function(){
        //     console.log('client disconnect', client.id)
        //     handleDisconnect();
        // })

        client.on('error', function(err){
            console.log(err)
        })


    })
}
function sendTypingToChat(user, io){
    return (chatId, isTyping)=>{
         io.emit(`${TYPING}-${chatId}`, {user, isTyping})
    }
}

function sendMessageToChat(sender, io){
    return (chatId, message)=>{
        io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({message, sender}))
    }
}

function isUser(userList, username){
    return username in userList
}

function removeUser(userList, username){
    let newList = Object.assign({}, userList)
    delete newList[username]
    return newList
}

function addUser(userList, user){
    let newList = Object.assign({}, userList)
    newList[user.name] = user
    return newList
}


module.exports = sockets;