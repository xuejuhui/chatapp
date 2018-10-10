import React from 'react';
import io from 'socket.io-client';
import { USER_CONNECTED, LOGOUT } from '../Events';
import LoginForm from './LoginForm';
import ChatContainer from './chats/ChatContainer';

const socketUrl = 'http://localhost:5000'
export default class Layout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			socket:null,
			user:null
		};
	}

	componentWillMount() {
		this.initSocket()
	}

	// Connect and initalizes socket

	initSocket = ()=>{
		const socket = io(socketUrl)
		socket.on('connect', ()=>{
			console.log('connected')
		})
		this.setState({ socket });
	}

	setUser = (user)=>{
		const { socket } = this.state
		socket.emit(USER_CONNECTED, user);
		this.setState({
			user 
		});
	}

	logout = ()=>{
		const { socket } = this.state
		socket.emit(LOGOUT);
		this.setState({
			user:null 
		});
	}

	render() {
		const { title } = this.props
		const { socket, user } = this.state
		return (
			<div className="container">
				{  
				!user?
				<LoginForm socket={ socket } setUser={this.setUser}/>	
				:
				<ChatContainer socket={ socket } user={user} logout={this.logout}/>
				}	
			</div>				
		);
	}
}
