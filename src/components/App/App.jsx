/* eslint react/prefer-stateless-function: 0 */ // --> OFF
/* global window */
import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import Home from '../Home/Home';
import Topbar from '../Topbar/Topbar';
import Login from '../Login/Login';
/* import Signup from '../Signup/Signup'; */
import Protected from '../Protected/Protected';

import './App.css';

function onAuthRequired({ history }) {
  history.push('/login');
}

class App extends Component {
  render() {
    return (
      <Fragment>
        <Router>
          <Security
            issuer="https://dev-438691.oktapreview.com/oauth2/default"
            client_id="0oaee9k1e3g9di0nS0h7"
            redirect_uri={`${window.location.origin}/implicit/callback`}
            onAuthRequired={onAuthRequired}
          >
            <Route path="/*" component={Topbar} />
            <Route path="/" exact component={Home} />
            {/* <Route path="/signup" exact component={Signup} /> */}
            <SecureRoute path="/protected" component={Protected} />
            <Route path="/login" render={() => <Login baseUrl="https://dev-438691.oktapreview.com" />} />
            <Route path="/implicit/callback" component={ImplicitCallback} />
          </Security>
        </Router>
      </Fragment>
    );
  }
}

export default App;
