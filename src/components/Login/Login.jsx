/* global window, Blob, fetch */
import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

import './styles/Login.css';

class Login extends Component {
  onFailure = (error) => {
    console.log(error);
  }

  logout = () => {
    this.props.logout();
  };

 googleResponse = (response) => {
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
       this.props.history.push('/browse');
     });
   });
 };


 render() {
   return this.props.authenticated ?
     <Redirect to={{ pathname: '/browse' }} /> :

     <GoogleLogin
       clientId="979187681926-as6gk94f9pfhl2ob739rjn8lhnk37oqv.apps.googleusercontent.com"
       onSuccess={this.googleResponse}
       onFailure={this.googleResponse}
       className="test"
     >
       <div> <b>G</b> Connectez-vous</div>
     </GoogleLogin>;
 }
}

export default withRouter(Login);
