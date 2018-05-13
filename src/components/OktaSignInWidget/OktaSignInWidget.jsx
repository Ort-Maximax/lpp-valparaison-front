import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import '@okta/okta-signin-widget/dist/css/okta-theme.css';

import Eagle from '../../img/svg/logo.svg';

class OktaSignInWidget extends Component {
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    this.widget = new OktaSignIn({
      baseUrl: this.props.baseUrl,
      logo: Eagle,
      clientId: '0oaee9k1e3g9di0nS0h7',
      idps: [
        { type: 'GOOGLE', id: '0oaed8nypg1lcekav0h7' },
        /*
        TODO: A METTRE EN PROD
        {type: 'FACEBOOK', id: '0oaefphiatHspHxEK0h7'},
        */
      ],
      redirectUri: 'http://localhost:3000/implicit/callback',
    });
    this.widget.renderEl({ el }, this.props.onSuccess, this.props.onError);
  }

  componentWillUnmount() {
    this.widget.remove();
  }

  render() {
    return (
      <section />
    );
  }
}

OktaSignInWidget.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,

};

export default withRouter(OktaSignInWidget);
