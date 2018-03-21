import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import Home from './Home';
import Login from './Login';
import Protected from './Protected';

function onAuthRequired({history}) {
  history.push('/login');
}

class App extends Component {
  render() {
    return (
      <Router>
        <Security issuer='https://dev-438691.oktapreview.com/oauth2/default'
                  client_id='0oaee9k1e3g9di0nS0h7'
                  redirect_uri={window.location.origin + '/implicit/callback'}
                  onAuthRequired={onAuthRequired} >
          <Route path='/' exact={true} component={Home} />
          <SecureRoute path='/protected' component={Protected} />
          <Route path='/login' render={() => <Login baseUrl='https://dev-438691.oktapreview.com' />} />
          <Route path='/implicit/callback' component={ImplicitCallback} />
        </Security>
      </Router>
    );
  }
}

export default App;