import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';

import OktaSignInWidget from './OktaSignInWidget/OktaSignInWidget';
import Signup from './Signup/Signup';

import './styles/Login.css';

export default withAuth(class Login extends Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.state = {
      authenticated: null,
      value: 0,
    };
    this.checkAuthentication();
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  onSuccess(res) {
    console.log(res);
    return this.props.auth.redirect({
      sessionToken: res.idToken,
    });
  }

  onError(err) {
    console.log('error logging in', err);
    console.log(this);
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

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
          <OktaSignInWidget
            baseUrl={this.props.baseUrl}
            onSuccess={this.onSuccess}
            onError={this.onError}
          />
        }
        {value === 1 && <Signup /> }
      </div>;
  }
});
