/* global window, Blob, fetch */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';


import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';

import { GoogleLogin } from 'react-google-login';
import Signup from './Signup/Signup';

import './styles/Login.css';

export default (class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  componentDidUpdate() {
  }

  onFailure = (error) => {
    console.log(error);
  }

  logout = () => {
    this.props.logout();
  };

  /*
  twitterResponse = (e) => {};

  facebookResponse = (e) => {};
  */

 googleResponse = (response) => {
   /*
   const auth = {
     tokenObj: response.tokenObj,
     profileObj: response.profileObj,
   };

   window.localStorage.setItem('auth', JSON.stringify(auth)); */


   const tokenBlob = new Blob([JSON.stringify({ access_token: response.accessToken }, null, 2)], { type: 'application/json' });
   const options = {
     method: 'POST',
     body: tokenBlob,
     mode: 'cors',
     cache: 'default',
   };
   // TODO: Axios
   fetch(`${this.props.apiUrl}/auth/google`, options).then((r) => {
     r.json().then((auth) => {
       window.localStorage.setItem('auth', JSON.stringify(auth));
       this.props.authenticate();
     });
   });
 };


  handleChange = (event, value) => {
    this.setState({ value });
  };


  render() {
    const { value } = this.state;

    if (this.state.authenticated === null) return null;
    return this.state.authenticated ?
      <Redirect to={{ pathname: '/' }} /> :
      <div className="forms-container">
        <AppBar position="static" className="tabsHeader">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Connexion" />
            <Tab label="Inscription" />
          </Tabs>
        </AppBar>
        {value === 0 &&
        <GoogleLogin
          clientId="979187681926-as6gk94f9pfhl2ob739rjn8lhnk37oqv.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={this.googleResponse}
          onFailure={this.googleResponse}
        />
        }
        {value === 1 && <Signup /> }
      </div>;
  }
});
