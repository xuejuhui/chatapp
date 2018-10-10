import React from 'react';
import SideBar from '../sidebar/SideBar'
import { MESSAGE_SENT, TYPING, COMMUNITY_CHAT, MESSAGE_RECIEVED, PRIVATE_MESSAGE } from '../../Events';
import ChatHeading from './ChatHeading';
import Messages from '../messages/Messages'
import MessageInput from '../messages/MessageInput'

export default class ChatContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state ={
			chats:[],
			activeChat:null
		};
	}

	componentDidMount() {
		const { socket, user } = this.props
		socket.emit(COMMUNITY_CHAT, this.resetChat)
		socket.on(PRIVATE_MESSAGE, this.addChat)
		console.log(this.state.chats)
	}

	sendOpenPrivateMessage = (reciever)=>{
		const { socket, user } = this.props
		socket.emit(PRIVATE_MESSAGE, {reciever, sender:user.name})
	}

	resetChat = (chat)=>{
		return this.addChat(chat, true)
	}

	addChat =(chat, reset)=>{
		console.log(chat)
		const { socket } = this.props
		const { chats } = this.state
		const newChats = reset ? [chat] : [...chats, chat]
		this.setState({chats:newChats, activeChat:reset ? chat: this.state.activeChat})

		const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`
		const typingEvent = `${TYPING}-${chat.id}`

		socket.on(typingEvent, this.updateTypingInChat(chat.id))
		socket.on(messageEvent, this.addMessageToChat(chat.id))
	}

	addMessageToChat =(chatId)=>{
		return message =>{
			const { chats } = this.state
			let newChats = chats.map((chat)=>{
				if(chat.id===chatId)
					chat.message.push(message)
				return chat
			})

			this.setState({
				chats:newChats 
			});
		}

	}
	updateTypingInChat = (chatId) =>{
		return ({isTyping, user})=>{
			if(user !== this.props.user.name){

				const { chats } = this.state

				let newChats = chats.map((chat)=>{
					if(chat.id === chatId){
						if(isTyping && !chat.typingUsers.includes(user)){
							chat.typingUsers.push(user)
						}else if(!isTyping && chat.typingUsers.includes(user)){
							chat.typingUsers = chat.typingUsers.filter(u => u !== user)
						}
					}
					return chat
				})
				this.setState({chats:newChats})
			}
		}
	}

	sendMessage = (chatId, message)=>{
		const { socket } = this.props
		socket.emit(MESSAGE_SENT, {chatId, message})
	}
	sendTyping = (chatId, isTyping)=>{
		const { socket } = this.props
		socket.emit(TYPING, {chatId, isTyping})
	}

	setActiveChat = (activeChat)=>{
		this.setState({
			activeChat 
		});
	}
	render() {
		const { user, logout } = this.props
		const {chats, activeChat } = this.state
		return (
			<div className="container">
				<SideBar 
					logout={logout}
					chats={chats}
					user={user}
					activeChat={activeChat}
					setActiveChat={this.setActiveChat}
					sendPrivateMessage={this.sendOpenPrivateMessage}/>


				<div className="chat-room-container">
					{
						activeChat !== null ? (
								<div className="chat-room">
									<ChatHeading name={activeChat.name}/>
									<Messages 
										messages={activeChat.message}
										user={user}
										typingUsers={activeChat.typingUsers}/>
									<MessageInput 
										sendMessage={(message)=>{
											this.sendMessage(activeChat.id, message)
										}}
										sendTyping={(isTyping)=>{
											this.sendTyping(activeChat.id, isTyping)
										}}/>
								</div>
							) :
						<div className="chat-room-choose">
							<h3>Choose a Chat</h3>
						</div>
					}
				</div>
			</div>
		);
	}
}
