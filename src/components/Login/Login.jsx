import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import OktaSignInWidget from '../OktaSignInWidget/OktaSignInWidget';


export default withAuth(class Login extends Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.state = {
      authenticated: null,
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

  render() {
    if (this.state.authenticated === null) return null;
    return this.state.authenticated ?
      <Redirect to={{ pathname: '/' }} /> :
      <OktaSignInWidget
        baseUrl={this.props.baseUrl}
        onSuccess={this.onSuccess}
        onError={this.onError}
      />;
  }
});
