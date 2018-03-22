import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import axios from 'axios';


export default class SignUp extends Component {

  state = {
    firstName: '',
    lastName: '',
    email: '',
  }

  handleChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    const postData = {
      profile : {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        login: this.state.email
      }
    };

    const apiToken = "00hrOoFyIT8AesDcuXxPpK6u_NtuWzb7yDKq5VQaz3";

    const axiosConfig = {
      headers : {
        "Accept": `application/json`,
        "Content-Type": `application/json`,
        "Authorization": `SSWS ${apiToken}`,
      }
    };

    const baseUrl = 'https://dev-438691.oktapreview.com/';  
    console.log(postData);

    axios.post(`${baseUrl}api/v1/users?activate=true`, postData, axiosConfig)
      .then(res => {
        console.log(res);
        console.log(res.data);
        //Redirect

      }, (err => {
        console.log(err);
      }))
  }

  render() {
  
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Nom:
            <input type="text" name="lastName" onChange={this.handleChange} />
          </label>
          <label>
            Prenom:
            <input type="text" name="firstName" onChange={this.handleChange} />
          </label>
          <label>
            Email:
            <input type="text" name="email" onChange={this.handleChange} />
          </label>
          <button type="submit">Add</button>
        </form>
      </div>
    );
  }
};