import React from 'react';
import { VERIFY_USER } from '../Events'

export default class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			nickname:"",
			error:""
		}
	}

	setUser = ({user, isUser})=>{
		console.log(user, isUser)
		if(isUser){
			this.setError("User name is taken")
		}else{
			this.setError("")
			this.props.setUser(user)
		}
	}
	handleChange = (e)=>{
		this.setState({nickname: e.target.value});
	}
	handleSubmit = (e)=>{
		e.preventDefault()
		const { socket } = this.props
		const { nickname } = this.state
		socket.emit(VERIFY_USER, nickname, this.setUser)
		document.getElementById('nickname').value = ""
	}
	setError = (error)=>{
		this.setState({
			error 
		});
	}

	render() {
		const { error } = this.state
		return (
			<div className="login">
				<form onSubmit={this.handleSubmit} className="login-form">
					<label>Nickname</label>
					<input 
					type = "text"
					id = "nickname"
					onChange = { this.handleChange }
					placeholder = { "UserName" }/>
					<div className="error"> {error? error:null}</div>
					<input type="submit"/>

				</form>
			</div>
		);
	}
}
