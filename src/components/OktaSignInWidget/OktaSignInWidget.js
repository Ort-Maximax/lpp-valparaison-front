import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import ReactDOM from 'react-dom';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import '@okta/okta-signin-widget/dist/css/okta-theme.css';

export default withRouter(class OktaSignInWidget extends Component {
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    this.widget = new OktaSignIn({
      baseUrl: this.props.baseUrl,
      logo:'https://image.freepik.com/free-icon/eagle-silhouette-in-flight_318-42771.jpg',
      clientId: '0oaee9k1e3g9di0nS0h7',
      idps: [
        {type: 'GOOGLE', id: '0oaed8nypg1lcekav0h7'},
        /*
        A METTRE EN PROD
        {type: 'FACEBOOK', id: '0oaefphiatHspHxEK0h7'},
        */
      ],
      redirectUri: 'http://localhost:3000/implicit/callback',
      customButtons: [{
        title: `S'inscrire`,
        className: 'btn-customAuth',
        click: () => {
          // clicking on the button navigates to another page

          this.props.history.push('/signup');
        }
      }]
    });
    this.widget.renderEl({el}, this.props.onSuccess, this.props.onError);
  }

  componentWillUnmount() {
    this.widget.remove();
  }

  render() {
    return (
        <div/>
    );
  }
});