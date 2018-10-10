import React from 'react';
// import FADown from 'react-icons/lib/md/keyboard-arrow-down';
// import FAMenu from 'react-icons/fa/list-ul';
// import FASearch from 'react-icons/fa/search';
// import MdEject from 'react-icons/md/eject';
import SideBarOption from './SideBarOption'
import {
	get,
	last
} from 'lodash';


export default class SideBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			reciever: ""
		}
	}
	handleSubmit = (e) => {
		e.preventDefault()
		const {
			reciever
		} = this.state
		const {
			sendPrivateMessage
		} = this.props
		sendPrivateMessage(reciever)
		console.log(reciever)
	}
	render() {
		const {
			chats,
			activeChat,
			user,
			setActiveChat,
			logout
		} = this.props
		const {
			reciever
		} = this.state
		return ( <
			div id = "side-bar" >
			<
			form onSubmit = {
				this.handleSubmit
			}
			className = "search" >
			<
			input placeholder = "Search"
			type = "text"
			value = {
				reciever
			}
			onChange = {
				(e) => {
					this.setState({
						reciever: e.target.value
					});
				}
			}
			/> <
			div className = "plus" > < /div> <
			/form> <
			div className = "users"
			ref = "users"
			onClick = {
				(e) => {
					(e.target === this.refs.user) && setActiveChat(null)
				}
			} >

			{
				chats.map((chat) => {
					if (chat.name) {
						// const lastMessage = chat.messages[chat.messages.length-1];

						const sideName = chat.users.find((name) => {
							return name !== user.name
						}) || "Community"
						const classNames = (activeChat && activeChat.id === chat.id) ? 'active' : ""

						return ( <
							SideBarOption key = {
								chat.id
							}
							name = {
								chat.name
							}
							lastMessage = {
								get(last(chat.message), 'message', '')
							}
							active = {
								activeChat.id === chat.id
							}
							onClick = {
								() => {
									this.props.setActiveChat(chat)
								}
							}
							/>


						)
					}
					return null
				})
			}


			<
			/div> <
			div className = "current-user" >
			<
			span > {
				user.name
			} < /span> <
			div onClick = {
				() => {
					logout()
				}
			}
			title = "logout"
			className = "logout" >
			<
			button > logout < /button> <
			/div> <
			/div> <
			/div>
		);
	}
}