
/* global window */
import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import decode from 'jwt-decode';
import axios from 'axios';

import Home from '../Home/Home';
import Topbar from '../Topbar/Topbar';
import Pricings from '../Pricings/Pricings';
import Explorer from '../Explorer/Explorer';
import PrivateRoute from '../PrivateRoute/PrivateRoute';

import './styles/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
    };
    this.apiUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'https://valparaiso-mockup.herokuapp.com';
  }

  componentWillMount = () => {
    console.log(this.apiUrl);
    const auth = JSON.parse(window.localStorage.getItem('auth'));
    if (auth) {
      const decoded = decode(auth.token);
      if (decoded.exp) {
        // Recup l'heure du serveur, si l'expiration est passé, auth = false
        axios.get(`${this.apiUrl}/time`).then((res) => {
          console.log(`API Url : ${this.apiUrl}`);
          if (res.data < (decoded.exp * 1000)) {
            this.authenticate();
          } else {
            this.logout();
          }
        });
      }
    }
  }

  authenticate = () => {
    this.setState({ isAuthenticated: true });
  }

  logout = () => {
    this.setState({ isAuthenticated: false });
    window.localStorage.removeItem('auth');
  };

  render() {
    console.log(process.env);
    return (
      <Router>
        <Fragment>
          <Route
            path="/"
            component={() => (<Topbar
              logout={this.logout}
              authenticate={this.authenticate}
              apiUrl={this.apiUrl}
              isAuthenticated={this.state.isAuthenticated}
            />)}
          />
          <Route path="/" exact component={Home} />
          <Route path="/pricing" exact component={Pricings} />
          <PrivateRoute
            path="/browse"
            exact
            auth={this.state.isAuthenticated}
            component={() =>
                (<Explorer
                  apiUrl={this.apiUrl}
                />)}
          />
        </Fragment>
      </Router>

    );
  }
}

export default App;
